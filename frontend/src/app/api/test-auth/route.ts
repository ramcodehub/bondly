import { NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'
import { supabaseServer, supabaseFallback } from '../../../lib/supabase-server'
import { User } from '@supabase/supabase-js'

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Use the server client with service role key when available, otherwise use SSR client
    let user: User | null = null;
    let userError: any = null;
    
    if (supabaseServer) {
      // With service role key, we can verify the token from the Authorization header
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data, error } = await supabaseServer.auth.getUser(token);
        user = data?.user || null;
        userError = error;
      }
    }
    
    // If we couldn't get user from service role key, try SSR client
    if (!user) {
      // Create the Supabase client using the SSR package
      const supabase = await createClient()
      
      // Get the user session
      const { data, error } = await supabase.auth.getUser()
      user = data?.user || null;
      userError = error;
    }
    
    if (userError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication failed', 
          error: userError.message,
          user: null
        },
        { status: 401 }
      )
    }
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unauthorized - No active session',
          user: null
        },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'User authenticated',
      user: {
        id: user.id,
        email: user.email
      }
    })
  } catch (error: unknown) {
    console.error('Error in test-auth:', error)
    // Type guard to ensure error is an Error instance
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: `Server error: ${error.message}`, error: error.message },
        { status: 500 }
      )
    } else {
      return NextResponse.json(
        { success: false, message: 'Unknown server error occurred' },
        { status: 500 }
      )
    }
  }
}