import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// GET /api/contact-topics - Get all contact topics
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
      .from('contact_topics')
      .select('*')
      .eq('created_by', user.id) // Only get topics created by this user
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching contact topics:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch contact topics' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error in contact topics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/contact-topics - Create new contact topic
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
    
    const topicData = await request.json();

    // Ensure created_by is set to the current user
    const topicWithUser = {
      ...topicData,
      created_by: user.id
    };

    const { data, error } = await supabase
      .from('contact_topics')
      .insert([topicWithUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating contact topic:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create contact topic' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Contact topic created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in contact topics POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}