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

async function testDataFetching() {
  try {
    console.log('Testing data fetching...');
    
    // Test specific tables
    const tablesToTest = ['deals', 'companies', 'contacts', 'leads', 'tasks'];
    
    for (const tableName of tablesToTest) {
      try {
        console.log(`Fetching data from ${tableName} table...`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(5);
        
        if (error) {
          console.error(`Error fetching ${tableName}:`, error);
        } else {
          console.log(`${tableName}: Found ${data.length} records`);
          if (data.length > 0) {
            console.log(`Sample record from ${tableName}:`, JSON.stringify(data[0], null, 2));
          }
        }
      } catch (err) {
        console.log(`Error testing ${tableName}:`, err.message);
      }
    }
    
    console.log('Data fetching test completed');
    
  } catch (error) {
    console.error('Data fetching test failed:', error);
  }
}

testDataFetching();