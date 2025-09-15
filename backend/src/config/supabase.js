import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Only throw error if we're not in a test environment
if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Missing Supabase credentials. Please check your .env file.');
  }
}

let supabase;
if (process.env.NODE_ENV === 'test') {
  // In test environment, we'll rely on the mocks in the test files
  supabase = {};
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default supabase;