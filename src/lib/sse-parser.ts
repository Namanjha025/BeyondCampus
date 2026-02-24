// Server-Sent Events parser for LangGraph streaming responses
export interface SSEEvent {
  event: string
  data: unknown
  raw: string
}

export interface StreamingMessage {
  content: string
  type: 'ai' | 'human'
  complete: boolean
}

// Parse SSE chunk and return complete events
export function parseSSEChunk(chunk: string, buffer: string): { events: SSEEvent[], newBuffer: string } {
  buffer += chunk
  
  // Split by lines, keeping incomplete line in buffer
  const lines = buffer.split('\n')
  const newBuffer = lines.pop() || ''
  
  const events: SSEEvent[] = []
  let currentEvent = ''
  let currentData = ''
  
  for (const line of lines) {
    const cleanLine = line.replace(/\r$/, '') // Remove trailing \r
    
    if (cleanLine === '') {
      // Empty line signals end of SSE event
      if (currentEvent && currentData) {
        try {
          const parsedData = JSON.parse(currentData)
          events.push({
            event: currentEvent,
            data: parsedData,
            raw: currentData
          })
        } catch (parseError) {
          console.warn('SSE JSON parse error:', parseError, 'Event:', currentEvent, 'Data:', currentData)
        }
        
        // Reset for next event
        currentEvent = ''
        currentData = ''
      }
    } else if (cleanLine.startsWith('event: ')) {
      currentEvent = cleanLine.slice(7).trim()
    } else if (cleanLine.startsWith('data: ')) {
      const dataLine = cleanLine.slice(6)
      currentData += (currentData ? '\n' : '') + dataLine
    }
  }
  
  return { events, newBuffer }
}

// Extract AI message content from LangGraph events
export function extractAIContent(event: SSEEvent): StreamingMessage | null {
  const { event: eventType, data } = event
  
  // Handle messages/partial events for real-time streaming
  if (eventType === 'messages/partial' && Array.isArray(data)) {
    const aiMessage = data.find((m: unknown) => 
      typeof m === 'object' && m !== null && 
      (m as { type?: string }).type === 'ai'
    ) as { content?: string } | undefined
    
    if (aiMessage?.content) {
      return {
        content: aiMessage.content,
        type: 'ai',
        complete: false
      }
    }
  }
  
  // Handle values events for final complete messages
  if (eventType === 'values' && 
      typeof data === 'object' && data !== null && 
      'messages' in data && 
      Array.isArray((data as { messages: unknown }).messages)) {
    
    const messages = (data as { messages: unknown[] }).messages
    const aiMessage = messages.find((m: unknown) => 
      typeof m === 'object' && m !== null && 
      (m as { type?: string }).type === 'ai'
    ) as { content?: string } | undefined
    if (aiMessage?.content) {
      return {
        content: aiMessage.content,
        type: 'ai',
        complete: true
      }
    }
  }
  
  return null
}

// Utility function to create a streaming response handler
export async function* streamLangGraphResponse(
  response: Response,
  onMessage?: (message: StreamingMessage) => void
) {
  if (!response.body) {
    throw new Error('Response body is null')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const { events, newBuffer } = parseSSEChunk(chunk, buffer)
      buffer = newBuffer
      
      // Process each complete event
      for (const event of events) {
        const streamingMessage = extractAIContent(event)
        
        if (streamingMessage) {
          if (onMessage) {
            onMessage(streamingMessage)
          }
          yield streamingMessage
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// Simple SSE parser class for stateful parsing
export class SSEParser {
  private buffer = ''

  parseChunk(chunk: string): SSEEvent[] {
    const { events, newBuffer } = parseSSEChunk(chunk, this.buffer)
    this.buffer = newBuffer
    return events
  }

  extractMessage(event: SSEEvent): StreamingMessage | null {
    return extractAIContent(event)
  }

  reset(): void {
    this.buffer = ''
  }
}