// Test to check the actual schema of the contacts table
import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = 'https://vknqythzsdpwyycfmujz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbnF5dGh6c2Rwd3l5Y2ZtdWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NjUyMjIsImV4cCI6MjA3MDE0MTIyMn0.DevzSWZS1OFl-oGKANQwerOlC75kWrIfHBTsAowhWJk'

console.log('Checking contacts table schema...')
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  try {
    // Try to get table info by inserting a test record
    console.log('Attempting to insert test contact to see table structure...')
    
    const testContact = {
      first_name: 'Test',
      last_name: 'Contact',
      email: 'test@example.com'
    };
    
    const { data, error } = await supabase
      .from('contacts')
      .insert([testContact])
      .select('*')
      .single();
    
    if (error) {
      console.error('Error inserting contact:', error)
      // Try with different field names
      console.log('Trying with name field instead...')
      const testContact2 = {
        name: 'Test Contact',
        email: 'test@example.com'
      };
      
      const { data: data2, error: error2 } = await supabase
        .from('contacts')
        .insert([testContact2])
        .select('*')
        .single();
        
      if (error2) {
        console.error('Error inserting contact with name field:', error2)
        return
      }
      
      console.log('Success with name field! Contact data:', data2)
      
      // Clean up
      await supabase.from('contacts').delete().eq('id', data2.id);
      console.log('Cleaned up test contact')
      return
    }
    
    console.log('Success with first_name/last_name fields! Contact data:', data)
    
    // Clean up
    await supabase.from('contacts').delete().eq('id', data.id);
    console.log('Cleaned up test contact')
    
  } catch (error) {
    console.error('Exception:', error)
  }
}

checkSchema()