import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

type Company = {
  name?: string;
  industry?: string;
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  revenue?: string;
  website?: string;
  status?: 'active' | 'inactive' | 'prospect';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  description?: string;
  logo_url?: string;
  founded_year?: number;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET /api/companies/[id] called with id:', params.id);
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching company:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message || 'Failed to fetch company' },
        { status: 400 }
      );
    }

    console.log('Successfully fetched company:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT /api/companies/[id] called with id:', params.id);
    const supabase = createRouteHandlerClient({ cookies });
    const companyData: Company = await request.json();
    
    console.log('Received company update data:', companyData);
    
    // Remove any undefined values to avoid updating with null
    const cleanData = Object.fromEntries(
      Object.entries(companyData).filter(([_, value]) => value !== undefined)
    );
    
    const { data, error } = await supabase
      .from('companies')
      .update(cleanData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating company:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { 
          error: error.message || 'Failed to update company',
          code: error.code,
          details: error.details
        },
        { status: 400 }
      );
    }

    console.log('Successfully updated company:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error in PUT /api/companies/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE /api/companies/[id] called with id:', params.id);
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data, error } = await supabase
      .from('companies')
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error deleting company:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { 
          error: error.message || 'Failed to delete company',
          code: error.code,
          details: error.details
        },
        { status: 400 }
      );
    }

    console.log('Successfully deleted company:', data);
    return NextResponse.json({ message: 'Company deleted successfully', data });
  } catch (error) {
    console.error('Server error in DELETE /api/companies/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}