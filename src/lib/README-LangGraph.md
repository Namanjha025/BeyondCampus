# LangGraph API Integration

This document describes the new LangGraph API integration for BeyondCampus.

## Architecture Overview

The LangGraph integration consists of several layers:

```
Frontend Components
       ↓
   React Hooks (useLangGraphStreaming)
       ↓
   SSE Parser (sse-parser.ts)
       ↓
   BFF API Routes (/api/twins/*/messages)  
       ↓
   LangGraph Client (langgraph-client.ts)
       ↓
   LangGraph Services (localhost:8123/8124)
```

## Key Files

### Core Client
- **`lib/langgraph-client.ts`** - Main LangGraph API client
- **`lib/sse-parser.ts`** - Server-Sent Events parser for streaming
- **`lib/langgraph-health.ts`** - Health monitoring utilities

### React Integration  
- **`lib/hooks/useLangGraphStreaming.ts`** - React hooks for streaming
- **`components/LangGraphStatus.tsx`** - Status indicator components

### API Routes (BFF)
- **`app/api/twins/[twin_id]/trainer/messages/route.ts`** - Training API
- **`app/api/twins/[twin_id]/chat/messages/route.ts`** - Chat API

## Usage Examples

### 1. Basic Streaming in API Route (BFF)

```typescript
import { langGraphClient } from '@/lib/langgraph-client'

// Create thread and assistant
const thread = await langGraphClient.createThread(metadata, correlationId)
const assistant = await langGraphClient.createAssistant('twin_trainer', metadata, correlationId)

// Start streaming
const streamResponse = await langGraphClient.streamTrainerChat({
  assistantId: assistant.assistant_id,
  threadId: thread.thread_id,
  messages: [{ type: 'human', content: userMessage }],
  config: { configurable: { twin_id, user_id } }
}, correlationId)

// Return streaming response
return new Response(streamResponse.body, {
  headers: { 'Content-Type': 'text/event-stream' }
})
```

### 2. Frontend Streaming with SSE Parser

```typescript
import { streamLangGraphResponse } from '@/lib/sse-parser'

const response = await fetch('/api/twins/123/trainer/messages', {
  method: 'POST',
  body: JSON.stringify({ text: userMessage })
})

for await (const streamingMessage of streamLangGraphResponse(response)) {
  // Update UI with streaming content
  updateMessage(streamingMessage.content)
  
  if (streamingMessage.complete) {
    console.log('Streaming complete!')
  }
}
```

### 3. React Hook Usage

```typescript
import { useLangGraphStreaming } from '@/lib/hooks/useLangGraphStreaming'

function TrainingComponent() {
  const { isStreaming, content, error, startStreaming } = useLangGraphStreaming({
    onMessage: (content, isComplete) => {
      console.log('New content:', content)
    },
    onComplete: (finalContent) => {
      console.log('Final:', finalContent)
    }
  })

  const handleSend = async (message: string) => {
    await startStreaming('/api/twins/123/trainer/messages', { text: message })
  }

  return (
    <div>
      {isStreaming && <div>Streaming...</div>}
      {error && <div>Error: {error}</div>}
      <div>{content}</div>
    </div>
  )
}
```

## LangGraph Event Types

The streaming API returns different event types:

- **`messages/partial`** - Incremental AI response content (real-time streaming)
- **`values`** - Complete graph state after each step
- **`metadata`** - Run metadata and correlation info

## Health Monitoring

```typescript
import { useLangGraphHealth } from '@/lib/langgraph-health'

function App() {
  const { health, isHealthy, status } = useLangGraphHealth()
  
  return (
    <div>
      Status: {status} {/* 'healthy' | 'degraded' | 'unhealthy' */}
      {!isHealthy && <div>Some AI services are unavailable</div>}
    </div>
  )
}
```

## Configuration

Set environment variables:

```env
TRAINER_SERVICE_URL=http://localhost:8123
CHAT_SERVICE_URL=http://localhost:8124  
AI_SHARED_TOKEN=your-shared-secret-token
```

## Migration from Old Client

Replace:
```typescript
// OLD - Don't use
import { assistantClient } from '@/lib/assistant-client'
await assistantClient.callTrainerStream(...)
```

With:
```typescript  
// NEW - Use this
import { langGraphClient } from '@/lib/langgraph-client'
await langGraphClient.streamTrainerChat(...)
```

## Error Handling

The new client provides better error handling with correlation IDs:

```typescript
try {
  const response = await langGraphClient.streamTrainerChat(...)
} catch (error) {
  if (error.correlationId) {
    console.log('Track this error:', error.correlationId)
  }
  console.log('Status:', error.status) // HTTP status code
}
```

## Features

✅ **Proper SSE Parsing** - Handles CRLF and multi-line events correctly  
✅ **Error Handling** - Comprehensive error handling with correlation IDs  
✅ **Health Monitoring** - Service health checks and status indicators  
✅ **React Integration** - Hooks and components for easy frontend use  
✅ **Type Safety** - Full TypeScript support with proper interfaces  
✅ **Streaming** - Real-time token-by-token AI responses  
✅ **Backward Compatible** - Can coexist with old client during migration  

## Next Steps

1. Test the new integration thoroughly
2. Migrate remaining components from old assistant client
3. Add more comprehensive health monitoring
4. Implement connection pooling if needed
5. Add metrics and logging integration