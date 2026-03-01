import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { langGraphClient } from '@/lib/langgraph-client'
import { validateTrainerRequest, normalizeId, isValidUUID } from '@/lib/validation'
import { checkTrainerRateLimit, getClientIP } from '@/lib/rate-limiter'
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
    const rateLimit = await checkTrainerRateLimit(clientIP, twin_id)
    
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

    // Authenticate user with NextAuth
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ 
        code: 'MISSING_AUTH',
        error: 'Authentication required',
        correlation_id: correlationId
      }, { status: 401 })
    }

    // Convert NextAuth CUID to UUID format (same as twin creation)
    const userUuid = cuidToUuid(session.user.id)
    const user = { id: userUuid }

    console.log(`[${correlationId}] Auth check - NextAuth CUID:`, session.user.id, 'converted to UUID:', userUuid)

    // Verify twin ownership (strict owner check for trainer)
    const twin = await database.findTwin(twin_id, user.id)
    if (!twin) {
      return NextResponse.json({
        code: 'TWIN_NOT_FOUND',
        error: 'Twin not found or access denied',
        correlation_id: correlationId
      }, { status: 404 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = validateTrainerRequest(body)
    
    if (!validation.isValid) {
      return NextResponse.json({
        code: 'VALIDATION_ERROR',
        error: 'Invalid request data',
        details: validation.errors,
        correlation_id: correlationId
      }, { status: 400 })
    }

    // Normalize IDs to UUIDv4
    const normalizedRequest = {
      notebook_id: normalizeId(body.notebook_id, 'notebook'),
      chapter_id: normalizeId(body.chapter_id, 'chapter'),
      thread_id: normalizeId(body.thread_id, 'thread'),
      text: body.text.trim()
    }

    console.log(`[${correlationId}] Trainer request for twin ${twin_id}:`, {
      user_id: user.id,
      notebook_id: normalizedRequest.notebook_id,
      chapter_id: normalizedRequest.chapter_id, 
      thread_id: normalizedRequest.thread_id,
      text_length: normalizedRequest.text.length
    })

    // Get or create thread using the preferred thread ID from frontend
    const threadMetadata = {
      twin_id: twin_id,
      user_id: user.id,
      notebook_id: normalizedRequest.notebook_id,
      chapter_id: normalizedRequest.chapter_id,
      created_by: 'BFF'
    }
    
    console.log(`[${correlationId}] Using preferred thread ID: ${normalizedRequest.thread_id}`)
    const thread = await langGraphClient.getOrCreateThread(
      normalizedRequest.thread_id, 
      threadMetadata, 
      correlationId
    )
    const assistant = await langGraphClient.createAssistant(
      'twin_trainer', 
      { created_by: 'BFF', twin_training: true },
      correlationId
    )
    
    // Stream trainer conversation
    const streamResponse = await langGraphClient.streamTrainerChat({
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
          user_id: user.id,
          user_name: session.user?.name || session.user?.email || 'Trainer User',
          notebook_id: normalizedRequest.notebook_id,
          chapter_id: normalizedRequest.chapter_id,
          thread_id: thread.thread_id
        }
      }
    }, correlationId)

    // Create session record (we'll update it when streaming completes)
    await database.createSession({
      twin_id,
      user_id: user.id,
      type: 'trainer',
      notebook_id: normalizedRequest.notebook_id,
      chapter_id: normalizedRequest.chapter_id,
      thread_id: normalizedRequest.thread_id,
      metadata: {
        correlation_id: correlationId,
        request_length: normalizedRequest.text.length,
        streaming: true
      }
    })

    console.log(`[${correlationId}] Starting trainer stream with thread ${thread.thread_id} and assistant ${assistant.assistant_id}`)

    // Check if response is valid
    if (!streamResponse.ok) {
      console.error(`[${correlationId}] LangGraph streaming failed: ${streamResponse.status} ${streamResponse.statusText}`)
      const errorText = await streamResponse.text()
      console.error(`[${correlationId}] Error details:`, errorText)
      
      return NextResponse.json({
        code: 'STREAMING_ERROR',
        error: `LangGraph streaming failed: ${streamResponse.status}`,
        correlation_id: correlationId
      }, { status: streamResponse.status })
    }

    if (!streamResponse.body) {
      console.error(`[${correlationId}] No response body from LangGraph`)
      return NextResponse.json({
        code: 'NO_RESPONSE_BODY',
        error: 'No response body from LangGraph streaming',
        correlation_id: correlationId
      }, { status: 500 })
    }

    // If the client requests streaming, proxy the SSE directly.
    const accept = request.headers.get('accept') || ''
    const wantsStream = accept.includes('text/event-stream')

    if (wantsStream) {
      console.log(`[${correlationId}] Client requested SSE. Returning streaming response.`)
      return new Response(streamResponse.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Correlation-ID': correlationId,
          'X-Thread-ID': thread.thread_id,
          'X-Assistant-ID': assistant.assistant_id
        },
      })
    }

    console.log(`[${correlationId}] Client did not request SSE. Aggregating to JSON response.`)

    // Aggregate streaming content into a single JSON response (simplifies client handling)
    const { streamLangGraphResponse } = await import('@/lib/sse-parser')
    let finalText = ''
    for await (const streamingMessage of streamLangGraphResponse(streamResponse)) {
      if (streamingMessage.content) {
        finalText = streamingMessage.content
      }
    }

    const totalLatency = Date.now() - startTime
    return NextResponse.json({
      ai_text: finalText,
      correlation_id: correlationId,
      latency_ms: totalLatency
    })

  } catch (error) {
    const totalLatency = Date.now() - startTime
    console.error(`[${correlationId}] Trainer route error (${totalLatency}ms):`, error)
    
    return NextResponse.json({
      code: 'INTERNAL_ERROR',
      error: 'Training service failed',
      correlation_id: correlationId
    }, { status: 500 })
  }
}

// Explicitly run this route on Node.js runtime
export const runtime = 'nodejs'
