import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic"

export async function PUT(request: Request) {
  try {
    console.log('PUT /api/profile called')
    
    // Get user from the client (client-side authentication)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('No user found from client')
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      )
    }
    
    const userId = user.id
    console.log('Got user ID from client:', userId)

    const formData = await request.json()
    console.log('Updating profile for user:', userId, 'with data:', formData)
    
    // Update the user's profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        location: formData.location,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile in database:', error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Profile updated successfully:', data)
    return NextResponse.json({ data })
  } catch (error: unknown) {
    console.error('Error updating profile:', error)
    // Type guard to ensure error is an Error instance
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    } else {
      return NextResponse.json(
        { error: 'Unknown server error occurred' },
        { status: 500 }
      )
    }
  }
}

export async function GET() {
  try {
    console.log('GET /api/profile called')
    
    // Get user from the client (client-side authentication)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('No user found from client')
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      )
    }
    
    const userId = user.id
    console.log('Got user ID from client:', userId)

    console.log('Fetching profile for user:', userId)
    
    // Get the user's profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile from database:', error)
      // Check if it's a "no rows" error (profile doesn't exist)
      if (error.code === 'PGRST116') {
        // Profile doesn't exist, return empty profile object
        return NextResponse.json({ data: null })
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Profile fetched successfully:', data)
    return NextResponse.json({ data })
  } catch (error: unknown) {
    console.error('Error fetching profile:', error)
    // Type guard to ensure error is an Error instance
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    } else {
      return NextResponse.json(
        { error: 'Unknown server error occurred' },
        { status: 500 }
      )
    }
  }
}