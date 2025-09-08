import { NextResponse } from 'next/server'
import { supabaseServer, supabaseFallback } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export const dynamic = "force-dynamic"

export async function PUT(request: Request) {
  try {
    console.log('PUT /api/profile-v3 called')
    console.log('Using Supabase client type:', supabaseServer ? 'Server (Service Role)' : 'Fallback (Anon Key)')
    
    // Always use the server client when available (service role key)
    const supabase = supabaseServer || supabaseFallback
    
    // Debug: Log cookies
    const cookieStore = cookies()
    console.log('Available cookies:', Array.from(cookieStore.getAll()))
    
    let userId: string | null = null
    
    // Try to get user using SSR client first (for browser-based requests)
    try {
      const supabaseRoute = await createClient()
      const { data: { user }, error: sessionError } = await supabaseRoute.auth.getUser()
      
      if (sessionError) {
        console.error('Error getting session with route handler:', sessionError)
      }
      
      console.log('User from route handler:', user?.id)
      
      // If we have a session from route handler, use it
      if (user) {
        userId = user.id
        console.log('Got user ID from route handler:', userId)
      }
    } catch (routeHandlerError) {
      console.log('Route handler client not available or failed, continuing with token approach')
      console.error('Route handler error:', routeHandlerError)
    }
    
    // If no session from route handler, try to get session using token verification
    if (!userId) {
      console.log('No session from route handler, trying token verification approach')
      
      // Get the access token from the request cookies
      const accessToken = cookieStore.get('sb-access-token')?.value
      console.log('Access token from cookies:', accessToken ? 'Found' : 'Not found')
      
      if (accessToken) {
        // Use the appropriate client to verify the token
        const { data, error } = await (supabaseServer ? supabaseFallback : supabase).auth.getUser(accessToken)
        
        if (error) {
          console.error('Error verifying token:', error)
        } else if (data.user) {
          userId = data.user.id
          console.log('Got user ID from token verification:', userId)
        }
      }
    }
    
    // As a last resort, try to get user from Authorization header
    if (!userId) {
      console.log('No user ID from cookies, trying Authorization header')
      const authHeader = request.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const { data, error } = await (supabaseServer ? supabaseFallback : supabase).auth.getUser(token)
        
        if (error) {
          console.error('Error verifying token from Authorization header:', error)
        } else if (data.user) {
          userId = data.user.id
          console.log('Got user ID from Authorization header:', userId)
        }
      }
    }
    
    if (!userId) {
      console.log('No user ID found from any method')
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      )
    }

    const formData = await request.json()
    console.log('Updating profile for user:', userId, 'with data:', formData)
    
    // Update the user's profile using the appropriate client
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        location: formData.location,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile in database:', error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Profile updated successfully:', data)
    return NextResponse.json({ data })
  } catch (error: unknown) {
    console.error('Error updating profile:', error)
    // Check if it's a SyntaxError (JSON parsing error)
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: `Invalid JSON in request: ${error.message}` },
        { status: 400 }
      )
    }
    // Check if it's a general Error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    }
    // Fallback for unknown error types
    return NextResponse.json(
      { error: 'Unknown server error occurred' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('GET /api/profile-v3 called')
    console.log('Using Supabase client type:', supabaseServer ? 'Server (Service Role)' : 'Fallback (Anon Key)')
    
    // Always use the server client when available (service role key)
    const supabase = supabaseServer || supabaseFallback
    
    // Debug: Log cookies
    const cookieStore = cookies()
    console.log('Available cookies:', Array.from(cookieStore.getAll()))
    
    let userId: string | null = null
    
    // If we have the service role key, we can bypass RLS and fetch any user profile
    // But we still need to identify which user to fetch
    if (supabaseServer) {
      console.log('Using service role key - can bypass RLS')
      
      // Try to get user using SSR client first (for browser-based requests)
      try {
        const supabaseRoute = await createClient()
        const { data: { user }, error: sessionError } = await supabaseRoute.auth.getUser()
        
        if (sessionError) {
          console.error('Error getting session with route handler:', sessionError)
        }
        
        console.log('User from route handler:', user?.id)
        
        // If we have a session from route handler, use it
        if (user) {
          userId = user.id
          console.log('Got user ID from route handler session:', userId)
        }
      } catch (routeHandlerError) {
        console.log('Route handler client not available or failed, continuing with token approach')
        console.error('Route handler error:', routeHandlerError)
      }
      
      // If no session from route handler, try to get session using token verification
      if (!userId) {
        console.log('No session from route handler, trying token verification approach')
        
        // Get the access token from the request cookies
        const accessToken = cookieStore.get('sb-access-token')?.value
        console.log('Access token from cookies:', accessToken ? 'Found' : 'Not found')
        
        if (accessToken) {
          // Use the fallback client to verify the token (since server client bypasses auth)
          const { data, error } = await supabaseFallback.auth.getUser(accessToken)
          
          if (error) {
            console.error('Error verifying token with fallback client:', error)
          } else if (data.user) {
            userId = data.user.id
            console.log('Got user ID from token verification:', userId)
          }
        }
      }
    } else {
      // No service role key available, use the standard auth flow
      console.log('No service role key available, using standard auth flow')
      
      // Try to get user using SSR client first (for browser-based requests)
      try {
        const supabaseRoute = await createClient()
        const { data: { user }, error: sessionError } = await supabaseRoute.auth.getUser()
        
        if (sessionError) {
          console.error('Error getting session with route handler:', sessionError)
        }
        
        console.log('User from route handler:', user?.id)
        
        // If we have a session from route handler, use it
        if (user) {
          userId = user.id
          console.log('Got user ID from route handler session:', userId)
        }
      } catch (routeHandlerError) {
        console.log('Route handler client not available or failed, continuing with token approach')
        console.error('Route handler error:', routeHandlerError)
      }
      
      // If no session from route handler, try to get session using token verification
      if (!userId) {
        console.log('No session from route handler, trying token verification approach')
        
        // Get the access token from the request cookies
        const accessToken = cookieStore.get('sb-access-token')?.value
        console.log('Access token from cookies:', accessToken ? 'Found' : 'Not found')
        
        if (accessToken) {
          // Use the fallback client to verify the token
          const { data, error } = await supabase.auth.getUser(accessToken)
          
          if (error) {
            console.error('Error verifying token:', error)
          } else if (data.user) {
            userId = data.user.id
            console.log('Got user ID from token verification:', userId)
          }
        }
      }
    }
    
    if (!userId) {
      console.log('No user ID found from any method')
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      )
    }

    console.log('Fetching profile for user:', userId)
    
    // Get the user's profile using the appropriate client
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile from database:', error)
      // Check if it's a "no rows" error (profile doesn't exist)
      if (error.code === 'PGRST116') {
        // Profile doesn't exist, return empty profile object
        return NextResponse.json({ data: null })
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Profile fetched successfully:', data)
    return NextResponse.json({ data })
  } catch (error: unknown) {
    console.error('Error fetching profile:', error)
    // Check if it's a general Error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    }
    // Fallback for unknown error types
    return NextResponse.json(
      { error: 'Unknown server error occurred' },
      { status: 500 }
    )
  }
}