import { NextResponse } from 'next/server'
import { supabaseServer, supabaseFallback } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    console.log('POST /api/test-profile-update called')
    console.log('Using Supabase client type:', supabaseServer ? 'Server (Service Role)' : 'Fallback (Anon Key)')
    
    // Always use the server client when available (service role key)
    const supabase = supabaseServer || supabaseFallback
    
    // For this test, we'll simulate updating a specific user's profile
    // In a real scenario, you'd get this from the session
    const testUserId = '8f2809ba-457c-41f7-9805-2d4228a6b5bf' // The user ID from your logs
    
    const formData = await request.json()
    console.log('Updating profile for user:', testUserId, 'with data:', formData)
    
    // Update the user's profile using the appropriate client
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name || 'Test User',
        phone: formData.phone || '',
        bio: formData.bio || 'Test bio',
        avatar_url: formData.avatar_url || '',
        location: formData.location || 'Test location',
        updated_at: new Date().toISOString()
      })
      .eq('id', testUserId)
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
    return NextResponse.json({ data, message: 'Profile updated successfully' })
  } catch (error: unknown) {
    console.error('Error updating profile:', error)
    // Check if it's a SyntaxError (JSON parsing error)
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: `Invalid JSON in request: ${error.message}` },
        { status: 400 }
      )
    }
    // Check if it's a general Error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    }
    // Fallback for unknown error types
    return NextResponse.json(
      { error: 'Unknown server error occurred' },
      { status: 500 }
    )
  }
}