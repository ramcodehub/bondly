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

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  try {
    console.log('Testing insert operations...');
    
    // Test inserting a contact
    console.log('Inserting test contact...');
    const { data: contactData, error: contactError } = await supabase
      .from('contacts')
      .insert({
        first_name: 'Test',
        last_name: 'Contact',
        email: 'test@example.com',
        phone: '+1234567890',
        status: 'active'
      })
      .select();

    if (contactError) {
      console.error('Error inserting contact:', contactError);
    } else {
      console.log('Contact inserted successfully:', contactData);
    }
    
    // Test inserting a deal
    console.log('Inserting test deal...');
    const { data: dealData, error: dealError } = await supabase
      .from('deals')
      .insert({
        name: 'Test Deal',
        amount: 10000,
        stage: 'lead',
        probability: 20
      })
      .select();

    if (dealError) {
      console.error('Error inserting deal:', dealError);
    } else {
      console.log('Deal inserted successfully:', dealData);
    }
    
    console.log('Insert test completed');
    
  } catch (error) {
    console.error('Insert test failed:', error);
  }
}

testInsert();