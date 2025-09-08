const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Not set');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create a fresh Supabase client with explicit schema settings
console.log('Creating fresh client with schema settings...');
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  }
});

async function refreshSchemaAndTest() {
  try {
    console.log('Testing schema refresh...');
    
    // Try to get table info using RPC (if available)
    console.log('Attempting to refresh schema cache...');
    
    // Try inserting a contact with the correct schema
    const testContact = {
      first_name: 'Schema',
      last_name: 'Test',
      email: 'schema@test.com',
      phone: '+1234567890',
      position: 'Test Position',
      status: 'active',
      notes: 'Testing schema refresh'
    };
    
    console.log('Attempting to insert test contact...');
    const { data, error } = await supabase
      .from('contacts')
      .insert([testContact])
      .select();
    
    if (error) {
      console.error('Insert failed:', error);
      
      // Try with different column names that might exist
      console.log('Trying with alternative column names...');
      const altContact = {
        full_name: 'Schema Test',
        email: 'schema@test.com',
        phone: '+1234567890',
        company: 'Test Company',
        position: 'Test Position',
        status: 'active',
        notes: 'Testing schema refresh'
      };
      
      const { data: altData, error: altError } = await supabase
        .from('contacts')
        .insert([altContact])
        .select();
      
      if (altError) {
        console.error('Alternative insert also failed:', altError);
      } else {
        console.log('Alternative insert successful:', altData);
      }
    } else {
      console.log('Insert successful:', data);
    }
    
  } catch (error) {
    console.error('Schema refresh test failed:', error);
  }
}

refreshSchemaAndTest();