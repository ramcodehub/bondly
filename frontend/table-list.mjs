// List all tables in the database
import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = 'https://vknqythzsdpwyycfmujz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbnF5dGh6c2Rwd3l5Y2ZtdWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NjUyMjIsImV4cCI6MjA3MDE0MTIyMn0.DevzSWZS1OFl-oGKANQwerOlC75kWrIfHBTsAowhWJk'

console.log('Listing all tables in the database...')
const supabase = createClient(supabaseUrl, supabaseKey)

async function listTables() {
  try {
    // This is a workaround to list tables since Supabase doesn't have a direct method
    // We'll try to query each table we know about
    
    const tables = ['leads', 'companies', 'contacts', 'deals', 'tasks'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
          
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: Accessible (${data.length} records)`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }
    
  } catch (error) {
    console.error('Exception:', error)
  }
}

listTables()