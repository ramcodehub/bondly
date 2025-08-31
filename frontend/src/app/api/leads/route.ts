import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Initialize Supabase client with service role for admin operations
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

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/leads called');
    
    // Use authenticated client
    const supabase = createRouteHandlerClient({ cookies });
    const leadData: Lead = await request.json();
    
    // Log the received data for debugging
    console.log('Received lead data:', leadData);
    
    // Validate required fields
    if (!leadData.first_name || !leadData.last_name || !leadData.email) {
      console.log('Validation failed: missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, email' },
        { status: 400 }
      );
    }
    
    console.log('About to insert lead into Supabase...');
    
    // Try to insert the lead
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating lead:', error);
      
      // Handle RLS policy violation specifically
      if (error.code === '42501') {
        return NextResponse.json(
          { 
            error: 'Database security policy violation',
            details: 'Row Level Security (RLS) is enabled for the leads table. Please ensure you are authenticated or contact your administrator to configure proper access policies.',
            suggestion: 'Either disable RLS for the leads table or create an INSERT policy that allows the operation.',
            technicalError: error.message
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { 
          error: error.message || 'Failed to create lead',
          code: error.code,
          details: error.details
        },
        { status: 400 }
      );
    }

    console.log('Successfully created lead:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Server error in POST /api/leads:', error);
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
    const source = searchParams.get('source');

    let query = supabase
      .from('leads')
      .select('*');

    if (status) {
      query = query.eq('status', status);
    }
    if (source) {
      query = query.eq('source', source);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch leads' },
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
