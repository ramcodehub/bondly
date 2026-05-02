import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// GET /api/contact-topics/:id - Get contact topic by ID
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
      .from('contact_topics')
      .select('*')
      .eq('id', id)
      .eq('created_by', user.id) // Ensure user can only access their own topics
      .single();

    if (error) {
      console.error('Error fetching contact topic:', error);
      return NextResponse.json(
        { error: error.message || 'Contact topic not found' },
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

// PUT /api/contact-topics/:id - Update contact topic
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
    const topicData = await request.json();
    
    // Remove fields that shouldn't be updated
    const { id: _, created_by: __, created_at: ___, updated_at: ____, ...updateData } = topicData;
    
    const { data, error } = await supabase
      .from('contact_topics')
      .update(updateData)
      .eq('id', id)
      .eq('created_by', user.id) // Ensure user can only update their own topics
      .select()
      .single();

    if (error) {
      console.error('Error updating contact topic:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update contact topic' },
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

// DELETE /api/contact-topics/:id - Delete contact topic
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
      .from('contact_topics')
      .delete()
      .eq('id', id)
      .eq('created_by', user.id); // Ensure user can only delete their own topics

    if (error) {
      console.error('Error deleting contact topic:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete contact topic' },
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