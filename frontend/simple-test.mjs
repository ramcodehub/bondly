// Simple test script for database connection
import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = 'https://vknqythzsdpwyycfmujz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbnF5dGh6c2Rwd3l5Y2ZtdWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NjUyMjIsImV4cCI6MjA3MDE0MTIyMn0.DevzSWZS1OFl-oGKANQwerOlC75kWrIfHBTsAowhWJk'

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Attempting to fetch leads...')
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error:', error)
      return
    }
    
    console.log('Success! Data:', data)
  } catch (error) {
    console.error('Exception:', error)
  }
}

testConnection()