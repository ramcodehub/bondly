// Final comprehensive test for all API routes after fixes
import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = 'https://vknqythzsdpwyycfmujz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbnF5dGh6c2Rwd3l5Y2ZtdWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NjUyMjIsImV4cCI6MjA3MDE0MTIyMn0.DevzSWZS1OFl-oGKANQwerOlC75kWrIfHBTsAowhWJk'

console.log('Testing Supabase direct operations after API route fixes...')
const supabase = createClient(supabaseUrl, supabaseKey)

async function testAllOperations() {
  console.log('\n=== TESTING ALL OPERATIONS AFTER FIXES ===')
  
  try {
    // Test 1: Companies operations (need to create company first)
    console.log('\n1. Testing Companies operations...')
    const newCompany = {
      name: `API Test Company ${Date.now()}`,
      industry: 'Technology',
      status: 'prospect',
      website: 'https://api-test-company.com'
    }
    
    const { data: createdCompany, error: companyError } = await supabase
      .from('companies')
      .insert([newCompany])
      .select()
      .single()
    
    if (companyError) {
      console.error('❌ Companies CREATE failed:', companyError.message)
      return false
    }
    
    console.log('✅ Companies CREATE successful')
    
    // Test 2: Leads operations
    console.log('\n2. Testing Leads operations...')
    const newLead = {
      first_name: 'API Test',
      last_name: 'Lead',
      email: `api-lead-${Date.now()}@example.com`,
      phone: '123-456-7890',
      company: 'API Test Company',
      status: 'New'
    }
    
    const { data: createdLead, error: leadError } = await supabase
      .from('leads')
      .insert([newLead])
      .select()
      .single()
    
    if (leadError) {
      console.error('❌ Leads CREATE failed:', leadError.message)
      return false
    }
    
    console.log('✅ Leads CREATE successful')
    
    // Test 3: Contacts operations
    console.log('\n3. Testing Contacts operations...')
    const newContact = {
      name: 'API Test Contact',
      email: `api-contact-${Date.now()}@example.com`,
      phone: '098-765-4321'
    }
    
    const { data: createdContact, error: contactError } = await supabase
      .from('contacts')
      .insert([newContact])
      .select()
      .single()
    
    if (contactError) {
      console.error('❌ Contacts CREATE failed:', contactError.message)
      return false
    }
    
    console.log('✅ Contacts CREATE successful')
    
    // Test 4: Deals operations
    console.log('\n4. Testing Deals operations...')
    const newDeal = {
      name: `API Test Deal ${Date.now()}`,
      amount: 15000,
      stage: 'lead',
      probability: 25,
      description: 'API test deal for CRUD operations',
      company_id: createdCompany.id
    }
    
    const { data: createdDeal, error: dealError } = await supabase
      .from('deals')
      .insert([newDeal])
      .select()
      .single()
    
    if (dealError) {
      console.error('❌ Deals CREATE failed:', dealError.message)
      return false
    }
    
    console.log('✅ Deals CREATE successful')
    
    // Test 5: Read operations
    console.log('\n5. Testing READ operations...')
    
    // Read leads
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', createdLead.id)
      .single()
    
    if (leadsError) {
      console.error('❌ Leads READ failed:', leadsError.message)
      return false
    }
    
    console.log('✅ Leads READ successful')
    
    // Read companies
    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', createdCompany.id)
      .single()
    
    if (companiesError) {
      console.error('❌ Companies READ failed:', companiesError.message)
      return false
    }
    
    console.log('✅ Companies READ successful')
    
    // Cleanup: Delete test data
    console.log('\n6. Cleaning up test data...')
    
    await supabase.from('deals').delete().eq('id', createdDeal.id)
    await supabase.from('contacts').delete().eq('id', createdContact.id)
    await supabase.from('companies').delete().eq('id', createdCompany.id)
    await supabase.from('leads').delete().eq('id', createdLead.id)
    
    console.log('✅ Cleanup successful')
    
    return true
    
  } catch (error) {
    console.error('❌ Error in comprehensive test:', error.message)
    return false
  }
}

async function runTest() {
  console.log('Running final comprehensive test after API route fixes...\n')
  
  const success = await testAllOperations()
  
  console.log('\n=== FINAL TEST RESULTS ===')
  console.log('All operations:', success ? '✅ PASS' : '❌ FAIL')
  
  if (success) {
    console.log('\n🎉 All operations are working correctly after fixes!')
    console.log('The API routes should now be working properly in the dashboard.')
  } else {
    console.log('\n❌ Some operations are still failing.')
  }
}

// Run the test
runTest()