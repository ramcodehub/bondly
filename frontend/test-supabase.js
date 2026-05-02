import { config } from 'dotenv';
config(); // Load environment variables from .env.local

import { createClient } from '@supabase/supabase-js';

// Use the same environment variables as in the app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test a simple query on the leads table (without the company column)
    const { data, error } = await supabase
      .from('leads')
      .select('id, name, email, phone')
      .limit(1);
    
    if (error) {
      console.error('Error querying leads table:', error);
      return false;
    }
    
    console.log('Successfully connected to Supabase');
    console.log('Sample lead data:', data);
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('✅ Supabase connection test passed');
  } else {
    console.log('❌ Supabase connection test failed');
  }
  process.exit(success ? 0 : 1);
});