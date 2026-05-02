import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// GET /api/contact-segments - Get all contact segments
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data, error } = await supabase
      .from('contact_segments')
      .select('*')
      .eq('created_by', user.id) // Only get segments created by this user
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching contact segments:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch contact segments' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error in contact segments API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/contact-segments - Create new contact segment
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const segmentData = await request.json();

    // Ensure created_by is set to the current user
    const segmentWithUser = {
      ...segmentData,
      created_by: user.id
    };

    const { data, error } = await supabase
      .from('contact_segments')
      .insert([segmentWithUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating contact segment:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create contact segment' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Contact segment created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in contact segments POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}