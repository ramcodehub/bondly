import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('Testing roles setup')
    
    // Get all roles from the database
    const { data: roles, error } = await supabase
      .from('roles')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching roles:', error)
      return NextResponse.json(
        { success: false, message: 'Error fetching roles', error: error.message },
        { status: 500 }
      )
    }

    console.log('Found roles:', roles)

    // Check if the 'user' role exists
    const userRole = roles.find((role: any) => role.name === 'user')
    
    return NextResponse.json({
      success: true,
      data: {
        roles,
        userRoleExists: !!userRole,
        userRole: userRole || null
      }
    })
  } catch (error: unknown) {
    console.error('Error testing roles:', error)
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