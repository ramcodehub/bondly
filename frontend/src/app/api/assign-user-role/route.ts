import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    console.log('Manually assigning user role')
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('Error fetching user:', userError)
      return NextResponse.json(
        { success: false, message: 'Error fetching user', error: userError.message },
        { status: 500 }
      )
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No authenticated user found' },
        { status: 401 }
      )
    }
    
    console.log('User authenticated:', user.id)
    
    // Get the 'user' role ID
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

    console.log('User role found:', userRole.id)
    
    // Assign the 'user' role to the authenticated user
    const { data: assignedRole, error: assignError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role_id: userRole.id
      })
      .select(`
        roles(id, name, description)
      `)
      .single()

    if (assignError) {
      console.error('Error assigning role:', assignError)
      // If it's a duplicate key error, the role might already be assigned
      if (assignError.code === '23505') {
        return NextResponse.json({ 
          success: true, 
          message: 'Role already assigned'
        })
      }
      
      return NextResponse.json(
        { success: false, message: `Failed to assign role: ${assignError.message}` },
        { status: 500 }
      )
    }

    console.log('Successfully assigned user role')
    return NextResponse.json({ 
      success: true, 
      message: 'User role assigned successfully',
      data: { 
        role: assignedRole.roles
      }
    })
  } catch (error: unknown) {
    console.error('Error assigning user role:', error)
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