import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('GET /api/test-auth called')
    
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log('Session data in test route:', session?.user?.id)

    if (!session) {
      console.log('No session found in test route')
      return NextResponse.json(
        { 
          error: 'No session found',
          hasSession: false,
          cookies: typeof cookies === 'function' ? 'function available' : 'not available'
        },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      message: 'Session found',
      hasSession: true,
      userId: session.user.id,
      userEmail: session.user.email
    })
  } catch (error: unknown) {
    console.error('Error in test auth route:', error)
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    )
  }
}