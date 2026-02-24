import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get auth header and verify user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid authentication' 
      }, { status: 401 })
    }

    // Fetch user profile
    const profile = await database.getUser(user.id)
    
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'User profile not found' 
      }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch profile'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get auth header and verify user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid authentication' 
      }, { status: 401 })
    }

    const updates = await request.json()

    // Update user profile
    const updatedProfile = await database.updateUser(user.id, updates)

    return NextResponse.json({ 
      success: true,
      user: updatedProfile
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update profile'
    }, { status: 500 })
  }
}