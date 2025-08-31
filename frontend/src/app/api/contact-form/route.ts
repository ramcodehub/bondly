import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key for server-side operations to bypass RLS
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a service role client that bypasses RLS
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, companyType, company, location, message } = await request.json();
    
    // Validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Name is required and must be at least 2 characters' },
        { status: 400 }
      );
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }
    
    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: 'Message is required and must be at least 10 characters' },
        { status: 400 }
      );
    }
    
    // Prepare data for insertion
    const contactData = {
      full_name: name,
      email: email,
      subject: subject || null,
      message: message,
      company_type: companyType || 'individual',
      company_name: companyType === 'company' ? company : null,
      location: location || null
    };

    console.log('Inserting contact data:', contactData);

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([contactData])
      .select()
      .single();

    if (error) {
      console.error('Error submitting contact form:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to submit contact form' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `Thank you, ${name}, your message has been received! Our team will contact you very soon.`,
      data: data
    }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}