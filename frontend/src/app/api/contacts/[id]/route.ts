import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export const dynamic = "force-dynamic";

// GET /api/contacts/[id] - Get contact by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        companies(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching contact:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message || 'Failed to fetch contact' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in contacts GET by ID API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/contacts/[id] - Update contact by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const contactData = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // Remove fields that shouldn't be updated
    const { id: _, created_at: __, ...updateData } = contactData;

    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        companies(name)
      `)
      .single();

    if (error) {
      console.error('Error updating contact:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message || 'Failed to update contact' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Contact updated successfully'
    });

  } catch (error) {
    console.error('Error in contacts PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id] - Delete contact by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting contact:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message || 'Failed to delete contact' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Error in contacts DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}