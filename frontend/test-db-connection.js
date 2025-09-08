import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  // Test basic connection
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Connection test failed:', error)
      return false
    }
    
    console.log('✅ Successfully connected to Supabase')
    return true
  } catch (error) {
    console.error('Connection test failed with error:', error)
    return false
  }
}

async function checkTables() {
  console.log('\nChecking table structures...')
  
  // Check if deals table exists
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error accessing deals table:', error)
    } else {
      console.log('✅ Deals table exists and is accessible')
    }
  } catch (error) {
    console.error('❌ Error checking deals table:', error)
  }
  
  // Check if companies table exists
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error accessing companies table:', error)
    } else {
      console.log('✅ Companies table exists and is accessible')
    }
  } catch (error) {
    console.error('❌ Error checking companies table:', error)
  }
  
  // Check if accounts table exists
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error accessing accounts table:', error)
    } else {
      console.log('✅ Accounts table exists and is accessible')
    }
  } catch (error) {
    console.error('❌ Error checking accounts table:', error)
  }
}

async function checkDealsStructure() {
  console.log('\nChecking deals table structure...')
  
  try {
    // Try to get table info
    const { data, error } = await supabase
      .from('deals')
      .select('*, companies(name), accounts(account_name)')
      .limit(3)
    
    if (error) {
      console.error('❌ Error querying deals with joins:', error)
    } else {
      console.log('✅ Successfully queried deals with joins')
      console.log('Sample data:', JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('❌ Error checking deals structure:', error)
  }
}

async function main() {
  console.log('Starting database connection test...\n')
  
  const connected = await testConnection()
  if (!connected) {
    console.log('Cannot proceed with table checks due to connection issues')
    process.exit(1)
  }
  
  await checkTables()
  await checkDealsStructure()
  console.log('\nDatabase test completed.')
}

main()