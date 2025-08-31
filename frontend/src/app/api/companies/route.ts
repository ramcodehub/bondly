import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Use service role client for bypassing RLS when needed
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Regular client for user operations
const supabaseBasic = createClient(supabaseUrl, supabaseAnonKey);

type Company = {
  name: string;
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

export async function POST(request: NextRequest) {
  try {
    // Try authenticated client first, fallback to admin client if RLS issues
    let supabase = createRouteHandlerClient({ cookies });
    const companyData: Company = await request.json();
    
    // Validate required fields
    if (!companyData.name) {
      console.log('Validation failed: missing required fields');
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }
    
    // Set default status if not provided
    if (!companyData.status) {
      companyData.status = 'active';
    }
    console.log('About to insert company into Supabase...');
    
    // Try to insert the company
    let { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();

    // If RLS error and admin client available, try with admin client
    if (error && error.code === '42501' && supabaseAdmin) {
      console.log('RLS error detected, trying with admin client...');
      const adminResult = await supabaseAdmin
        .from('companies')
        .insert([companyData])
        .select()
        .single();
      
      data = adminResult.data;
      error = adminResult.error;
    }

    if (error) {
      console.error('Supabase error creating company:', error);
      
      // Handle RLS policy violation specifically
      if (error.code === '42501') {
        return NextResponse.json(
          { 
            error: 'Database security policy violation',
            details: 'Row Level Security (RLS) is enabled for the companies table. You need to run the RLS fix script to allow company creation.',
            suggestion: 'Run the companies-rls-fix.sql script in your Supabase SQL Editor to fix this issue.',
            technicalError: error.message,
            fixScript: 'companies-rls-fix.sql'
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { 
          error: error.message || 'Failed to create company',
          code: error.code,
          details: error.details
        },
        { status: 400 }
      );
    }

    console.log('Successfully created company:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Server error in POST /api/companies:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const industry = searchParams.get('industry');
    const size = searchParams.get('size');

    let query = supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (industry) {
      query = query.eq('industry', industry);
    }
    if (size) {
      query = query.eq('size', size);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching companies:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch companies' },
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