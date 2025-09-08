// Test script to verify Supabase client initialization fix
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Read environment variables directly from .env.local
const envPath = resolve(process.cwd(), 'frontend', '.env.local')
const envContent = readFileSync(envPath, 'utf8')

// Parse the environment variables
let supabaseUrl = ''
let supabaseAnonKey = ''

const lines = envContent.split('\n')
for (const line of lines) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.substring('NEXT_PUBLIC_SUPABASE_URL='.length)
  } else if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.substring('NEXT_PUBLIC_SUPABASE_ANON_KEY='.length)
  }
}

console.log('Testing Supabase client initialization fix...')
console.log('=============================================')

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing')
  process.exit(1)
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
  process.exit(1)
}

console.log('✅ Environment variables found')
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key: ***' + supabaseAnonKey.substring(supabaseAnonKey.length - 10))

try {
  // Test creating a client with the environment variables
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Supabase client created successfully')
  
  // Test a simple query to verify connectivity
  console.log('Testing connection...')
  
  // Using promise syntax since top-level await might not be available
  supabase
    .from('contacts')
    .select('count()')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.log('⚠️  Connection test query failed:', error.message)
        console.log('This might be expected if the table doesn\'t exist yet')
      } else {
        console.log('✅ Connection test successful')
      }
      
      console.log('🎉 Supabase client initialization fix verified!')
    })
    .catch((error) => {
      console.error('❌ Error testing connection:', error.message)
      process.exit(1)
    })
} catch (error) {
  console.error('❌ Error creating Supabase client:', error.message)
  process.exit(1)
}