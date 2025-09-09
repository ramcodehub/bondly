import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// POST /api/contacts - Create new contact
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const contactData = await request.json();

    // Validate required fields
    if (!contactData.name) {
      return NextResponse.json(
        { error: 'Contact name is required' },
        { status: 400 }
      );
    }

    const contact = {
      name: contactData.name.trim(),
      role: contactData.role?.trim() || null,
      email: contactData.email?.trim() || null,
      phone: contactData.phone?.trim() || null,
      image_url: contactData.image_url?.trim() || null,
      company_name: contactData.company_name?.trim() || null,
      status: contactData.status || 'pending',
      lastContact: contactData.lastContact || null,
      company_id: contactData.company_id || null,
    };

    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create contact' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Contact created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in contacts POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/contacts - Get all contacts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Try query with companies join first
    let query = supabase
      .from('contacts')
      .select(`
        *,
        companies(name)
      `)
      .order('created_at', { ascending: false });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching contacts:', error);
      // If there's a join error, try a simpler query
      if (error.code === 'PGRST200') {
        console.log('Join error detected, falling back to simple query');
        const simpleQuery = supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false });
        
        const simpleQueryWithPagination = simpleQuery.range(offset, offset + limit - 1);
        
        const { data: simpleData, error: simpleError } = await simpleQueryWithPagination;
        
        if (simpleError) {
          return NextResponse.json(
            { error: simpleError.message || 'Failed to fetch contacts' },
            { status: 400 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: simpleData || [],
          count: simpleData?.length || 0
        });
      }
      
      return NextResponse.json(
        { error: error.message || 'Failed to fetch contacts' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error in contacts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/contacts/:id - Update contact
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const contactData = await request.json();
    const { id } = params;

    // Remove fields that shouldn't be updated
    const { id: _, created_at: __, updated_at: ___, ...updateData } = contactData;

    // Ensure updated_at is set automatically by the database
    const { data, error } = await supabase
      .from('contacts')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update contact' },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
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

// DELETE /api/contacts/:id - Delete contact
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting contact:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete contact' },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
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