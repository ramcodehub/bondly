import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing Supabase environment variables' 
        }, 
        { status: 500 }
      )
    }

    // Create a test client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Test the connection
    const { data, error } = await supabase
      .from('contacts')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Supabase connection test failed:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to Supabase',
      data: data
    })
  } catch (error: any) {
    console.error('Unexpected error in test connection API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Unexpected error occurred' 
      }, 
      { status: 500 }
    )
  }
}