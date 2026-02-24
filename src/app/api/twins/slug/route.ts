import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    console.log('Looking for twin with slug:', slug)
    
    // Find twin by public URL slug
    const twin = await database.findTwinBySlug(slug)
    
    if (!twin) {
      console.log('Twin not found for slug:', slug)
      return NextResponse.json({
        success: false,
        error: 'Twin not found'
      }, { status: 404 })
    }
    
    console.log('Found twin:', twin)
    return NextResponse.json({
      success: true,
      twin
    })
  } catch (error) {
    console.error('Error finding twin by slug:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to find twin'
    }, { status: 500 })
  }
}