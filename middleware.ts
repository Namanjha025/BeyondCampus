import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const pathname = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/signup', '/api/auth', '/api/user/onboarding']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Onboarding paths
  const isOnboardingPath = pathname.startsWith('/onboarding')

  // If not authenticated, redirect to signin
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Temporarily disable onboarding checks in middleware
  // Let components handle the routing based on fresh data
  
  // If authenticated and onboarded
  // if (token && token.onboardingCompleted) {
  //   // Prevent going back to onboarding
  //   if (isOnboardingPath) {
  //     return NextResponse.redirect(new URL('/dashboard', request.url))
  //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}