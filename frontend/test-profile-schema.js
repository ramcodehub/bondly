// Test script to verify profile schema
const { createClient } = require('@supabase/supabase-js')

// Get these from your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProfileSchema() {
  try {
    console.log('=== TESTING PROFILE SCHEMA ===')
    
    // Test 1: Check if profiles table exists and has correct columns
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'profiles')
      .order('ordinal_position')

    if (columnsError) {
      console.error('Error fetching table columns:', columnsError)
    } else {
      console.log('\n=== PROFILES TABLE SCHEMA ===')
      console.log('Columns:')
      columns.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable})`)
      })
    }

    // Test 2: Check if handle_new_user function exists
    const { data: functions, error: functionsError } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'handle_new_user')

    if (!functionsError && functions.length > 0) {
      console.log('\n=== TRIGGER FUNCTION ===')
      console.log('handle_new_user function exists')
    } else if (functionsError) {
      console.error('\nError checking trigger function:', functionsError)
    } else {
      console.log('\n=== TRIGGER FUNCTION ===')
      console.log('handle_new_user function NOT found')
    }

    // Test 3: Check if trigger exists
    const { data: triggers, error: triggersError } = await supabase
      .from('pg_trigger')
      .select('tgname')
      .ilike('tgname', '%auth_user%')

    if (!triggersError) {
      console.log('\n=== TRIGGERS ===')
      if (triggers.length > 0) {
        triggers.forEach(trigger => {
          console.log(`  ${trigger.tgname}`)
        })
      } else {
        console.log('  No auth triggers found')
      }
    } else {
      console.error('\nError checking triggers:', triggersError)
    }

    // Test 4: Check sample data (if any)
    const { data: sampleData, error: sampleError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, status, created_at')
      .limit(3)

    if (!sampleError) {
      console.log('\n=== SAMPLE DATA ===')
      if (sampleData.length > 0) {
        sampleData.forEach(profile => {
          console.log(`  ${profile.email} (${profile.full_name || 'No name'})`)
        })
      } else {
        console.log('  No profile data found')
      }
    } else {
      console.error('\nError fetching sample data:', sampleError)
    }

    console.log('\n=== TEST COMPLETE ===')
  } catch (error) {
    console.error('Test failed with exception:', error)
  }
}

// Run the test
testProfileSchema()