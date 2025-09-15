import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Hard-redirect away from legacy Vite artifacts
  if (request.nextUrl.pathname === '/index.html') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  // let /assets/* be handled by route handler

  // Rewrite missing icons to available assets
  if (request.nextUrl.pathname === '/favicon-16x16.png' || request.nextUrl.pathname === '/apple-touch-icon.png') {
    return NextResponse.rewrite(new URL('/favicon-32x32.png', request.url))
  }

  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Redirect /dashboard/home to /dashboard
  if (request.nextUrl.pathname === '/dashboard/home') {
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
  
  // Only redirect if the pathname is in shortcuts and not the root path
  if (request.nextUrl.pathname !== '/' && request.nextUrl.pathname in shortcuts) {
    return NextResponse.redirect(new URL(shortcuts[request.nextUrl.pathname], request.url))
  }

  // For now, we'll handle dashboard authentication in the dashboard component itself
  // rather than in middleware to avoid server-side auth complexity

  return await updateSession(request)
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