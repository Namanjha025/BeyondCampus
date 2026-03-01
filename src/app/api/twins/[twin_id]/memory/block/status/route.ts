import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { database } from '@/lib/database'
import { isValidUUID, normalizeId } from '@/lib/validation'
import { langGraphClient } from '@/lib/langgraph-client'
import { randomUUID } from 'crypto'
import { cuidToUuid } from '@/lib/uuid-utils'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ twin_id: string }> }
) {
  const correlationId = randomUUID()
  try {
    const { twin_id } = await params

    if (!isValidUUID(twin_id)) {
      return NextResponse.json({ success: false, error: 'Invalid twin_id', correlation_id: correlationId }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Authentication required', correlation_id: correlationId }, { status: 401 })
    }
    const userUuid = cuidToUuid(session.user.id)

    const twin = await database.findTwin(twin_id, userUuid)
    if (!twin) {
      return NextResponse.json({ success: false, error: 'Twin not found or access denied', correlation_id: correlationId }, { status: 404 })
    }

    const body = await request.json()
    const memory_block_id = body.memory_block_id || body.notebook_id || 'block_default'
    const status = String(body.status || '').toLowerCase()

    if (!['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status', correlation_id: correlationId }, { status: 400 })
    }

    // Create a thread and assistant; send a minimal stream with config to set status
    const preferredThreadId = normalizeId(body.thread_id, 'publish')
    const thread = await langGraphClient.getOrCreateThread(preferredThreadId, { created_by: 'BFF', action: 'publish_block' }, correlationId)
    const assistant = await langGraphClient.createAssistant('twin_trainer', { created_by: 'BFF', twin_training: true }, correlationId)

    const streamResponse = await langGraphClient.streamTrainerChat({
      assistantId: assistant.assistant_id,
      threadId: thread.thread_id,
      messages: [ { type: 'human', content: `Set block ${memory_block_id} status to ${status}` } ],
      config: {
        configurable: {
          twin_id,
          notebook_id: memory_block_id,
          set_block_status: status,
          thread_id: thread.thread_id
        }
      }
    }, correlationId)

    if (!streamResponse.ok || !streamResponse.body) {
      const details = await streamResponse.text().catch(() => '')
      return NextResponse.json({ success: false, error: `Streaming failed: ${streamResponse.status}`, details, correlation_id: correlationId }, { status: 502 })
    }

    // Drain the stream (we don't need content)
    const { streamLangGraphResponse } = await import('@/lib/sse-parser')
    for await (const _ of streamLangGraphResponse(streamResponse)) {
      // no-op
    }

    return NextResponse.json({ success: true, correlation_id: correlationId })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 })
  }
}

