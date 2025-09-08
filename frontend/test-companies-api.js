// Test script to verify companies API functionality
const { createClient } = require('@supabase/supabase-js')

// Get these from your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCompaniesAPI() {
  try {
    console.log('=== TESTING COMPANIES API ===')
    
    // Test 1: Check if we can connect to Supabase
    console.log('\n1. Testing Supabase connection...')
    const { data: testConnection, error: connectionError } = await supabase
      .from('companies')
      .select('id')
      .limit(1)
      
    if (connectionError && connectionError.code !== '42P01') { // 42P01 = table doesn't exist
      console.error('   Connection failed:', connectionError.message)
      return
    }
    console.log('   Connection successful')
    
    // Test 2: Check if companies table exists
    console.log('\n2. Checking companies table...')
    if (connectionError && connectionError.code === '42P01') {
      console.log('   ❌ Companies table does not exist')
      console.log('   Solution: Run companies-table-schema.sql in your Supabase SQL Editor')
      return
    }
    
    console.log('   ✅ Companies table exists')
    
    // Test 3: Try to fetch companies
    console.log('\n3. Fetching companies...')
    const { data: companies, error: fetchError } = await supabase
      .from('companies')
      .select('*')
      .limit(5)
    
    if (fetchError) {
      console.log('   ❌ Error fetching companies:', fetchError.message)
      
      // Check for RLS error
      if (fetchError.code === '42501') {
        console.log('   This is likely an RLS (Row Level Security) issue')
        console.log('   Solution: Run companies-rls-fix.sql in your Supabase SQL Editor')
      }
      return
    }
    
    console.log(`   ✅ Successfully fetched ${companies.length} companies`)
    
    // Test 4: Try to create a company
    console.log('\n4. Testing company creation...')
    const testCompany = {
      name: 'Test Company ' + Date.now(),
      industry: 'Technology',
      status: 'prospect'
    }
    
    const { data: createdCompany, error: createError } = await supabase
      .from('companies')
      .insert([testCompany])
      .select()
      .single()
    
    if (createError) {
      console.log('   ❌ Error creating company:', createError.message)
      
      // Check for RLS error
      if (createError.code === '42501') {
        console.log('   This is likely an RLS (Row Level Security) issue')
        console.log('   Solution: Run companies-rls-fix.sql in your Supabase SQL Editor')
      }
      return
    }
    
    console.log('   ✅ Successfully created test company:', createdCompany.name)
    
    // Clean up - delete the test company
    console.log('\n5. Cleaning up test data...')
    const { error: deleteError } = await supabase
      .from('companies')
      .delete()
      .eq('id', createdCompany.id)
    
    if (deleteError) {
      console.log('   Warning: Could not delete test company:', deleteError.message)
    } else {
      console.log('   ✅ Test company deleted successfully')
    }
    
    console.log('\n🎉 All tests passed! Companies API is working correctly.')
    
  } catch (error) {
    console.error('❌ Error testing companies API:', error.message)
    process.exit(1)
  }
}

// Run the test
testCompaniesAPI()