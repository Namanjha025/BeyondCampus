// React hook for LangGraph streaming
import { useState, useCallback } from 'react'

interface StreamingState {
  isStreaming: boolean
  error: string | null
  content: string
}

interface UseStreamingOptions {
  onMessage?: (content: string, isComplete: boolean) => void
  onError?: (error: Error) => void
  onComplete?: (finalContent: string) => void
}

export function useLangGraphStreaming(options: UseStreamingOptions = {}) {
  const [state, setState] = useState<StreamingState>({
    isStreaming: false,
    error: null,
    content: ''
  })

  const startStreaming = useCallback(async (
    url: string,
    requestBody: any,
    requestInit: RequestInit = {}
  ) => {
    setState({ isStreaming: true, error: null, content: '' })
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...requestInit.headers
        },
        body: JSON.stringify(requestBody),
        ...requestInit
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const { streamLangGraphResponse } = await import('@/lib/sse-parser')
      let finalContent = ''

      for await (const streamingMessage of streamLangGraphResponse(response)) {
        finalContent = streamingMessage.content
        
        setState(prev => ({
          ...prev,
          content: streamingMessage.content
        }))

        if (options.onMessage) {
          options.onMessage(streamingMessage.content, streamingMessage.complete)
        }

        if (streamingMessage.complete && options.onComplete) {
          options.onComplete(streamingMessage.content)
        }
      }

      setState(prev => ({ ...prev, isStreaming: false }))

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({ 
        ...prev, 
        isStreaming: false, 
        error: errorMessage 
      }))
      
      if (options.onError && error instanceof Error) {
        options.onError(error)
      }
    }
  }, [options])

  const reset = useCallback(() => {
    setState({ isStreaming: false, error: null, content: '' })
  }, [])

  return {
    ...state,
    startStreaming,
    reset
  }
}

// Simpler hook for basic streaming without full state management
export function useSimpleStreaming() {
  return useCallback(async function* streamResponse(
    url: string,
    requestBody: any,
    requestInit: RequestInit = {}
  ) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...requestInit.headers
      },
      body: JSON.stringify(requestBody),
      ...requestInit
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const { streamLangGraphResponse } = await import('@/lib/sse-parser')
    
    for await (const streamingMessage of streamLangGraphResponse(response)) {
      yield streamingMessage
    }
  }, [])
}