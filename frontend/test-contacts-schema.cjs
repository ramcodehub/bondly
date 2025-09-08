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

// Create Supabase client with explicit schema
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

async function testContactsSchema() {
  try {
    console.log('Testing contacts schema...');
    
    // Test fetching contacts with explicit column selection
    const { data, error } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email, phone, company_id, position, status, notes, created_at, updated_at')
      .limit(1);
    
    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      console.log('Contacts schema test successful');
      console.log('Sample contact:', JSON.stringify(data, null, 2));
    }
    
    // Test inserting a contact
    console.log('Testing contact insertion...');
    const newContact = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '+1234567890',
      position: 'Tester',
      status: 'active',
      notes: 'Test contact for schema verification'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('contacts')
      .insert(newContact)
      .select();
    
    if (insertError) {
      console.error('Error inserting contact:', insertError);
    } else {
      console.log('Contact inserted successfully');
      console.log('Inserted contact:', JSON.stringify(insertData, null, 2));
    }
    
  } catch (error) {
    console.error('Contacts schema test failed:', error);
  }
}

testContactsSchema();