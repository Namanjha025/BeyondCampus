import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      orderBy: {
        ranking: 'asc'
      }
    })
    
    return NextResponse.json(universities)
  } catch (error) {
    console.error('Error fetching universities:', error)
    return NextResponse.json({ message: 'Error fetching universities' }, { status: 500 })
  }
}
