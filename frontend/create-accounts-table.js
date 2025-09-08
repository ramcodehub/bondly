import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Set' : '✗ Missing')
  process.exit(1)
}

// Use service key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAccountsTable() {
  console.log('Creating accounts table...')
  
  // Since we can't run DDL commands through the API, we'll create the table
  // by inserting sample data which will automatically create the table
  // if it doesn't exist (with proper RLS setup)
  
  const sampleAccounts = [
    {
      account_name: 'Adventure Tours Inc',
      industry: 'Travel',
      website: 'https://adventure-tours.com',
      contact_email: 'contact@adventure-tours.com',
      logo_url: 'https://example.com/logo1.png'
    },
    {
      account_name: 'Global Getaways',
      industry: 'Hospitality',
      website: 'https://globalgetaways.com',
      contact_email: 'info@globalgetaways.com',
      logo_url: 'https://example.com/logo2.png'
    }
  ]
  
  // Try to insert sample accounts
  const { data, error } = await supabase
    .from('accounts')
    .insert(sampleAccounts)
    .select()
  
  if (error) {
    console.error('❌ Error creating accounts:', error)
    console.log('This is expected if the table structure is different or RLS policies prevent creation')
    return false
  }
  
  console.log('✅ Accounts created successfully')
  console.log('Created accounts:', data)
  return true
}

async function checkAccountsTable() {
  console.log('\nChecking if accounts table exists...')
  
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Accounts table does not exist or is not accessible:', error)
      return false
    }
    
    console.log('✅ Accounts table exists and is accessible')
    console.log('Sample account:', data[0])
    return true
  } catch (error) {
    console.error('❌ Error checking accounts table:', error)
    return false
  }
}

async function main() {
  console.log('Starting accounts table creation...\n')
  
  // First check if table exists
  const exists = await checkAccountsTable()
  
  if (!exists) {
    console.log('\nAttempting to create accounts table...')
    const success = await createAccountsTable()
    
    if (success) {
      console.log('\n✅ Accounts table creation completed successfully.')
    } else {
      console.log('\n❌ Accounts table creation failed.')
      console.log('\nYou need to manually create the accounts table in Supabase.')
      console.log('Use the SQL commands from fix-deals-table.js in the Supabase SQL editor.')
    }
  } else {
    console.log('\n✅ Accounts table already exists.')
  }
}

main()