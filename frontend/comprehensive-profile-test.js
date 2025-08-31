// Comprehensive test script for profile system
const { createClient } = require('@supabase/supabase-js')

// Configuration - Update these with your actual values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY'

console.log('Testing Supabase Profile System')
console.log('==============================')

const supabase = createClient(supabaseUrl, supabaseKey)

async function runComprehensiveTest() {
  try {
    // Test 1: Check database connection
    console.log('\n1. Testing database connection...')
    const { data, error } = await supabase
      .from('profiles')
      .select('count()')
      .limit(1)

    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return
    }
    console.log('✅ Database connection successful')

    // Test 2: Check profiles table schema
    console.log('\n2. Checking profiles table schema...')
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'profiles')
      .order('ordinal_position')

    if (columnsError) {
      console.error('❌ Schema check failed:', columnsError.message)
    } else {
      console.log('✅ Profiles table schema:')
      columns.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type}`)
      })
      
      // Check for required columns
      const requiredColumns = ['id', 'email', 'full_name', 'role', 'status']
      const existingColumns = columns.map(c => c.column_name)
      const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col))
      
      if (missingColumns.length === 0) {
        console.log('✅ All required columns present')
      } else {
        console.log('❌ Missing columns:', missingColumns)
      }
    }

    // Test 3: Check for extended profile columns
    console.log('\n3. Checking extended profile columns...')
    const extendedColumns = ['avatar_url', 'bio', 'phone', 'location']
    const foundExtendedColumns = columns.filter(col => extendedColumns.includes(col.column_name))
    
    if (foundExtendedColumns.length > 0) {
      console.log('✅ Extended profile columns found:')
      foundExtendedColumns.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type}`)
      })
    } else {
      console.log('⚠️  No extended profile columns found')
    }

    // Test 4: Check functions and triggers
    console.log('\n4. Checking functions and triggers...')
    const { data: functions, error: functionsError } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'handle_new_user')

    if (!functionsError && functions.length > 0) {
      console.log('✅ handle_new_user function exists')
    } else {
      console.log('⚠️  handle_new_user function not found')
    }

    const { data: triggers, error: triggersError } = await supabase
      .from('pg_trigger')
      .select('tgname')
      .eq('tgname', 'on_auth_user_created')

    if (!triggersError && triggers.length > 0) {
      console.log('✅ on_auth_user_created trigger exists')
    } else {
      console.log('⚠️  on_auth_user_created trigger not found')
    }

    // Test 5: Check sample data
    console.log('\n5. Checking sample profile data...')
    const { data: sampleProfiles, error: sampleError } = await supabase
      .from('profiles')
      .select('*')
      .limit(3)

    if (!sampleError) {
      console.log(`✅ Found ${sampleProfiles.length} sample profiles`)
      if (sampleProfiles.length > 0) {
        sampleProfiles.forEach((profile, index) => {
          console.log(`   Profile ${index + 1}: ${profile.email} (${profile.full_name || 'No name'})`)
        })
      }
    } else {
      console.log('⚠️  Error fetching sample data:', sampleError.message)
    }

    console.log('\n==============================')
    console.log('Comprehensive test completed!')
    console.log('==============================')

  } catch (error) {
    console.error('Test failed with exception:', error.message)
  }
}

// Run the test
runComprehensiveTest()