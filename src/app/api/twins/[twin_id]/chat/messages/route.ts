import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { langGraphClient } from '@/lib/langgraph-client'
import { validateChatRequest, normalizeId, isValidUUID } from '@/lib/validation'
import { checkChatRateLimit, getClientIP } from '@/lib/rate-limiter'
import { randomUUID } from 'crypto'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { cuidToUuid } from '@/lib/uuid-utils'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ twin_id: string }> }
) {
  const correlationId = randomUUID()
  const startTime = Date.now()

  try {
    const { twin_id } = await params

    // Validate twin_id is UUID
    if (!isValidUUID(twin_id)) {
      return NextResponse.json({
        code: 'INVALID_TWIN_ID',
        error: 'Twin ID must be a valid UUID',
        correlation_id: correlationId
      }, { status: 400 })
    }

    // Check rate limits
    const clientIP = getClientIP(request)
    const rateLimit = await checkChatRateLimit(clientIP, twin_id)
    
    if (!rateLimit.allowed) {
      const headers: Record<string, string> = {}
      if (rateLimit.retryAfter) {
        headers['Retry-After'] = rateLimit.retryAfter.toString()
      }

      return NextResponse.json({
        code: 'RATE_LIMITED',
        error: rateLimit.reason || 'Rate limit exceeded',
        correlation_id: correlationId,
        retry_after: rateLimit.retryAfter
      }, { 
        status: 429,
        headers 
      })
    }

    // For chat, authentication is optional (public twins can be chatted with)
    let userId: string | null = null
    const session = await getServerSession(authOptions)
    
    if (session?.user?.id) {
      // Convert NextAuth CUID to UUID format (same as twin creation)
      userId = cuidToUuid(session.user.id)
    }

    // Verify twin exists and guard with status=PUBLISHED for non-owners
    const twin = await database.findTwin(twin_id)
    if (!twin) {
      return NextResponse.json({
        code: 'TWIN_NOT_FOUND',
        error: 'Twin not found',
        correlation_id: correlationId
      }, { status: 404 })
    }

    // For non-owners, twin must be PUBLISHED
    if (userId !== twin.user_id && twin.status !== 'PUBLISHED') {
      return NextResponse.json({
        code: 'TWIN_NOT_PUBLIC',
        error: 'Twin not available for chat',
        correlation_id: correlationId
      }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = validateChatRequest(body)
    
    if (!validation.isValid) {
      return NextResponse.json({
        code: 'VALIDATION_ERROR',
        error: 'Invalid request data',
        details: validation.errors,
        correlation_id: correlationId
      }, { status: 400 })
    }

    // Normalize IDs to UUIDv4 (generate if missing)
    const normalizedRequest = {
      text: body.text.trim(),
      notebook_id: body.notebook_id ? normalizeId(body.notebook_id, 'notebook') : undefined,
      chapter_id: body.chapter_id ? normalizeId(body.chapter_id, 'chapter') : undefined,
      viewer_thread_id: normalizeId(body.viewer_thread_id, 'chat')
    }

    console.log(`[${correlationId}] Chat request for twin ${twin_id}:`, {
      user_id: userId || 'anonymous',
      notebook_id: normalizedRequest.notebook_id,
      chapter_id: normalizedRequest.chapter_id,
      viewer_thread_id: normalizedRequest.viewer_thread_id,
      text_length: normalizedRequest.text.length
    })

    // Create thread and assistant for chat
    const threadMetadata = {
      twin_id: twin_id,
      viewer_thread_id: normalizedRequest.viewer_thread_id,
      created_by: 'BFF_Chat'
    }
    
    const thread = await langGraphClient.createThread(threadMetadata, correlationId)
    const assistant = await langGraphClient.createAssistant(
      'ai_twin',
      { created_by: 'BFF', twin_chat: true },
      correlationId
    )
    
    // For chat, we'll use non-streaming initially to maintain compatibility
    // TODO: Convert to streaming for better UX
    const streamResponse = await langGraphClient.streamChatResponse({
      assistantId: assistant.assistant_id,
      threadId: thread.thread_id,
      messages: [
        {
          type: 'human',
          content: normalizedRequest.text
        }
      ],
      config: {
        configurable: {
          twin_id: twin_id,
          thread_id: thread.thread_id
        }
      }
    }, correlationId)
    
    // For now, read the full response (can be converted to streaming later)
    const reader = streamResponse.body?.getReader()
    if (!reader) {
      throw new Error('No response body reader available')
    }
    
    const { streamLangGraphResponse } = await import('@/lib/sse-parser')
    let finalMessage = ''
    const citations: unknown[] = []
    
    for await (const streamingMessage of streamLangGraphResponse(streamResponse)) {
      if (streamingMessage.content) {
        finalMessage = streamingMessage.content
      }
    }
    
    const response = {
      ai_text: finalMessage,
      citations: citations
    }

    // Create session record
    await database.createSession({
      twin_id,
      user_id: userId, // Can be null for anonymous users
      type: 'chat',
      notebook_id: normalizedRequest.notebook_id,
      chapter_id: normalizedRequest.chapter_id,
      thread_id: normalizedRequest.viewer_thread_id,
      metadata: {
        correlation_id: correlationId,
        request_length: normalizedRequest.text.length,
        response_length: response.ai_text.length,
        citations_count: response.citations?.length || 0
      }
    })

    const totalLatency = Date.now() - startTime
    console.log(`[${correlationId}] Chat complete: ${totalLatency}ms`)

    return NextResponse.json({
      ai_text: response.ai_text,
      citations: response.citations || [],
      notebook_id: normalizedRequest.notebook_id,
      chapter_id: normalizedRequest.chapter_id,
      thread_id: normalizedRequest.viewer_thread_id,
      correlation_id: correlationId,
      latency_ms: totalLatency
    })

  } catch (error) {
    const totalLatency = Date.now() - startTime
    console.error(`[${correlationId}] Chat route error (${totalLatency}ms):`, error)
    
    return NextResponse.json({
      code: 'INTERNAL_ERROR',
      error: 'Chat service failed',
      correlation_id: correlationId
    }, { status: 500 })
  }
}

// Ensure Node.js runtime for local networking and streaming handling
export const runtime = 'nodejs'
