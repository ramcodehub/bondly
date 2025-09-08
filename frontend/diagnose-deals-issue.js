import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function diagnoseDealsIssue() {
  console.log('Diagnosing deals realtime subscription issue...\n')
  
  // 1. Check deals table structure
  console.log('1. Checking deals table structure...')
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error accessing deals table:', error)
      return
    }
    
    console.log('✅ Deals table structure:')
    if (data && data.length > 0) {
      const deal = data[0]
      console.log('   Columns:', Object.keys(deal))
      
      // Check for company_id field
      if ('company_id' in deal) {
        console.log('   ✅ company_id field exists')
        console.log('   company_id type:', typeof deal.company_id)
        console.log('   company_id value:', deal.company_id)
      } else {
        console.log('   ❌ company_id field missing')
      }
      
      // Check for account_id field
      if ('account_id' in deal) {
        console.log('   ⚠️  account_id field exists (may be deprecated)')
        console.log('   account_id type:', typeof deal.account_id)
        console.log('   account_id value:', deal.account_id)
      }
    }
  } catch (error) {
    console.error('❌ Error checking deals structure:', error)
  }
  
  // 2. Check if we can query deals with companies join
  console.log('\n2. Testing deals with companies join...')
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*, companies(name, industry)')
      .limit(3)
    
    if (error) {
      console.error('❌ Error joining deals with companies:', error)
    } else {
      console.log('✅ Successfully joined deals with companies')
      if (data && data.length > 0) {
        console.log('   Sample deal with company:', {
          id: data[0].id,
          name: data[0].name,
          company: data[0].companies ? data[0].companies.name : 'No company'
        })
      }
    }
  } catch (error) {
    console.error('❌ Error testing companies join:', error)
  }
  
  // 3. Check if we can query deals with accounts join
  console.log('\n3. Testing deals with accounts join...')
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*, accounts(account_name)')
      .limit(3)
    
    if (error) {
      console.log('   ❌ Error joining deals with accounts:', error.message)
    } else {
      console.log('   ✅ Successfully joined deals with accounts')
    }
  } catch (error) {
    console.log('   ❌ Error testing accounts join:', error.message)
  }
  
  // 4. Check for any existing deals
  console.log('\n4. Checking for existing deals...')
  try {
    const { data, error, count } = await supabase
      .from('deals')
      .select('*', { count: 'exact' })
    
    if (error) {
      console.error('❌ Error counting deals:', error)
    } else {
      console.log(`   Found ${count} deals in the database`)
      if (data && data.length > 0) {
        console.log('   Sample deals:')
        data.slice(0, 3).forEach(deal => {
          console.log(`     - ${deal.name} (${deal.stage}) - $${deal.amount}`)
        })
      }
    }
  } catch (error) {
    console.error('❌ Error checking deals count:', error)
  }
  
  // 5. Test realtime subscription
  console.log('\n5. Testing realtime subscription setup...')
  console.log('   This would normally be tested in a browser environment')
  console.log('   The issue is likely related to the missing accounts table reference')
}

async function main() {
  console.log('Starting deals issue diagnosis...\n')
  await diagnoseDealsIssue()
  console.log('\nDiagnosis completed.')
  console.log('\nRecommended fixes:')
  console.log('1. Update the deals table to reference companies instead of accounts')
  console.log('2. Ensure all foreign key relationships are correct')
  console.log('3. Update the frontend code to use the correct table relationships')
}

main()