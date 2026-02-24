import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    console.log('Looking for twin with slug:', slug)
    
    let twin = await database.findTwinBySlug(slug)
    
    // Fallback: case-insensitive match if needed
    if (!twin) {
      const all = await database.getAllTwins()
      const match = all.find(t => (t.public_url || '').toLowerCase() === slug.toLowerCase())
      if (match) twin = match as typeof twin
    }
    
    if (!twin) {
      return NextResponse.json({ success: false, error: 'Twin not found' }, { status: 404 })
    }
    
    const camel = {
      id: twin.id,
      userId: twin.user_id,
      userName: twin.user_name,
      twinName: twin.twin_name,
      tagline: twin.tagline,
      personality: twin.personality,
      tone: twin.tone,
      links: twin.links,
      status: twin.status,
      publicUrl: twin.public_url,
      createdAt: twin.created_at,
      publishedAt: twin.published_at,
    }
    return NextResponse.json({ success: true, twin: camel })
  } catch (error) {
    console.error('Error finding twin by slug:', error)
    return NextResponse.json({ success: false, error: 'Failed to find twin' }, { status: 500 })
  }
}

