import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('Checking if user role exists')
    
    // Check if the 'user' role exists
    const { data: userRole, error: roleError } = await supabase
      .from('roles')
      .select('*')
      .eq('name', 'user')
      .single()

    if (roleError) {
      console.error('Error fetching user role:', roleError)
      return NextResponse.json(
        { success: false, message: 'Error fetching user role', error: roleError.message },
        { status: 500 }
      )
    }

    if (!userRole) {
      console.log('User role does not exist')
      return NextResponse.json({
        success: true,
        data: {
          userRoleExists: false,
          userRole: null
        }
      })
    }

    console.log('User role exists:', userRole)
    
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
      return NextResponse.json({
        success: true,
        data: {
          userRoleExists: true,
          userRole,
          currentUser: null,
          userHasRole: false
        }
      })
    }
    
    // Check if user has the user role
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .eq('role_id', userRole.id)

    if (userRolesError) {
      console.error('Error fetching user roles:', userRolesError)
      return NextResponse.json(
        { success: false, message: 'Error fetching user roles', error: userRolesError.message },
        { status: 500 }
      )
    }

    console.log('User roles count:', userRoles.length)

    return NextResponse.json({
      success: true,
      data: {
        userRoleExists: true,
        userRole,
        currentUser: {
          id: user.id,
          email: user.email
        },
        userHasRole: userRoles.length > 0
      }
    })
  } catch (error: unknown) {
    console.error('Error checking user role:', error)
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