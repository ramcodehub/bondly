import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// POST /api/contacts - Create new contact
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const contactData = await request.json();

    // Validate required fields based on actual table structure
    // Check which structure we're using - name or first_name/last_name
    let contact;
    if (contactData.first_name && contactData.last_name) {
      // Using first_name/last_name structure
      if (!contactData.first_name || !contactData.last_name || !contactData.email) {
        return NextResponse.json(
          { error: 'Contact first_name, last_name, and email are required' },
          { status: 400 }
        );
      }
      
      contact = {
        first_name: contactData.first_name.trim(),
        last_name: contactData.last_name.trim(),
        email: contactData.email.trim(),
        phone: contactData.phone?.trim() || null,
        company_id: contactData.company_id || null,
        position: contactData.position?.trim() || null,
        notes: contactData.notes?.trim() || null,
      };
    } else {
      // Using name structure
      if (!contactData.name || !contactData.email) {
        return NextResponse.json(
          { error: 'Contact name and email are required' },
          { status: 400 }
        );
      }
      
      contact = {
        name: contactData.name.trim(),
        email: contactData.email.trim(),
        role: contactData.role?.trim() || null,
        phone: contactData.phone?.trim() || null,
        image_url: contactData.image_url?.trim() || null,
      };
    }

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