import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ 
        message: 'Unauthorized' 
      }, { status: 401 })
    }

    const {
      userName,
      currentEducation,
      targetCountries,
      studyTimeline,
      preferredCourse,
      budget
    } = await request.json()

    // Ensure targetCountries is always an array
    const countriesArray = Array.isArray(targetCountries) 
      ? targetCountries 
      : targetCountries 
        ? [targetCountries] 
        : []

    // Update user with onboarding data
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nickname: userName,
        currentEducation,
        targetCountries: countriesArray,
        studyTimeline,
        preferredCourse,
        budget: budget || null,
        onboardingCompleted: true
      }
    })

    return NextResponse.json({ 
      message: 'Onboarding data saved successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        onboardingCompleted: updatedUser.onboardingCompleted
      }
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ 
      message: 'Failed to save onboarding data',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 })
  }
}