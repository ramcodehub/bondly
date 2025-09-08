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

async function testRealtime() {
  try {
    console.log('Testing realtime functionality...');
    
    // Test specific tables
    const tablesToTest = ['deals', 'companies', 'contacts', 'leads', 'tasks'];
    
    for (const tableName of tablesToTest) {
      try {
        console.log(`Testing ${tableName} table...`);
        
        // Try to subscribe to changes
        const channel = supabase.channel(`test-${tableName}`);
        
        channel
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: tableName
          }, (payload) => {
            console.log(`Received realtime event for ${tableName}:`, payload);
          })
          .subscribe((status, err) => {
            console.log(`Subscription status for ${tableName}:`, status);
            if (err) {
              console.error(`Error subscribing to ${tableName}:`, err);
            }
          });
        
        // Wait a bit to see if subscription works
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Unsubscribe
        channel.unsubscribe();
        
      } catch (err) {
        console.log(`Error testing ${tableName}:`, err.message);
      }
    }
    
    console.log('Realtime test completed');
    
  } catch (error) {
    console.error('Realtime test failed:', error);
  }
}

testRealtime();