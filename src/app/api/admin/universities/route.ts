import { NextRequest, NextResponse } from 'next/server'
import { UniversityService } from '@/services/universityService'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const university = await UniversityService.upsertUniversity(data)
    
    return NextResponse.json(university, { status: 201 })
  } catch (error) {
    console.error('Error creating university:', error)
    return NextResponse.json({ message: 'Error creating university' }, { status: 500 })
  }
}
