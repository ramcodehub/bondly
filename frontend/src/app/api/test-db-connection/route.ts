import { NextResponse } from 'next/server'
import { supabaseServer, supabaseFallback } from '../../../lib/supabase-server'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Use the server client when available for better permissions
    const supabase = supabaseServer || supabaseFallback;
    
    // Test connection by querying a simple table
    const { data, error } = await supabase
      .from('roles')
      .select('id, name')
      .limit(5)

    if (error) {
      console.error('Database connection error:', error)
      return NextResponse.json(
        { success: false, message: 'Database connection failed', error: error.message },
        { status: 500 }
      )
    }

    console.log('Database connection successful')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      roles: data
    })
  } catch (error: unknown) {
    console.error('Error in test-db-connection API:', error)
    return NextResponse.json(
      { success: false, message: 'Server error occurred' },
      { status: 500 }
    )
  }
}