import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createLeadsTable() {
  console.log('Creating leads table in Supabase...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Please check your .env file.');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create the leads table using direct SQL query
    const { error } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS public.leads (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          company TEXT,
          email TEXT,
          phone TEXT,
          lead_owner TEXT,
          lead_source TEXT,
          campaign_id BIGINT REFERENCES marketing_campaign(campaign_id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (error) {
      console.error('Error creating leads table:', error.message);
      console.log('\nNote: You may need to create this table manually in the Supabase dashboard.');
      console.log('SQL to create the table:');
      console.log(`
        CREATE TABLE IF NOT EXISTS public.leads (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          company TEXT,
          email TEXT,
          phone TEXT,
          lead_owner TEXT,
          lead_source TEXT,
          campaign_id BIGINT REFERENCES marketing_campaign(campaign_id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      return;
    }
    
    console.log('Leads table created successfully!');
    
    // Insert sample data
    const mockLeads = [
      {
        name: 'Christopher Maclead',
        company: 'Rangoni Of Florence',
        email: 'christopher@example.com',
        phone: '9876543210',
        lead_owner: 'Hari Shankar',
        lead_source: 'Website',
      },
      {
        name: 'Carissa Kidman',
        company: 'Oh My Goodknits Inc',
        email: 'carissa@example.com',
        phone: '9123456780',
        lead_owner: 'Hari Shankar',
        lead_source: 'Referral',
      },
      {
        name: 'James Merced',
        company: 'Kwik Kopy Printing',
        email: 'james@example.com',
        phone: '9988776655',
        lead_owner: 'Hari Shankar',
        lead_source: 'Google Ads',
      },
      {
        name: 'Felix Hirpara',
        company: 'Chapman',
        email: 'felix@example.com',
        phone: '9112233445',
        lead_owner: 'Hari Shankar',
        lead_source: 'LinkedIn',
      }
    ];
    
    const { error: insertError } = await supabase
      .from('leads')
      .insert(mockLeads);
    
    if (insertError) {
      console.error('Error inserting sample data:', insertError.message);
      return;
    }
    
    console.log('Sample data inserted successfully!');
    
  } catch (err) {
    console.error('Exception when creating leads table:', err.message);
    console.log('\nNote: You may need to create this table manually in the Supabase dashboard.');
  }
}

createLeadsTable();