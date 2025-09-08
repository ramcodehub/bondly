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

async function testDealsSubscription() {
  console.log('Testing deals realtime subscription...\n')
  
  // Test 1: Check companies table
  console.log('1. Testing companies table...')
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Error querying companies:', error)
    } else {
      console.log('✅ Successfully queried companies')
      console.log('   Found', data.length, 'companies')
      if (data.length > 0) {
        console.log('   Sample companies:')
        data.slice(0, 3).forEach(company => {
          console.log('     -', company.name, '(' + company.industry + ')')
        })
      }
    }
  } catch (error) {
    console.error('❌ Error in companies query:', error)
  }
  
  // Test 2: Check if deals have company_id values
  console.log('\n2. Checking deals company_id values...')
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('id, name, company_id')
      .limit(5)
    
    if (error) {
      console.error('❌ Error querying deals company_id:', error)
    } else {
      console.log('✅ Successfully queried deals company_id')
      data.forEach(deal => {
        console.log('   Deal:', deal.name, '- company_id:', deal.company_id || 'NULL')
      })
    }
  } catch (error) {
    console.error('❌ Error in deals company_id query:', error)
  }
  
  // Test 3: Check if we can query deals with companies join
  console.log('\n3. Testing deals with companies join...')
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        companies(name, industry)
      `)
      .limit(3)
    
    if (error) {
      console.error('❌ Error joining deals with companies:', error)
    } else {
      console.log('✅ Successfully joined deals with companies')
      data.forEach(deal => {
        console.log('   Deal:', deal.name, '- company:', deal.companies?.name || 'No company')
      })
    }
  } catch (error) {
    console.error('❌ Error in deals companies join:', error)
  }
  
  // Test 4: Test realtime subscription
  console.log('\n4. Testing realtime subscription...')
  try {
    const channel = supabase.channel('test-deals-changes')
    
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deals'
        },
        (payload) => {
          console.log('✅ Received realtime event:', payload.eventType)
          console.log('   Data:', JSON.stringify(payload.new || payload.old, null, 2))
        }
      )
      .subscribe((status, error) => {
        console.log('   Subscription status:', status)
        if (error) {
          console.error('❌ Subscription error:', error)
        } else if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to deals changes')
        }
      })
    
    // Wait a bit to see if subscription works
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Clean up
    channel.unsubscribe()
    console.log('   Unsubscribed from test channel')
    
  } catch (error) {
    console.error('❌ Error in realtime subscription:', error)
  }
}

async function main() {
  console.log('Starting deals subscription test...\n')
  await testDealsSubscription()
  console.log('\nTest completed.')
}

main()