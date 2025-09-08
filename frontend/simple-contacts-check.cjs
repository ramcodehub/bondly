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

// Create Supabase client with schema refresh options
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

async function simpleContactsCheck() {
  try {
    console.log('Performing simple contacts check...');
    
    // Try a basic select with error handling
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error with contacts query:', error);
      
      // Try with explicit schema
      console.log('Trying with explicit schema reference...');
      const { data: data2, error: error2 } = await supabase
        .from('public.contacts')
        .select('*')
        .limit(1);
      
      if (error2) {
        console.error('Error with explicit schema query:', error2);
      } else {
        console.log('Explicit schema query successful');
        console.log('Data:', data2);
      }
    } else {
      console.log('Basic contacts query successful');
      console.log('Data:', data);
    }
    
  } catch (error) {
    console.error('Failed to check contacts:', error);
  }
}

simpleContactsCheck();