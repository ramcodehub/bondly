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

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection by listing tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
    } else {
      console.log('Tables in database:');
      tables.forEach(table => console.log('- ' + table.table_name));
    }
    
    // Test specific tables
    const tablesToTest = ['deals', 'companies', 'contacts', 'leads', 'tasks'];
    
    for (const tableName of tablesToTest) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(1);
        
        if (error) {
          console.log(`Error accessing ${tableName}:`, error.message);
        } else {
          console.log(`${tableName}: ${data.length} records found`);
          if (data.length > 0) {
            console.log(`Sample record from ${tableName}:`, JSON.stringify(data[0], null, 2));
          }
        }
      } catch (err) {
        console.log(`Error testing ${tableName}:`, err.message);
      }
    }
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();