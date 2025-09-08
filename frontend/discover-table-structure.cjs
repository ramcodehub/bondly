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

async function discoverTableStructure() {
  try {
    console.log('Discovering table structure...');
    
    // List all tables
    console.log('Listing all tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else {
      console.log('Tables in public schema:');
      tables.forEach(table => {
        console.log('  -', table.tablename);
      });
    }
    
    // Try to get column info using pg_columns
    console.log('Getting column info from pg_columns...');
    const { data: columns, error: columnsError } = await supabase
      .from('pg_columns')
      .select('column_name, table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'contacts');
    
    if (columnsError) {
      console.error('Error getting column info:', columnsError);
    } else {
      console.log('Columns in contacts table:');
      columns.forEach(column => {
        console.log('  -', column.column_name);
      });
    }
    
  } catch (error) {
    console.error('Failed to discover table structure:', error);
  }
}

discoverTableStructure();