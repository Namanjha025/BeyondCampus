import { NextResponse } from 'next/server'
import { DashboardService } from '@/services/dashboardService'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const stats = await DashboardService.getSystemStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard Stats Error:', error)
    return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 })
  }
}
