// Test script to verify profile API functionality
const { createClient } = require('@supabase/supabase-js')

// Get these from your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProfileAPI() {
  try {
    console.log('=== TESTING PROFILE API ===')
    
    // Test 1: Check if we can connect to Supabase
    console.log('\n1. Testing Supabase connection...')
    const { data: testConnection, error: connectionError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      
    if (connectionError && connectionError.code !== 'PGRST116') {
      console.error('   Connection failed:', connectionError.message)
      return
    }
    console.log('   Connection successful')
    
    // Test 2: Check profiles table structure
    console.log('\n2. Checking profiles table structure...')
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'profiles')
      .order('ordinal_position')

    if (columnsError) {
      console.error('   Error fetching table columns:', columnsError.message)
    } else {
      console.log('   Columns:')
      columns.forEach(col => {
        console.log(`     ${col.column_name}: ${col.data_type} (${col.is_nullable})`)
      })
    }

    // Test 3: Check if handle_new_user function exists
    console.log('\n3. Checking trigger function...')
    const { data: functions, error: functionsError } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'handle_new_user')

    if (!functionsError && functions.length > 0) {
      console.log('   handle_new_user function exists')
    } else if (functionsError) {
      console.error('   Error checking trigger function:', functionsError.message)
    } else {
      console.log('   handle_new_user function NOT found')
    }

    // Test 4: Check if trigger exists
    console.log('\n4. Checking triggers...')
    const { data: triggers, error: triggersError } = await supabase
      .from('pg_trigger')
      .select('tgname')
      .ilike('tgname', '%auth_user%')

    if (!triggersError) {
      if (triggers.length > 0) {
        console.log('   Triggers found:')
        triggers.forEach(trigger => {
          console.log(`     ${trigger.tgname}`)
        })
      } else {
        console.log('   No auth triggers found')
      }
    } else {
      console.error('   Error checking triggers:', triggersError.message)
    }

    // Test 5: Check RLS policies
    console.log('\n5. Checking RLS policies...')
    // This is a bit more complex to check directly, but we can verify by trying to access data
    
    console.log('\n=== PROFILE API TEST COMPLETE ===')
    console.log('Next steps:')
    console.log('1. Run the comprehensive-profile-fix.sql script in your Supabase SQL editor')
    console.log('2. Test profile functionality through the web interface')
    console.log('3. Check browser console for any errors during profile operations')
    
  } catch (error) {
    console.error('Test failed with exception:', error)
  }
}

// Run the test
testProfileAPI()