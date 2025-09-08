import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

type Lead = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source?: string;
  status?: string;
  notes?: string;
  assigned_to?: string;
};

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const leadData: Lead = await request.json();
    
    // Validate required fields
    if (!leadData.first_name || !leadData.last_name || !leadData.email) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, email' },
        { status: 400 }
      );
    }
    
    // Set defaults
    const lead = {
      first_name: leadData.first_name.trim(),
      last_name: leadData.last_name.trim(),
      email: leadData.email.trim(),
      phone: leadData.phone?.trim() || null,
      company: leadData.company?.trim() || null,
      job_title: leadData.job_title?.trim() || null,
      source: leadData.source?.trim() || null,
      status: leadData.status || 'New',
      notes: leadData.notes?.trim() || null,
      assigned_to: leadData.assigned_to || null,
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json(
        { 
          error: error.message || 'Failed to create lead',
          code: error.code,
          details: error.details
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Lead created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Server error in POST /api/leads:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/leads - Get all leads
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (source) {
      query = query.eq('source', source);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch leads' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}