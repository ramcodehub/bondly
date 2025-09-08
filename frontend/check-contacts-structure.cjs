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

async function checkContactsStructure() {
  try {
    console.log('Checking contacts table structure...');
    
    // Get table info from information_schema
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'contacts')
      .eq('table_schema', 'public')
      .order('ordinal_position');
    
    if (error) {
      console.error('Error fetching table structure:', error);
    } else {
      console.log('Contacts table structure:');
      data.forEach(column => {
        console.log(`  ${column.column_name} (${column.data_type}, ${column.is_nullable})`);
      });
    }
    
    // Try to get a sample record using * to see what columns exist
    const { data: sampleData, error: sampleError } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('Error fetching sample data:', sampleError);
    } else {
      console.log('Sample contact data structure:');
      if (sampleData && sampleData.length > 0) {
        Object.keys(sampleData[0]).forEach(key => {
          console.log(`  ${key}: ${typeof sampleData[0][key]}`);
        });
      } else {
        console.log('  No data found');
      }
    }
    
  } catch (error) {
    console.error('Failed to check contacts structure:', error);
  }
}

checkContactsStructure();