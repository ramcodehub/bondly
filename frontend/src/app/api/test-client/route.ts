import { NextResponse } from 'next/server'
import { supabaseServer, supabaseFallback } from '@/lib/supabase-server'

export async function GET() {
  try {
    console.log('GET /api/test-client called')
    
    // Check which clients are available
    const clientInfo = {
      hasServerClient: !!supabaseServer,
      hasFallbackClient: !!supabaseFallback,
      clientType: supabaseServer ? 'Server (Service Role)' : 'Fallback (Anon Key)'
    }
    
    console.log('Client info:', clientInfo)
    
    return NextResponse.json({ 
      message: 'Supabase client check completed',
      clientInfo
    })
  } catch (error: unknown) {
    console.error('Error checking Supabase clients:', error)
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    )
  }
}