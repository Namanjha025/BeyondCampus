// DEPRECATED: Use langGraphClient instead
// This file is kept for backward compatibility but should not be used in new code
// Use @/lib/langgraph-client and @/lib/sse-parser instead

// Server-side assistant client for BFF
import { randomUUID } from 'crypto'

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 2,
  baseDelay: 1000, // 1 second
  maxDelay: 5000,  // 5 seconds
  jitter: true
}

// Timeout configuration
const TIMEOUT_MS = 25000 // 25 seconds

// Sleep with jitter for retries
function sleep(ms: number, withJitter = false): Promise<void> {
  const delay = withJitter ? ms + Math.random() * 1000 : ms
  return new Promise(resolve => setTimeout(resolve, delay))
}

interface AssistantConfig {
  trainerUrl: string
  chatUrl: string
  sharedToken: string
}

interface TrainerRequest {
  user_id?: string
  user_name?: string
  notebook_id?: string
  chapter_id?: string
  thread_id: string
  text: string
}

interface ChatRequest {
  text: string
  notebook_id?: string
  chapter_id?: string
  viewer_thread_id?: string
}

interface AssistantResponse {
  ai_text: string
  citations?: Array<{
    type: string
    notebook_id?: string
    chapter_id?: string
    title?: string
  }>
}

class AssistantClient {
  private config: AssistantConfig

  constructor() {
    this.config = {
      trainerUrl: process.env.TRAINER_SERVICE_URL || 'http://localhost:8123',
      chatUrl: process.env.CHAT_SERVICE_URL || 'http://localhost:8124', 
      sharedToken: process.env.AI_SHARED_TOKEN || 'shared-secret-token'
    }
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    correlationId: string
  ): Promise<Response> {
    let lastError: Error

    for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
      try {
        // Add timeout to fetch
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        
        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          return response
        }

        // Retry on 5xx or 429 (rate limit)
        if (response.ok || (attempt === RETRY_CONFIG.maxRetries)) {
          return response
        }

        console.log(`[${correlationId}] Attempt ${attempt + 1} failed: ${response.status}, retrying...`)
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`)

      } catch (error) {
        console.log(`[${correlationId}] Attempt ${attempt + 1} failed:`, error.message)
        lastError = error as Error

        if (attempt === RETRY_CONFIG.maxRetries) {
          break
        }
      }

      // Calculate delay with exponential backoff
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = Math.min(
          RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
          RETRY_CONFIG.maxDelay
        )
        await sleep(delay, RETRY_CONFIG.jitter)
      }
    }

    throw lastError
  }

  // Backward compatibility method that returns streaming response
  async callTrainer(
    twinId: string, 
    request: TrainerRequest,
    correlationId?: string
  ): Promise<Response> {
    return this.callTrainerStream(twinId, request, correlationId)
  }

  async callTrainerStream(
    twinId: string, 
    request: TrainerRequest,
    correlationId?: string
  ): Promise<Response> {
    const startTime = Date.now()
    const corrId = correlationId || randomUUID()

    try {
      console.log(`[${corrId}] Trainer request:`, {
        twin_id: twinId,
        notebook_id: request.notebook_id,
        chapter_id: request.chapter_id,
        thread_id: request.thread_id,
        text_length: request.text.length
      })

      // Step 1: Create or get thread in LangGraph
      const threadId = await this.getOrCreateThread(request.thread_id, corrId)
      
      // Step 2: Get assistant ID  
      const assistantId = await this.getOrCreateAssistant('twin_trainer', corrId)

      // Step 3: Stream the conversation
      const response = await fetch(
        `${this.config.trainerUrl}/threads/${threadId}/runs/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.sharedToken}`,
            'X-Correlation-ID': corrId,
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify({
            assistant_id: assistantId,
            input: {
              user_id: request.user_id || 'unknown_user',
              user_name: request.user_name || 'User',
              twin_id: twinId,
              twin_status: 'TRAINING',
              messages: [
                {
                  type: 'human',
                  content: request.text
                }
              ]
            },
            config: {
              configurable: {
                twin_id: twinId,
                user_id: request.user_id,
                user_name: request.user_name,
                notebook_id: request.notebook_id,
                chapter_id: request.chapter_id,
                thread_id: threadId
              }
            },
            stream_mode: ['messages', 'values']  // Stream both messages and final values
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Trainer service error: ${response.status} ${response.statusText}`)
      }

      const latency = Date.now() - startTime
      console.log(`[${corrId}] Trainer streaming started: ${latency}ms`)

      // Return the response for streaming - BFF will handle the actual streaming
      return response

    } catch (error) {
      const latency = Date.now() - startTime
      console.error(`[${corrId}] Trainer error (${latency}ms):`, error)
      throw new Error(`Trainer service failed: ${error.message}`)
    }
  }

  // Helper method to get or create thread in LangGraph
  private async getOrCreateThread(preferredThreadId: string, corrId: string): Promise<string> {
    try {
      // Create a new thread in LangGraph (ignore the preferred ID for now)
      const response = await this.fetchWithRetry(
        `${this.config.trainerUrl}/threads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.sharedToken}`,
            'X-Correlation-ID': corrId
          },
          body: JSON.stringify({
            metadata: { 
              preferred_id: preferredThreadId,
              created_by: 'BFF'
            }
          })
        },
        corrId
      )

      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.status}`)
      }

      const thread = await response.json()
      console.log(`[${corrId}] Created LangGraph thread:`, thread.thread_id)
      return thread.thread_id

    } catch (error) {
      console.error(`[${corrId}] Thread creation error:`, error)
      // Fallback - this will likely fail but worth trying
      return preferredThreadId
    }
  }

  // Helper method to get or create assistant
  private async getOrCreateAssistant(graphId: string, corrId: string): Promise<string> {
    try {
      // For now, create a new assistant each time
      // In production, you'd want to cache these
      const response = await this.fetchWithRetry(
        `${this.config.trainerUrl}/assistants`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.sharedToken}`,
            'X-Correlation-ID': corrId
          },
          body: JSON.stringify({
            graph_id: graphId,
            config: {},
            metadata: { created_by: 'BFF', twin_training: true }
          })
        },
        corrId
      )

      if (!response.ok) {
        throw new Error(`Failed to create assistant: ${response.status}`)
      }

      const assistant = await response.json()
      console.log(`[${corrId}] Created assistant:`, assistant.assistant_id)
      return assistant.assistant_id

    } catch (error) {
      console.error(`[${corrId}] Assistant creation error:`, error)
      // Fallback - use a hardcoded assistant ID if creation fails
      return 'twin_trainer'
    }
  }

  async callChat(
    twinId: string,
    request: ChatRequest, 
    correlationId?: string
  ): Promise<AssistantResponse> {
    const startTime = Date.now()
    const corrId = correlationId || randomUUID()

    try {
      console.log(`[${corrId}] Chat request:`, {
        twin_id: twinId,
        notebook_id: request.notebook_id,
        chapter_id: request.chapter_id,
        viewer_thread_id: request.viewer_thread_id,
        text_length: request.text.length
      })

      // Create thread and assistant for chat service
      const threadId = await this.getOrCreateChatThread(request.viewer_thread_id || `chat_${randomUUID()}`, corrId)
      const assistantId = await this.getOrCreateChatAssistant('ai_twin', corrId)

      const response = await this.fetchWithRetry(
        `${this.config.chatUrl}/threads/${threadId}/runs/wait`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.sharedToken}`,
            'X-Correlation-ID': corrId
          },
          body: JSON.stringify({
            assistant_id: assistantId,
            input: {
              twin_id: twinId,
              messages: [
                {
                  type: 'human', 
                  content: request.text
                }
              ]
            },
            config: {
              configurable: {
                twin_id: twinId,
                thread_id: threadId
              }
            }
          })
        },
        corrId
      )

      if (!response.ok) {
        throw new Error(`Chat service error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const latency = Date.now() - startTime

      console.log(`[${corrId}] Chat response: ${latency}ms`)

      // Extract AI text and citations from LangGraph response
      const aiMessage = data.output?.messages?.find((m: any) => m.type === 'ai')
      const aiText = aiMessage?.content || 'No response from chat service'
      const citations = data.output?.citations || []

      return { 
        ai_text: aiText,
        citations: citations.map((c: any) => ({
          type: c.type || 'unknown',
          notebook_id: c.notebook_id,
          chapter_id: c.chapter_id, 
          title: c.title
        }))
      }

    } catch (error) {
      const latency = Date.now() - startTime
      console.error(`[${corrId}] Chat error (${latency}ms):`, error)
      throw new Error(`Chat service failed: ${error.message}`)
    }
  }

  // Helper methods for chat service
  private async getOrCreateChatThread(preferredThreadId: string, corrId: string): Promise<string> {
    try {
      const response = await this.fetchWithRetry(
        `${this.config.chatUrl}/threads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.sharedToken}`,
            'X-Correlation-ID': corrId
          },
          body: JSON.stringify({
            metadata: { 
              preferred_id: preferredThreadId,
              created_by: 'BFF'
            }
          })
        },
        corrId
      )

      if (!response.ok) {
        throw new Error(`Failed to create chat thread: ${response.status}`)
      }

      const thread = await response.json()
      console.log(`[${corrId}] Created chat thread:`, thread.thread_id)
      return thread.thread_id

    } catch (error) {
      console.error(`[${corrId}] Chat thread creation error:`, error)
      return preferredThreadId
    }
  }

  private async getOrCreateChatAssistant(graphId: string, corrId: string): Promise<string> {
    try {
      const response = await this.fetchWithRetry(
        `${this.config.chatUrl}/assistants`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.sharedToken}`,
            'X-Correlation-ID': corrId
          },
          body: JSON.stringify({
            graph_id: graphId,
            config: {},
            metadata: { created_by: 'BFF', twin_chat: true }
          })
        },
        corrId
      )

      if (!response.ok) {
        throw new Error(`Failed to create chat assistant: ${response.status}`)
      }

      const assistant = await response.json()
      console.log(`[${corrId}] Created chat assistant:`, assistant.assistant_id)
      return assistant.assistant_id

    } catch (error) {
      console.error(`[${corrId}] Chat assistant creation error:`, error)
      return 'ai_twin'
    }
  }
}

export const assistantClient = new AssistantClient()
export type { TrainerRequest, ChatRequest, AssistantResponse }