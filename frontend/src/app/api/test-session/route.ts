import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseServer, supabaseFallback } from '@/lib/supabase-server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('GET /api/test-session called')
    
    // Test 1: Using SSR client
    console.log('Test 1: Using SSR client')
    const supabaseRoute = await createClient()
    const { data: { user: routeUser }, error: routeError } = await supabaseRoute.auth.getUser()
    
    console.log('Route handler user:', routeUser?.id)
    if (routeError) {
      console.error('Route handler error:', routeError)
    }
    
    // Test 2: Using server client with token
    console.log('Test 2: Using server client with token')
    const cookieStore = cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value
    console.log('Access token from cookies:', accessToken ? 'Found' : 'Not found')
    
    let serverUserId = null
    let fallbackUserId = null
    
    // Test with server client (service role key)
    if (accessToken && supabaseServer) {
      const { data: serverData, error: serverError } = await supabaseServer.auth.getUser(accessToken)
      if (serverError) {
        console.error('Server client error:', serverError)
      } else if (serverData.user) {
        serverUserId = serverData.user.id
        console.log('Server client user ID:', serverUserId)
      }
    }
    
    // Test with fallback client (anon key)
    if (accessToken && supabaseFallback) {
      const { data: fallbackData, error: fallbackError } = await supabaseFallback.auth.getUser(accessToken)
      if (fallbackError) {
        console.error('Fallback client error:', fallbackError)
      } else if (fallbackData.user) {
        fallbackUserId = fallbackData.user.id
        console.log('Fallback client user ID:', fallbackUserId)
      }
    }
    
    // Test 3: Available cookies
    console.log('All cookies:', Array.from(cookieStore.getAll()))
    
    return NextResponse.json({ 
      routeSession: routeUser?.id ? 'Found' : 'Not found',
      routeUserId: routeUser?.id,
      serverSession: serverUserId ? 'Found' : 'Not found',
      serverUserId: serverUserId,
      fallbackSession: fallbackUserId ? 'Found' : 'Not found',
      fallbackUserId: fallbackUserId,
      accessToken: accessToken ? 'Found' : 'Not found',
      allCookies: Array.from(cookieStore.getAll()).map(c => c.name),
      serviceRoleAvailable: !!supabaseServer
    })
  } catch (error: unknown) {
    console.error('Error in test session route:', error)
    return NextResponse.json(
      { error: 'Server error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}