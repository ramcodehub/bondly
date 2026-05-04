import { NextResponse, type NextRequest } from 'next/server'

/**
 * Lightweight middleware for Edge compatibility.
 * DOES NOT use Supabase client to avoid Node.js API dependency.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Get the session cookie (Supabase standard name)
  // We check for any cookie starting with 'sb-' to be safe across projects
  const cookies = request.cookies.getAll()
  const hasAuthCookie = cookies.some(cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'))
  
  // 2. Define protected and auth routes
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/settings')

  // 3. Simple redirect logic
  if (isProtectedPage && !hasAuthCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthPage && hasAuthCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}