import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// GET /api/lead-qualifications/:id - Get lead qualification by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    
    const { data, error } = await supabase
      .from('lead_qualifications')
      .select(`
        *,
        leads(name, email, phone, status)
      `)
      .eq('id', id)
      .eq('qualified_by', user.id) // Ensure user can only access their own qualifications
      .single();

    if (error) {
      console.error('Error fetching lead qualification:', error);
      return NextResponse.json(
        { error: error.message || 'Lead qualification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/lead-qualifications/:id - Update lead qualification
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    const qualificationData = await request.json();
    
    // Remove fields that shouldn't be updated
    const { id: _, qualified_by: __, created_at: ___, updated_at: ____, ...updateData } = qualificationData;
    
    const { data, error } = await supabase
      .from('lead_qualifications')
      .update(updateData)
      .eq('id', id)
      .eq('qualified_by', user.id) // Ensure user can only update their own qualifications
      .select()
      .single();

    if (error) {
      console.error('Error updating lead qualification:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update lead qualification' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/lead-qualifications/:id - Delete lead qualification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    
    const { error } = await supabase
      .from('lead_qualifications')
      .delete()
      .eq('id', id)
      .eq('qualified_by', user.id); // Ensure user can only delete their own qualifications

    if (error) {
      console.error('Error deleting lead qualification:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete lead qualification' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}