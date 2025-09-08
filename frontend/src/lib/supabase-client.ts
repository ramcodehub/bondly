import { createClient } from '@supabase/supabase-js'

// Validate environment variables first
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please check your deployment settings.')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please check your deployment settings.')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a new Supabase client with schema refresh options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
})

// Test the connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }
    
    console.log('Successfully connected to Supabase')
    return true
  } catch (error) {
    console.error('Supabase connection test failed with error:', error)
    return false
  }
}

// Optional: enable only if you need to verify connection manually in dev
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
//   testConnection()
// }

export default supabase