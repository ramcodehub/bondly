import { NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase-client'
import { User } from '@supabase/supabase-js'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('GET /api/extended/roles/me called')
    
    // Get user from the client (client-side authentication)
    console.log('Using client for authentication')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('No user found after authentication attempts')
      // For development environments, we might want to return a default set of roles
      // But we should be careful not to do this in production
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Returning empty roles array')
        return NextResponse.json({ success: true, data: [] })
      }
      
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No active session' },
        { status: 401 }
      )
    }
    
    console.log('User authenticated successfully:', user.id)
    const userId = user.id

    // Get the user's roles by joining user_roles with roles table
    console.log('Fetching roles for user:', userId)
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        roles(id, name, description)
      `)
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user roles:', error)
      // If there's an error (like RLS policy violation), return empty roles array
      // This can happen when a user has no roles assigned yet
      return NextResponse.json({ success: true, data: [] })
    }

    const roles = data.map(item => item.roles);
    console.log('Successfully fetched roles:', roles.length)

    return NextResponse.json({ success: true, data: roles })
  } catch (error: unknown) {
    console.error('Error fetching user roles:', error)
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