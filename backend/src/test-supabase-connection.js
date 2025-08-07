import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Please check your .env file.');
    return;
  }
  
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey.substring(0, 10) + '...');
  
  try {
    // Method 1: Test using the Supabase client
    console.log('\nMethod 1: Testing with Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test the connection with a health check
    const { data: healthData, error: healthError } = await supabase.rpc('get_service_status');
    
    if (healthError) {
      console.log('Supabase client health check failed:', healthError.message);
    } else {
      console.log('Supabase client health check succeeded:', healthData);
    }
    
    // Method 2: Test using direct REST API call
    console.log('\nMethod 2: Testing with direct REST API...');
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (response.ok) {
        console.log('REST API connection successful!');
        console.log('Status:', response.status);
        
        // Now check if the leads table exists
        console.log('\nChecking for leads table...');
        const leadsResponse = await fetch(`${supabaseUrl}/rest/v1/leads?limit=1`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (leadsResponse.ok) {
          console.log('Leads table exists and is accessible!');
          const leadsData = await leadsResponse.json();
          console.log('Sample lead data:', leadsData);
        } else {
          console.log('Leads table does not exist or is not accessible.');
          console.log('Status:', leadsResponse.status);
          console.log('Response:', await leadsResponse.text());
        }
      } else {
        console.log('REST API connection failed with status:', response.status);
        console.log('Response:', await response.text());
      }
    } catch (fetchError) {
      console.error('Error with direct REST API call:', fetchError.message);
    }
    
  } catch (err) {
    console.error('Exception when connecting to Supabase:', err.message);
  }
}

testSupabaseConnection();