// Comprehensive test script for all CRUD operations
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓ Set' : '✗ Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabaseConnection() {
  console.log('=== TESTING DATABASE CONNECTION ===')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('leads')
      .select('count()')
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed with error:', error.message)
    return false
  }
}

async function testLeadsCRUD() {
  console.log('\n=== TESTING LEADS CRUD OPERATIONS ===')
  
  try {
    // 1. CREATE - Insert a new lead
    console.log('\n1. Testing CREATE operation...')
    const newLead = {
      first_name: 'Test',
      last_name: 'User',
      email: `test${Date.now()}@example.com`,
      phone: '123-456-7890',
      company: 'Test Company',
      status: 'New'
    }
    
    const { data: createdLead, error: createError } = await supabase
      .from('leads')
      .insert([newLead])
      .select()
      .single()
    
    if (createError) {
      console.error('❌ CREATE failed:', createError.message)
      console.log('Error code:', createError.code)
      return false
    }
    
    console.log('✅ CREATE successful')
    console.log('   Created lead ID:', createdLead.id)
    
    // 2. READ - Fetch the created lead
    console.log('\n2. Testing READ operation...')
    const { data: fetchedLead, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', createdLead.id)
      .single()
    
    if (fetchError) {
      console.error('❌ READ failed:', fetchError.message)
      return false
    }
    
    console.log('✅ READ successful')
    console.log('   Fetched lead:', fetchedLead.first_name, fetchedLead.last_name)
    
    // 3. UPDATE - Update the lead
    console.log('\n3. Testing UPDATE operation...')
    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update({ status: 'Contacted', phone: '098-765-4321' })
      .eq('id', createdLead.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('❌ UPDATE failed:', updateError.message)
      return false
    }
    
    console.log('✅ UPDATE successful')
    console.log('   Updated lead status:', updatedLead.status)
    console.log('   Updated lead phone:', updatedLead.phone)
    
    // 4. DELETE - Delete the lead
    console.log('\n4. Testing DELETE operation...')
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', createdLead.id)
    
    if (deleteError) {
      console.error('❌ DELETE failed:', deleteError.message)
      return false
    }
    
    console.log('✅ DELETE successful')
    
    return true
  } catch (error) {
    console.error('❌ Error in leads CRUD operations:', error.message)
    return false
  }
}

async function testDealsCRUD() {
  console.log('\n=== TESTING DEALS CRUD OPERATIONS ===')
  
  try {
    // 1. CREATE - Insert a new deal
    console.log('\n1. Testing CREATE operation...')
    const newDeal = {
      name: `Test Deal ${Date.now()}`,
      amount: 10000,
      stage: 'lead',
      probability: 20,
      description: 'Test deal for CRUD operations'
    }
    
    const { data: createdDeal, error: createError } = await supabase
      .from('deals')
      .insert([newDeal])
      .select()
      .single()
    
    if (createError) {
      console.error('❌ CREATE failed:', createError.message)
      console.log('Error code:', createError.code)
      return false
    }
    
    console.log('✅ CREATE successful')
    console.log('   Created deal ID:', createdDeal.id)
    
    // 2. READ - Fetch the created deal
    console.log('\n2. Testing READ operation...')
    const { data: fetchedDeal, error: fetchError } = await supabase
      .from('deals')
      .select('*')
      .eq('id', createdDeal.id)
      .single()
    
    if (fetchError) {
      console.error('❌ READ failed:', fetchError.message)
      return false
    }
    
    console.log('✅ READ successful')
    console.log('   Fetched deal:', fetchedDeal.name)
    
    // 3. UPDATE - Update the deal
    console.log('\n3. Testing UPDATE operation...')
    const { data: updatedDeal, error: updateError } = await supabase
      .from('deals')
      .update({ stage: 'qualified', probability: 50 })
      .eq('id', createdDeal.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('❌ UPDATE failed:', updateError.message)
      return false
    }
    
    console.log('✅ UPDATE successful')
    console.log('   Updated deal stage:', updatedDeal.stage)
    console.log('   Updated deal probability:', updatedDeal.probability)
    
    // 4. DELETE - Delete the deal
    console.log('\n4. Testing DELETE operation...')
    const { error: deleteError } = await supabase
      .from('deals')
      .delete()
      .eq('id', createdDeal.id)
    
    if (deleteError) {
      console.error('❌ DELETE failed:', deleteError.message)
      return false
    }
    
    console.log('✅ DELETE successful')
    
    return true
  } catch (error) {
    console.error('❌ Error in deals CRUD operations:', error.message)
    return false
  }
}

async function testCompaniesCRUD() {
  console.log('\n=== TESTING COMPANIES CRUD OPERATIONS ===')
  
  try {
    // 1. CREATE - Insert a new company
    console.log('\n1. Testing CREATE operation...')
    const newCompany = {
      name: `Test Company ${Date.now()}`,
      industry: 'Technology',
      status: 'prospect',
      website: 'https://testcompany.com'
    }
    
    const { data: createdCompany, error: createError } = await supabase
      .from('companies')
      .insert([newCompany])
      .select()
      .single()
    
    if (createError) {
      console.error('❌ CREATE failed:', createError.message)
      console.log('Error code:', createError.code)
      return false
    }
    
    console.log('✅ CREATE successful')
    console.log('   Created company ID:', createdCompany.id)
    
    // 2. READ - Fetch the created company
    console.log('\n2. Testing READ operation...')
    const { data: fetchedCompany, error: fetchError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', createdCompany.id)
      .single()
    
    if (fetchError) {
      console.error('❌ READ failed:', fetchError.message)
      return false
    }
    
    console.log('✅ READ successful')
    console.log('   Fetched company:', fetchedCompany.name)
    
    // 3. UPDATE - Update the company
    console.log('\n3. Testing UPDATE operation...')
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({ status: 'active', phone: '123-456-7890' })
      .eq('id', createdCompany.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('❌ UPDATE failed:', updateError.message)
      return false
    }
    
    console.log('✅ UPDATE successful')
    console.log('   Updated company status:', updatedCompany.status)
    
    // 4. DELETE - Delete the company
    console.log('\n4. Testing DELETE operation...')
    const { error: deleteError } = await supabase
      .from('companies')
      .delete()
      .eq('id', createdCompany.id)
    
    if (deleteError) {
      console.error('❌ DELETE failed:', deleteError.message)
      return false
    }
    
    console.log('✅ DELETE successful')
    
    return true
  } catch (error) {
    console.error('❌ Error in companies CRUD operations:', error.message)
    return false
  }
}

async function runAllTests() {
  console.log('Starting comprehensive CRUD operations test...\n')
  
  // Test database connection first
  const connectionSuccess = await testDatabaseConnection()
  if (!connectionSuccess) {
    console.log('\n❌ Database connection failed. Cannot proceed with CRUD tests.')
    process.exit(1)
  }
  
  // Test each CRUD operation
  const leadsSuccess = await testLeadsCRUD()
  const dealsSuccess = await testDealsCRUD()
  const companiesSuccess = await testCompaniesCRUD()
  
  console.log('\n=== TEST RESULTS ===')
  console.log('Leads CRUD operations:', leadsSuccess ? '✅ PASS' : '❌ FAIL')
  console.log('Deals CRUD operations:', dealsSuccess ? '✅ PASS' : '❌ FAIL')
  console.log('Companies CRUD operations:', companiesSuccess ? '✅ PASS' : '❌ FAIL')
  
  if (leadsSuccess && dealsSuccess && companiesSuccess) {
    console.log('\n🎉 All CRUD operations are working correctly!')
    process.exit(0)
  } else {
    console.log('\n❌ Some CRUD operations are failing. Check the errors above.')
    process.exit(1)
  }
}

// Run the tests
runAllTests()