import { NextResponse } from 'next/server'
import { supabaseServer, supabaseFallback } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function PUT(request: Request) {
  try {
    console.log('PUT /api/profile called')
    console.log('Using Supabase client type:', supabaseServer ? 'Server (Service Role)' : 'Fallback (Anon Key)')
    
    // With the service role key now available, we can use the server client for authentication as well
    const supabase = supabaseServer || supabaseFallback
    
    // Debug: Log cookies
    const cookieStore = cookies()
    console.log('Available cookies:', Array.from(cookieStore.getAll()))
    
    // Try to get session using createRouteHandlerClient first (for browser-based requests)
    let userId: string | null = null
    
    try {
      const supabaseRoute = createRouteHandlerClient({ cookies })
      const { data: { session }, error: sessionError } = await supabaseRoute.auth.getSession()
      
      if (sessionError) {
        console.error('Error getting session with route handler:', sessionError)
      }
      
      console.log('Session from route handler:', session?.user?.id)
      
      // If we have a session from route handler, use it
      if (session?.user) {
        userId = session.user.id
        console.log('Got user ID from route handler session:', userId)
      }
    } catch (routeHandlerError) {
      console.log('Route handler client not available or failed, continuing with server client approach')
      console.error('Route handler error:', routeHandlerError)
    }
    
    // If no session from route handler, try to get session using server client
    if (!userId) {
      console.log('No session from route handler, trying server client approach')
      
      // Get the access token from the request cookies
      const accessToken = cookieStore.get('sb-access-token')?.value
      console.log('Access token from cookies:', accessToken ? 'Found' : 'Not found')
      
      if (accessToken) {
        // Use the server client to verify the token
        const { data, error } = await supabase.auth.getUser(accessToken)
        
        if (error) {
          console.error('Error verifying token with server client:', error)
        } else if (data.user) {
          userId = data.user.id
          console.log('Got user ID from server client token verification:', userId)
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
    
    // Update the user's profile using the server client
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
    // Type guard to ensure error is an Error instance
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    } else {
      return NextResponse.json(
        { error: 'Unknown server error occurred' },
        { status: 500 }
      )
    }
  }
}

export async function GET() {
  try {
    console.log('GET /api/profile called')
    console.log('Using Supabase client type:', supabaseServer ? 'Server (Service Role)' : 'Fallback (Anon Key)')
    
    // With the service role key now available, we can use the server client for authentication as well
    const supabase = supabaseServer || supabaseFallback
    
    // Debug: Log cookies
    const cookieStore = cookies()
    console.log('Available cookies:', Array.from(cookieStore.getAll()))
    
    // Try to get session using createRouteHandlerClient first (for browser-based requests)
    let userId: string | null = null
    
    try {
      const supabaseRoute = createRouteHandlerClient({ cookies })
      const { data: { session }, error: sessionError } = await supabaseRoute.auth.getSession()
      
      if (sessionError) {
        console.error('Error getting session with route handler:', sessionError)
      }
      
      console.log('Session from route handler:', session?.user?.id)
      
      // If we have a session from route handler, use it
      if (session?.user) {
        userId = session.user.id
        console.log('Got user ID from route handler session:', userId)
      }
    } catch (routeHandlerError) {
      console.log('Route handler client not available or failed, continuing with server client approach')
      console.error('Route handler error:', routeHandlerError)
    }
    
    // If no session from route handler, try to get session using server client
    if (!userId) {
      console.log('No session from route handler, trying server client approach')
      
      // Get the access token from the request cookies
      const accessToken = cookieStore.get('sb-access-token')?.value
      console.log('Access token from cookies:', accessToken ? 'Found' : 'Not found')
      
      if (accessToken) {
        // Use the server client to verify the token
        const { data, error } = await supabase.auth.getUser(accessToken)
        
        if (error) {
          console.error('Error verifying token with server client:', error)
        } else if (data.user) {
          userId = data.user.id
          console.log('Got user ID from server client token verification:', userId)
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
    
    // Get the user's profile using the server client
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
    // Type guard to ensure error is an Error instance
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    } else {
      return NextResponse.json(
        { error: 'Unknown server error occurred' },
        { status: 500 }
      )
    }
  }
}