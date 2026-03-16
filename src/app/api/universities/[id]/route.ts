import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    
    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        programs: true
      }
    })
    
    if (!university) {
      return NextResponse.json({ message: 'University not found' }, { status: 404 })
    }
    
    return NextResponse.json(university)
  } catch (error) {
    console.error('Error fetching university:', error)
    return NextResponse.json({ message: 'Error fetching university' }, { status: 500 })
  }
}
