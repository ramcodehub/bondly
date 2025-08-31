import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('GET /api/test-env called')
    
    // Check environment variables
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    const envInfo = {
      hasSupabaseUrl,
      hasSupabaseAnonKey,
      hasServiceRoleKey,
      supabaseUrl: hasSupabaseUrl ? 'SET' : 'NOT SET',
      supabaseAnonKey: hasSupabaseAnonKey ? 'SET' : 'NOT SET',
      serviceRoleKey: hasServiceRoleKey ? 'SET' : 'NOT SET'
    }
    
    console.log('Environment info:', envInfo)
    
    return NextResponse.json({ 
      message: 'Environment variables check completed',
      envInfo
    })
  } catch (error: unknown) {
    console.error('Error checking environment variables:', error)
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    )
  }
}