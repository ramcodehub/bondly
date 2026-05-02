import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  console.log('Middleware: updateSession called for', request.nextUrl.pathname)
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are not set, return the response without auth
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not set. Skipping auth middleware.')
    return response
  }

  console.log('Middleware: Creating Supabase client')
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          } catch (error) {
            // Handle cookie setting errors gracefully
            console.warn('Failed to set cookie in middleware:', error)
          }
        },
        remove(name: string, options: any) {
          try {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          } catch (error) {
            // Handle cookie removal errors gracefully
            console.warn('Failed to remove cookie in middleware:', error)
          }
        },
      },
    }
  )

  // Refresh session if needed
  console.log('Middleware: Refreshing session')
  try {
    const { data, error } = await supabase.auth.getUser();
    console.log('Middleware: getUser result:', { user: !!data.user, error: !!error })
    if (error) {
      // This is expected when there's no active session (e.g., for unauthenticated users)
      // It's not an error condition, just indicates no current session
      console.log('Middleware: No active session (this is normal for unauthenticated users)')
    } else if (data.user) {
      console.log('Middleware: User is authenticated')
    }
  } catch (authError) {
    console.error('Middleware: Unexpected authentication error:', authError)
    // Continue with the response even if auth fails
  }

  console.log('Middleware: Returning response')
  return response
}