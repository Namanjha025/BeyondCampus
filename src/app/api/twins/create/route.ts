import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { cuidToUuid } from '@/lib/uuid-utils'

export async function POST(request: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 })
    }

    const { twinName, tagline, personality, tone, links, customId } = await request.json()
    
    console.log('Creating twin with data:', { twinName, tagline, personality, tone, links, userId: session.user.id })
    
    // Create twin using database
    // Convert NextAuth CUID to UUID format for database compatibility
    const userUuid = cuidToUuid(session.user.id);
    
    const twin = await database.createTwin({
      user_id: userUuid, // Convert CUID to UUID format
      user_name: session.user.name || session.user.email || 'User',
      twin_name: twinName,
      tagline,
      personality,
      tone,
      links: links || [],
      status: 'TRAINING' // Start in training mode
    }, customId)
    
    console.log('Twin created successfully:', twin)
    
    return NextResponse.json({ 
      success: true, 
      twin,
      trainingUrl: `/users/${session.user.id}/train?twinId=${twin.id}`
    })
    
  } catch (error) {
    console.error('Error creating twin:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create twin' 
    }, { status: 500 })
  }
}

// GET endpoint to retrieve twins for debugging
export async function GET() {
  try {
    const twins = await database.getAllTwins()
    return NextResponse.json({ twins })
  } catch (error) {
    return NextResponse.json({ twins: [], error: 'Failed to fetch twins' })
  }
}