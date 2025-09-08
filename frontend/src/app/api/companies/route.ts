import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// POST /api/companies - Create new company
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const companyData = await request.json();
    
    // Validate required fields
    if (!companyData.name || companyData.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Set defaults
    const company = {
      name: companyData.name.trim(),
      industry: companyData.industry?.trim() || null,
      size: companyData.size || null,
      revenue: companyData.revenue?.trim() || null,
      website: companyData.website?.trim() || null,
      status: companyData.status || 'active',
      phone: companyData.phone?.trim() || null,
      email: companyData.email?.trim() || null,
      address: companyData.address?.trim() || null,
      city: companyData.city?.trim() || null,
      country: companyData.country?.trim() || null,
      postal_code: companyData.postal_code?.trim() || null,
      description: companyData.description?.trim() || null,
      logo_url: companyData.logo_url?.trim() || null,
      founded_year: companyData.founded_year || null,
    };

    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create company' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Company created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in companies POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/companies - Get all companies
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const industry = searchParams.get('industry');
    const size = searchParams.get('size');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (industry) {
      query = query.eq('industry', industry);
    }
    if (size) {
      query = query.eq('size', size);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching companies:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch companies' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error in companies API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}