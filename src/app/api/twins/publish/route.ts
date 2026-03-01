import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { cuidToUuid } from '@/lib/uuid-utils'

export async function POST(request: NextRequest) {
  try {
    // Authenticate via NextAuth session (consistent with twin creation)
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const { twinId } = await request.json()
    
    // Convert NextAuth CUID to UUID format to match twins.user_id
    const userUuid = cuidToUuid(session.user.id)
    console.log('Publishing twin:', { twinId, userId: userUuid })
    
    // Find the twin
    const twin = await database.findTwin(twinId, userUuid)
    
    if (!twin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Twin not found' 
      }, { status: 404 })
    }
    
    // Generate clean URL slug
    const publicUrl = twin.twin_name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    
    // Update twin status to published
    const updatedTwin = await database.updateTwin(twinId, {
      status: 'PUBLISHED',
      public_url: publicUrl,
      published_at: new Date().toISOString()
    })
    
    if (!updatedTwin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update twin' 
      }, { status: 500 })
    }
    
    console.log('Twin published successfully:', updatedTwin)
    
    return NextResponse.json({ 
      success: true, 
      twin: updatedTwin,
      publicUrl: `/${publicUrl}`
    })
    
  } catch (error) {
    console.error('Error publishing twin:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to publish twin' 
    }, { status: 500 })
  }
}

// Run on Node.js runtime
export const runtime = 'nodejs'
