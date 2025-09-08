import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

// This is a test route to verify the profile API is working
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get the user session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Return user info for testing
    return NextResponse.json({ 
      message: 'Profile API is working',
      userId: user.id,
      userEmail: user.email
    })
  } catch (error) {
    console.error('Error testing profile API:', error)
    return NextResponse.json(
      { error: 'Failed to test profile API' },
      { status: 500 }
    )
  }
}