import { NextResponse } from 'next/server'
import { UniversityService } from '@/services/universityService'

export async function GET() {
  try {
    const universities = await UniversityService.getAllUniversities()
    return NextResponse.json(universities)
  } catch (error) {
    console.error('Error fetching universities:', error)
    return NextResponse.json({ message: 'Error fetching universities' }, { status: 500 })
  }
}
