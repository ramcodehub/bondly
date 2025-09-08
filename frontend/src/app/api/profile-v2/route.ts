import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

// Helper function to get user ID with better error handling
async function getUserId(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const { data: { user }, error: sessionError } = await supabase.auth.getUser()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return null
    }
    
    if (!user) {
      console.log('No user found')
      return null
    }
    
    console.log('User ID:', user.id)
    return user.id
  } catch (error) {
    console.error('Error getting user ID:', error)
    return null
  }
}

export async function PUT(request: Request) {
  try {
    console.log('PUT /api/profile-v2 called')
    
    const supabase = await createClient()
    
    // Get the user ID
    const userId = await getUserId(supabase)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session' },
        { status: 401 }
      )
    }

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
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('GET /api/profile-v2 called')
    
    const supabase = await createClient()
    
    // Get the user ID
    const userId = await getUserId(supabase)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session' },
        { status: 401 }
      )
    }

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
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    )
  }
}