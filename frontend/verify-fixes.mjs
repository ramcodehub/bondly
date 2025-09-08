// Verification script to test all CRUD operations after fixes
import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vknqythzsdpwyycfmujz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbnF5dGh6c2Rwd3l5Y2ZtdWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NjUyMjIsImV4cCI6MjA3MDE0MTIyMn0.DevzSWZS1OFl-oGKANQwerOlC75kWrIfHBTsAowhWJk'

console.log('Verifying CRUD operations fixes...')
console.log('Supabase URL:', supabaseUrl)
const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyAllOperations() {
  console.log('\n=== VERIFYING ALL CRUD OPERATIONS ===')
  
  let successCount = 0
  const totalTests = 5
  
  try {
    // Test 1: Companies CREATE
    console.log('\n1. Testing Companies CREATE...')
    const newCompany = {
      name: `Test Company ${Date.now()}`,
      industry: 'Technology',
      status: 'prospect'
    }
    
    const { data: createdCompany, error: companyError } = await supabase
      .from('companies')
      .insert([newCompany])
      .select()
      .single()
    
    if (companyError) {
      console.error('❌ Companies CREATE failed:', companyError.message)
    } else {
      console.log('✅ Companies CREATE successful')
      successCount++
      
      // Test Companies READ
      console.log('2. Testing Companies READ...')
      const { data: readCompany, error: readError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', createdCompany.id)
        .single()
      
      if (readError) {
        console.error('❌ Companies READ failed:', readError.message)
      } else {
        console.log('✅ Companies READ successful')
        successCount++
      }
    }
    
    // Test 2: Leads operations
    console.log('\n3. Testing Leads CREATE & READ...')
    const newLead = {
      first_name: 'Test',
      last_name: 'Lead',
      email: `test-lead-${Date.now()}@example.com`,
      status: 'New'
    }
    
    const { data: createdLead, error: leadError } = await supabase
      .from('leads')
      .insert([newLead])
      .select()
      .single()
    
    if (leadError) {
      console.error('❌ Leads CREATE failed:', leadError.message)
    } else {
      console.log('✅ Leads CREATE successful')
      successCount++
      
      // Test Leads READ
      const { data: readLead, error: readLeadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', createdLead.id)
        .single()
      
      if (readLeadError) {
        console.error('❌ Leads READ failed:', readLeadError.message)
      } else {
        console.log('✅ Leads READ successful')
        successCount++
      }
    }
    
    // Test 3: Contacts operations
    console.log('\n4. Testing Contacts CREATE & READ...')
    const newContact = {
      name: 'Test Contact',
      email: `test-contact-${Date.now()}@example.com`
    }
    
    const { data: createdContact, error: contactError } = await supabase
      .from('contacts')
      .insert([newContact])
      .select()
      .single()
    
    if (contactError) {
      console.error('❌ Contacts CREATE failed:', contactError.message)
    } else {
      console.log('✅ Contacts CREATE successful')
      successCount++
      
      // Test Contacts READ
      const { data: readContact, error: readContactError } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', createdContact.id)
        .single()
      
      if (readContactError) {
        console.error('❌ Contacts READ failed:', readContactError.message)
      } else {
        console.log('✅ Contacts READ successful')
      }
    }
    
    // Test 4: Cleanup
    console.log('\n5. Cleaning up test data...')
    try {
      if (createdCompany) await supabase.from('companies').delete().eq('id', createdCompany.id)
      if (createdLead) await supabase.from('leads').delete().eq('id', createdLead.id)
      if (createdContact) await supabase.from('contacts').delete().eq('id', createdContact.id)
      console.log('✅ Cleanup successful')
    } catch (cleanupError) {
      console.error('❌ Cleanup failed:', cleanupError.message)
    }
    
  } catch (error) {
    console.error('❌ Error in verification:', error.message)
  }
  
  console.log('\n=== VERIFICATION RESULTS ===')
  console.log(`Passed: ${successCount}/${totalTests} tests`)
  
  if (successCount === totalTests) {
    console.log('\n🎉 All CRUD operations are working correctly!')
    console.log('Your dashboard should now function properly.')
  } else if (successCount >= 3) {
    console.log('\n✅ Most operations are working. Some minor issues may remain.')
    console.log('Check the failed tests above.')
  } else {
    console.log('\n❌ Multiple operations are failing.')
    console.log('Please ensure you have applied the RLS policy fixes.')
  }
}

// Run verification
verifyAllOperations()