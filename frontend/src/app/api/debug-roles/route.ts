import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('Debugging roles setup')
    
    // Get all roles from the database
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .order('name')

    if (rolesError) {
      console.error('Error fetching roles:', rolesError)
      return NextResponse.json(
        { success: false, message: 'Error fetching roles', error: rolesError.message },
        { status: 500 }
      )
    }

    console.log('Found roles:', roles)

    // Check if the 'user' role exists
    const userRole = roles.find((role: any) => role.name === 'user')
    
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
          roles,
          userRoleExists: !!userRole,
          userRole: userRole || null,
          currentUser: null,
          userRoles: []
        }
      })
    }
    
    // Get user's roles
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select(`
        roles(id, name, description)
      `)
      .eq('user_id', user.id)

    if (userRolesError) {
      console.error('Error fetching user roles:', userRolesError)
      return NextResponse.json(
        { success: false, message: 'Error fetching user roles', error: userRolesError.message },
        { status: 500 }
      )
    }

    console.log('User roles:', userRoles)

    return NextResponse.json({
      success: true,
      data: {
        roles,
        userRoleExists: !!userRole,
        userRole: userRole || null,
        currentUser: {
          id: user.id,
          email: user.email
        },
        userRoles: userRoles.map((ur: any) => ur.roles)
      }
    })
  } catch (error: unknown) {
    console.error('Error debugging roles:', error)
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