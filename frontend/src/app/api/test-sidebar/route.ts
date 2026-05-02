import { NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'
import { supabaseServer, supabaseFallback } from '../../../lib/supabase-server'
import { User } from '@supabase/supabase-js'

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    console.log('Testing sidebar authentication...')
    
    // Use the server client with service role key when available, otherwise use SSR client
    let user: User | null = null;
    let userError: any = null;
    
    if (supabaseServer) {
      console.log('Using supabaseServer with service role key')
      // With service role key, we can verify the token from the Authorization header
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data, error } = await supabaseServer.auth.getUser(token);
        user = data?.user || null;
        userError = error;
        console.log('Service role key result:', { user: !!user, error: !!userError })
      } else {
        console.log('No Authorization header found for service role key')
      }
    }
    
    // If we couldn't get user from service role key, try SSR client
    if (!user) {
      console.log('Using SSR client')
      // Create the Supabase client using the SSR package
      const supabase = await createClient()
      
      // Get the user session
      const { data, error } = await supabase.auth.getUser()
      user = data?.user || null;
      userError = error;
      console.log('SSR client result:', { user: !!user, error: !!userError })
    }
    
    if (userError) {
      console.error('Authentication error:', userError)
      return NextResponse.json(
        { success: false, message: 'Authentication failed', error: userError.message },
        { status: 401 }
      )
    }
    
    if (!user) {
      console.log('No user found')
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No active session' },
        { status: 401 }
      )
    }
    
    console.log('User authenticated successfully:', user.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Authentication successful',
      userId: user.id,
      userEmail: user.email
    })
  } catch (error: unknown) {
    console.error('Error in test-sidebar API:', error)
    return NextResponse.json(
      { success: false, message: 'Server error occurred' },
      { status: 500 }
    )
  }
}