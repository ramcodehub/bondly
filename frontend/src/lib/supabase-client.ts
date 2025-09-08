import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Validate environment variables
const validateEnv = () => {
  if (!supabaseUrl) {
    console.error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL')
    return false
  }
  if (!supabaseAnonKey) {
    console.error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return false
  }
  return true
}

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
  if (!validateEnv()) return false
  
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