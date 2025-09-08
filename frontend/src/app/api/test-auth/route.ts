import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('GET /api/test-auth called')
    
    const supabase = await createClient()
    
    // Get the user session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log('User data in test route:', user?.id)

    if (!user) {
      console.log('No user found in test route')
      return NextResponse.json(
        { 
          error: 'No user found',
          hasUser: false,
          cookies: typeof cookies === 'function' ? 'function available' : 'not available'
        },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      message: 'User found',
      hasUser: true,
      userId: user.id,
      userEmail: user.email
    })
  } catch (error: unknown) {
    console.error('Error in test auth route:', error)
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    )
  }
}