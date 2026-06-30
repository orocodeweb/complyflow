import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const PROTECTED_PATHS = [
  '/dashboard', '/compliance', '/calendar', '/documents',
  '/ai-assistant', '/settings', '/notifications', '/onboarding', '/admin',
]

const ADMIN_PATHS = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get('complyflow_token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const payload = verifyToken(token)
  if (!payload) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p))
  if (isAdminPath && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/compliance/:path*',
    '/calendar/:path*',
    '/documents/:path*',
    '/ai-assistant/:path*',
    '/settings/:path*',
    '/notifications/:path*',
    '/onboarding/:path*',
    '/admin/:path*',
  ],
}
