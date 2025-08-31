import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Hard-redirect away from legacy Vite artifacts
  if (pathname === '/index.html') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  // let /assets/* be handled by route handler

  // Rewrite missing icons to available assets
  if (pathname === '/favicon-16x16.png' || pathname === '/apple-touch-icon.png') {
    return NextResponse.rewrite(new URL('/favicon-32x32.png', request.url))
  }

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Redirect /dashboard/home to /dashboard
  if (pathname === '/dashboard/home') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect top-level shortcuts to dashboard subroutes
  const shortcuts: Record<string, string> = {
    '/contacts': '/dashboard/contacts',
    '/companies': '/dashboard/companies',
    '/deals': '/dashboard/deals',
    '/tasks': '/dashboard/tasks',
    '/reports': '/dashboard/reports',
    '/settings': '/dashboard/settings',
  }
  if (pathname in shortcuts) {
    return NextResponse.redirect(new URL(shortcuts[pathname], request.url))
  }

  // For now, we'll handle dashboard authentication in the dashboard component itself
  // rather than in middleware to avoid server-side auth complexity

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}