import { config } from 'dotenv';
config(); // Load environment variables from .env.local

import { createClient } from '@supabase/supabase-js';

// Use the same environment variables as in the app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test a simple query on the leads table (without the company column)
    const { data, error } = await supabase
      .from('leads')
      .select('id, name, email, phone')
      .limit(1);
    
    if (error) {
      console.error('Error querying leads table:', error);
      return false;
    }
    
    console.log('Successfully connected to Supabase');
    console.log('Sample lead data:', data);
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return false;
  }
}

// Test deals query (without company column in leads)
async function testDealsQuery() {
  try {
    console.log('Testing deals query...');
    
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        leads(name, email, phone),
        contacts(name, email, phone),
        companies(name, industry)
      `)
      .limit(1);
    
    if (error) {
      console.error('Error querying deals table:', error);
      return false;
    }
    
    console.log('Successfully queried deals table');
    console.log('Sample deal data:', data);
    return true;
  } catch (error) {
    console.error('Error querying deals table:', error);
    return false;
  }
}

// Test tasks query (without company column in leads)
async function testTasksQuery() {
  try {
    console.log('Testing tasks query...');
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        deals(name, amount, stage),
        leads(name, email, phone),
        contacts(name, email, phone),
        companies(name, industry)
      `)
      .limit(1);
    
    if (error) {
      console.error('Error querying tasks table:', error);
      return false;
    }
    
    console.log('Successfully queried tasks table');
    console.log('Sample task data:', data);
    return true;
  } catch (error) {
    console.error('Error querying tasks table:', error);
    return false;
  }
}

async function runTests() {
  console.log('Running database fixes verification tests...');
  
  const connectionSuccess = await testConnection();
  if (!connectionSuccess) {
    console.log('❌ Database connection test failed');
    process.exit(1);
  }
  
  const dealsSuccess = await testDealsQuery();
  if (!dealsSuccess) {
    console.log('❌ Deals query test failed');
    process.exit(1);
  }
  
  const tasksSuccess = await testTasksQuery();
  if (!tasksSuccess) {
    console.log('❌ Tasks query test failed');
    process.exit(1);
  }
  
  console.log('✅ All database fixes verification tests passed!');
  console.log('The fixes for the "column leads_1.company does not exist" error are working correctly.');
}

runTests();