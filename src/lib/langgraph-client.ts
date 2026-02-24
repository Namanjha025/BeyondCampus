// Clean LangGraph API client for BeyondCampus
import { randomUUID } from 'crypto'

interface LangGraphConfig {
  trainerUrl: string
  chatUrl: string  
  sharedToken: string
}

interface StreamingRequest {
  assistantId: string
  threadId: string
  messages: Array<{
    type: 'human' | 'ai'
    content: string
  }>
  config?: {
    configurable?: Record<string, unknown>
  }
}

interface LangGraphThread {
  thread_id: string
  created_at: string
  metadata: Record<string, unknown>
}

interface LangGraphAssistant {
  assistant_id: string
  graph_id: string
  created_at: string
  metadata: Record<string, unknown>
}

interface LangGraphError extends Error {
  status?: number
  correlationId?: string
}

class LangGraphClient {
  private config: LangGraphConfig
  
  constructor() {
    this.config = {
      trainerUrl: process.env.TRAINER_SERVICE_URL || 'http://localhost:8123',
      chatUrl: process.env.CHAT_SERVICE_URL || 'http://localhost:8124',
      sharedToken: process.env.AI_SHARED_TOKEN || 'shared-secret-token'
    }
  }

  

  private async makeRequest<T>(
    url: string, 
    options: RequestInit,
    correlationId: string
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.sharedToken}`,
          'X-Correlation-ID': correlationId,
          ...options.headers
        }
      })

      if (!response.ok) {
        const error = new Error(`LangGraph API error: ${response.status} ${response.statusText}`) as LangGraphError
        error.status = response.status
        error.correlationId = correlationId
        
        // Try to get error details
        try {
          const errorData = await response.json()
          error.message = errorData.detail || error.message
        } catch {
          // Ignore JSON parse errors for error responses
        }
        
        throw error
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        const langGraphError = error as LangGraphError
        langGraphError.correlationId = correlationId
        throw langGraphError
      }
      throw error
    }
  }

  private async makeStreamingRequest(
    url: string,
    options: RequestInit,
    correlationId: string
  ): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.sharedToken}`,
          'X-Correlation-ID': correlationId,
          'Accept': 'text/event-stream',
          ...options.headers
        }
      })

      if (!response.ok) {
        const error = new Error(`LangGraph streaming error: ${response.status} ${response.statusText}`) as LangGraphError
        error.status = response.status
        error.correlationId = correlationId
        throw error
      }

      return response
    } catch (error) {
      if (error instanceof Error) {
        const langGraphError = error as LangGraphError
        langGraphError.correlationId = correlationId
        throw langGraphError
      }
      throw error
    }
  }

  // Thread management - get existing or create new
  async getOrCreateThread(preferredThreadId?: string, metadata?: Record<string, unknown>, correlationId?: string): Promise<LangGraphThread> {
    const corrId = correlationId || randomUUID()
    
    // Try to get existing thread first
    if (preferredThreadId) {
      try {
        console.log(`[${corrId}] Trying to get existing thread: ${preferredThreadId}`)
        const existingThread = await this.makeRequest<LangGraphThread>(
          `${this.config.trainerUrl}/threads/${preferredThreadId}`,
          { method: 'GET' },
          corrId
        )
        console.log(`[${corrId}] Found existing thread: ${existingThread.thread_id}`)
        return existingThread
      } catch (error) {
        console.log(`[${corrId}] Thread ${preferredThreadId} not found, creating new one`)
      }
    }
    
    // Create new thread
    console.log(`[${corrId}] Creating new thread...`)
    const newThread = await this.makeRequest<LangGraphThread>(
      `${this.config.trainerUrl}/threads`,
      {
        method: 'POST',
        body: JSON.stringify({
          metadata: {
            ...metadata,
            preferred_id: preferredThreadId,
            created_by: 'BFF'
          }
        })
      },
      corrId
    )
    console.log(`[${corrId}] Created new thread: ${newThread.thread_id}`)
    return newThread
  }

  // Legacy method for backward compatibility
  async createThread(metadata?: Record<string, unknown>, correlationId?: string): Promise<LangGraphThread> {
    return this.getOrCreateThread(undefined, metadata, correlationId)
  }

  // Assistant management
  async createAssistant(graphId: string, metadata?: Record<string, unknown>, correlationId?: string): Promise<LangGraphAssistant> {
    const corrId = correlationId || randomUUID()
    
    return this.makeRequest<LangGraphAssistant>(
      `${this.config.trainerUrl}/assistants`,
      {
        method: 'POST',
        body: JSON.stringify({
          graph_id: graphId,
          config: {},
          metadata: metadata || {}
        })
      },
      corrId
    )
  }

  // Streaming trainer communication
  async streamTrainerChat(request: StreamingRequest, correlationId?: string): Promise<Response> {
    const corrId = correlationId || randomUUID()
    
    console.log(`[${corrId}] Starting trainer stream for thread ${request.threadId}`)
    console.log(`[${corrId}] Assistant ID: ${request.assistantId}`)
    console.log(`[${corrId}] Messages:`, request.messages.map(m => `${m.type}: ${m.content.slice(0, 50)}...`))
    console.log(`[${corrId}] Config:`, request.config)
    
    const streamRequest = {
      assistant_id: request.assistantId,
      input: {
        messages: request.messages
      },
      config: request.config || { configurable: {} },
      stream_mode: ['messages', 'values'] as const
    }

    console.log(`[${corrId}] Making streaming request to: ${this.config.trainerUrl}/threads/${request.threadId}/runs/stream`)
    
    const response = await this.makeStreamingRequest(
      `${this.config.trainerUrl}/threads/${request.threadId}/runs/stream`,
      {
        method: 'POST',
        body: JSON.stringify(streamRequest)
      },
      corrId
    )
    
    console.log(`[${corrId}] Streaming request completed, status: ${response.status}`)
    return response
  }

  // Non-streaming chat communication (for regular chat interface)
  async streamChatResponse(request: StreamingRequest, correlationId?: string): Promise<Response> {
    const corrId = correlationId || randomUUID()
    
    console.log(`[${corrId}] Starting chat stream for thread ${request.threadId}`)
    
    const streamRequest = {
      assistant_id: request.assistantId,
      input: {
        messages: request.messages
      },
      config: request.config || { configurable: {} },
      stream_mode: ['messages', 'values'] as const
    }

    return this.makeStreamingRequest(
      `${this.config.chatUrl}/threads/${request.threadId}/runs/stream`,
      {
        method: 'POST',
        body: JSON.stringify(streamRequest)
      },
      corrId
    )
  }

  // Health check
  async healthCheck(service: 'trainer' | 'chat' = 'trainer'): Promise<boolean> {
    try {
      const url = service === 'trainer' ? this.config.trainerUrl : this.config.chatUrl
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(`${url}/health`, { 
        method: 'GET',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      return response.ok
    } catch {
      return false
    }
  }
}

export const langGraphClient = new LangGraphClient()
export type { LangGraphThread, LangGraphAssistant, LangGraphError, StreamingRequest }
