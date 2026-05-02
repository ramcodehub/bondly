import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// GET /api/contact-segments/:id - Get contact segment by ID
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
      .from('contact_segments')
      .select('*')
      .eq('id', id)
      .eq('created_by', user.id) // Ensure user can only access their own segments
      .single();

    if (error) {
      console.error('Error fetching contact segment:', error);
      return NextResponse.json(
        { error: error.message || 'Contact segment not found' },
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

// PUT /api/contact-segments/:id - Update contact segment
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
    const segmentData = await request.json();
    
    // Remove fields that shouldn't be updated
    const { id: _, created_by: __, created_at: ___, updated_at: ____, ...updateData } = segmentData;
    
    const { data, error } = await supabase
      .from('contact_segments')
      .update(updateData)
      .eq('id', id)
      .eq('created_by', user.id) // Ensure user can only update their own segments
      .select()
      .single();

    if (error) {
      console.error('Error updating contact segment:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update contact segment' },
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

// DELETE /api/contact-segments/:id - Delete contact segment
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
      .from('contact_segments')
      .delete()
      .eq('id', id)
      .eq('created_by', user.id); // Ensure user can only delete their own segments

    if (error) {
      console.error('Error deleting contact segment:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete contact segment' },
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