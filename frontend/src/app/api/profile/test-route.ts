import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// This is a test route to verify the profile API is working
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Return session info for testing
    return NextResponse.json({ 
      message: 'Profile API is working',
      userId: session.user.id,
      userEmail: session.user.email
    })
  } catch (error) {
    console.error('Error testing profile API:', error)
    return NextResponse.json(
      { error: 'Failed to test profile API' },
      { status: 500 }
    )
  }
}