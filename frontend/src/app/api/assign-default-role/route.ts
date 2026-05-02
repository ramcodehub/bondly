import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../lib/supabase-server'

export const dynamic = "force-dynamic"

// This endpoint assigns the default 'user' role to authenticated users who don't have any roles yet
export async function POST(request: Request) {
  try {
    console.log('Assigning default role - starting authentication check...')
    
    // Task 3: Use server client with cookies
    const supabase = createSupabaseServerClient();
    
    console.log('Attempting authentication via cookies')
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('No user found after cookie verification');
      return NextResponse.json(
        { success: false, message: 'No authenticated user found' },
        { status: 401 }
      )
    }
    
    console.log('User authenticated successfully for role assignment:', user.id)
    const userId = user.id

    // First, check if the user already has roles
    console.log('Checking existing role_id for user:', userId)
    const { data: profileWithRole, error: checkError } = await supabase
      .from('profiles')
      .select('role_id')
      .eq('id', userId)
      .single()

    if (checkError) {
      console.error('Error checking existing profile:', checkError)
    } else if (profileWithRole && profileWithRole.role_id) {
      console.log('User already has a role_id assigned')
      return NextResponse.json({ 
        success: true, 
        message: 'User already has a role assigned',
        data: { alreadyHadRoles: true }
      })
    }

    // Get the 'user' role ID (the default role we just added)
    console.log('Fetching default user role')
    const { data: userRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'user')
      .single()

    if (roleError || !userRole) {
      console.error('Error fetching user role:', roleError)
      return NextResponse.json(
        { success: false, message: 'User role not found' },
        { status: 500 }
      )
    }

    // 🔍 PHASE 9: BACKEND ROLE ASSIGNMENT (PROFILES SCHEMA)
    // Update the profiles table which now holds the role_id
    console.log('Assigning role_id in profiles for user:', userId)
    const { data: updatedProfile, error: assignError } = await supabase
      .from('profiles')
      .update({
        role_id: userRole.id
      })
      .eq('id', userId)
      .select(`
        roles:roles!role_id (id, name, description)
      `)
      .single()

    if (assignError) {
      console.error('Error assigning role:', assignError)
      return NextResponse.json(
        { success: false, message: `Failed to assign role: ${assignError.message}` },
        { status: 500 }
      )
    }

    console.log('Successfully assigned default role in profiles')
    return NextResponse.json({ 
      success: true, 
      message: 'Default role assigned successfully',
      data: { 
        role: updatedProfile.roles,
        alreadyHadRoles: false
      }
    })
  } catch (error: unknown) {
    console.error('Error assigning default role:', error)
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