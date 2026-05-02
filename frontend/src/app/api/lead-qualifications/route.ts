import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// GET /api/lead-qualifications - Get all lead qualifications
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
      .from('lead_qualifications')
      .select(`
        *,
        leads(name, email, phone, status)
      `)
      .eq('qualified_by', user.id) // Only get qualifications created by this user
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching lead qualifications:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch lead qualifications' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error in lead qualifications API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/lead-qualifications - Create new lead qualification
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
    
    const qualificationData = await request.json();

    // Ensure qualified_by is set to the current user
    const qualificationWithUser = {
      ...qualificationData,
      qualified_by: user.id
    };

    const { data, error } = await supabase
      .from('lead_qualifications')
      .insert([qualificationWithUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead qualification:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create lead qualification' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Lead qualification created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in lead qualifications POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}