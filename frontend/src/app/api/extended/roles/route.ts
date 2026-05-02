import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('GET /api/extended/roles called')
    
    // Create the Supabase client using the SSR package
    const supabase = await createClient()
    
    // Get the user session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('No user found from SSR client')
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No active session' },
        { status: 401 }
      )
    }
    
    console.log('Fetching all roles')
    
    // Get all roles
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching roles from database:', error)
      return NextResponse.json(
        { success: false, message: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Roles fetched successfully:', data)
    return NextResponse.json({ success: true, data: data || [] })
  } catch (error: unknown) {
    console.error('Error fetching roles:', error)
    // Type guard to ensure error is an Error instance
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: `Server error: ${error.message}` },
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