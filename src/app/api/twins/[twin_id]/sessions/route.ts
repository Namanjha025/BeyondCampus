import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { database } from '@/lib/database'
import { randomUUID } from 'crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ twin_id: string }> }
) {
  try {
    const { twin_id } = await params

    // Authenticate user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Invalid authentication' 
      }, { status: 401 })
    }

    // Verify twin ownership
    const twin = await database.findTwin(twin_id, user.id)
    if (!twin) {
      return NextResponse.json({
        error: 'Twin not found or access denied'
      }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { type, notebook_id, chapter_id, thread_id } = body

    if (!type || !['trainer', 'chat'].includes(type)) {
      return NextResponse.json({
        error: 'Valid session type required (trainer or chat)'
      }, { status: 400 })
    }

    // Generate IDs if not provided
    const sessionData = {
      twin_id,
      user_id: user.id,
      type: type as 'trainer' | 'chat',
      notebook_id: notebook_id || `notebook_${randomUUID().slice(0, 8)}`,
      chapter_id: chapter_id || `chapter_${randomUUID().slice(0, 8)}`,
      thread_id: thread_id || `thread_${randomUUID().slice(0, 8)}`,
      metadata: {
        created_via: 'api',
        user_agent: request.headers.get('user-agent')
      }
    }

    // Create session record
    const session = await database.createSession(sessionData)

    console.log(`Session created for twin ${twin_id}:`, {
      session_id: session.id,
      type: session.type,
      notebook_id: session.notebook_id,
      chapter_id: session.chapter_id,
      thread_id: session.thread_id
    })

    return NextResponse.json({
      session_id: session.id,
      twin_id: session.twin_id,
      type: session.type,
      notebook_id: session.notebook_id,
      chapter_id: session.chapter_id,
      thread_id: session.thread_id,
      created_at: session.created_at
    })

  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json({
      error: 'Failed to create session'
    }, { status: 500 })
  }
}

// Get sessions for a twin
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ twin_id: string }> }
) {
  try {
    const { twin_id } = await params

    // Authenticate user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Invalid authentication' 
      }, { status: 401 })
    }

    // Verify twin ownership
    const twin = await database.findTwin(twin_id, user.id)
    if (!twin) {
      return NextResponse.json({
        error: 'Twin not found or access denied'
      }, { status: 404 })
    }

    // Get sessions for this twin
    const { data: sessions, error } = await supabase
      .from('twin_sessions')
      .select()
      .eq('twin_id', twin_id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      twin_id,
      sessions: sessions || []
    })

  } catch (error) {
    console.error('Sessions fetch error:', error)
    return NextResponse.json({
      error: 'Failed to fetch sessions'
    }, { status: 500 })
  }
}

// Ensure Node.js runtime for consistent server behavior
export const runtime = 'nodejs'
