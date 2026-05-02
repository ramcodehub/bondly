import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// GET /api/contact-lists/:id - Get contact list by ID
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
      .from('contact_lists')
      .select('*')
      .eq('id', id)
      .eq('created_by', user.id) // Ensure user can only access their own lists
      .single();

    if (error) {
      console.error('Error fetching contact list:', error);
      return NextResponse.json(
        { error: error.message || 'Contact list not found' },
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

// PUT /api/contact-lists/:id - Update contact list
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
    const listData = await request.json();
    
    // Remove fields that shouldn't be updated
    const { id: _, created_by: __, created_at: ___, updated_at: ____, ...updateData } = listData;
    
    const { data, error } = await supabase
      .from('contact_lists')
      .update(updateData)
      .eq('id', id)
      .eq('created_by', user.id) // Ensure user can only update their own lists
      .select()
      .single();

    if (error) {
      console.error('Error updating contact list:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update contact list' },
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

// DELETE /api/contact-lists/:id - Delete contact list
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
      .from('contact_lists')
      .delete()
      .eq('id', id)
      .eq('created_by', user.id); // Ensure user can only delete their own lists

    if (error) {
      console.error('Error deleting contact list:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete contact list' },
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