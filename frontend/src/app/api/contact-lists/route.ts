import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// GET /api/contact-lists - Get all contact lists
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
      .from('contact_lists')
      .select('*')
      .eq('created_by', user.id) // Only get lists created by this user
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching contact lists:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch contact lists' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error in contact lists API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/contact-lists - Create new contact list
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
    
    const listData = await request.json();

    // Ensure created_by is set to the current user
    const listWithUser = {
      ...listData,
      created_by: user.id
    };

    const { data, error } = await supabase
      .from('contact_lists')
      .insert([listWithUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating contact list:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create contact list' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Contact list created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in contact lists POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}