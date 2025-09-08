import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// GET /api/deals - Get all deals
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const stage = searchParams.get('stage');
    const owner_id = searchParams.get('owner_id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Try the full query first
    let query = supabase
      .from('deals')
      .select(`
        *,
        leads!inner(first_name, last_name, email, phone, company),
        contacts(name, email, phone),
        companies(name, industry)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (stage) {
      query = query.eq('stage', stage);
    }
    
    if (owner_id) {
      query = query.eq('owner_id', owner_id);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    // If there's a join error, fall back to simpler query
    if (error && error.code === 'PGRST200') {
      console.log('Join error detected, falling back to simple query');
      const simpleQuery = supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply same filters
      let simpleFilteredQuery = simpleQuery;
      if (stage) simpleFilteredQuery = simpleFilteredQuery.eq('stage', stage);
      if (owner_id) simpleFilteredQuery = simpleFilteredQuery.eq('owner_id', owner_id);
      simpleFilteredQuery = simpleFilteredQuery.range(offset, offset + limit - 1);
      
      const { data: simpleData, error: simpleError } = await simpleFilteredQuery;
      
      if (simpleError) {
        return NextResponse.json(
          { error: simpleError.message || 'Failed to fetch deals' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: simpleData || [],
        count: simpleData?.length || 0
      });
    }

    if (error) {
      console.error('Error fetching deals:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch deals' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error in deals API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/deals - Create new deal
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const dealData = await request.json();

    // Validate required fields
    if (!dealData.name || dealData.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Deal name is required' },
        { status: 400 }
      );
    }

    // Set defaults
    const deal = {
      name: dealData.name.trim(),
      amount: dealData.amount || 0,
      stage: dealData.stage || 'lead',
      probability: dealData.probability || 0,
      close_date: dealData.close_date || null,
      description: dealData.description?.trim() || null,
      lead_id: dealData.lead_id || null,
      contact_id: dealData.contact_id || null,
      company_id: dealData.company_id || null,
      owner_id: dealData.owner_id || null,
      deal_source: dealData.deal_source?.trim() || null,
      competitors: dealData.competitors || null,
      next_step: dealData.next_step?.trim() || null
    };

    const { data, error } = await supabase
      .from('deals')
      .insert([deal])
      .select()
      .single();

    if (error) {
      console.error('Error creating deal:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create deal' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Deal created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in deals POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}