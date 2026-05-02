import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking if required tables exist...');
  
  // Check contacts table
  const { data: contactsData, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .limit(1);
    
  if (contactsError) {
    console.log('Contacts table error:', contactsError.message);
  } else {
    console.log('Contacts table exists');
  }
  
  // Check contact_lists table
  const { data: listsData, error: listsError } = await supabase
    .from('contact_lists')
    .select('*')
    .limit(1);
    
  if (listsError) {
    console.log('Contact lists table error:', listsError.message);
  } else {
    console.log('Contact lists table exists');
  }
  
  // Check contact_segments table
  const { data: segmentsData, error: segmentsError } = await supabase
    .from('contact_segments')
    .select('*')
    .limit(1);
    
  if (segmentsError) {
    console.log('Contact segments table error:', segmentsError.message);
  } else {
    console.log('Contact segments table exists');
  }
  
  // Check contact_topics table
  const { data: topicsData, error: topicsError } = await supabase
    .from('contact_topics')
    .select('*')
    .limit(1);
    
  if (topicsError) {
    console.log('Contact topics table error:', topicsError.message);
  } else {
    console.log('Contact topics table exists');
  }
  
  // Check lead_qualifications table
  const { data: qualificationsData, error: qualificationsError } = await supabase
    .from('lead_qualifications')
    .select('*')
    .limit(1);
    
  if (qualificationsError) {
    console.log('Lead qualifications table error:', qualificationsError.message);
  } else {
    console.log('Lead qualifications table exists');
  }
}

checkTables();