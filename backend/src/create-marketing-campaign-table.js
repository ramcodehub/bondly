import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createMarketingCampaignTable() {
  console.log('Creating marketing campaign table in Supabase...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Please check your .env file.');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create the marketing_campaign table using direct SQL query
    const { error: tableError } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS public.marketing_campaign (
          campaign_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          campaign_name VARCHAR(80) NOT NULL,
          type VARCHAR(50) NOT NULL CHECK (type IN ('Email', 'Social Media', 'Webinar', 'Event', 'Other')),
          status VARCHAR(50) NOT NULL CHECK (status IN ('Planned', 'In Progress', 'Completed', 'Cancelled')),
          start_date DATE NOT NULL,
          end_date DATE,
          budgeted_cost NUMERIC(18, 0),
          actual_cost NUMERIC(18, 0),
          expected_revenue NUMERIC(18, 0),
          number_of_leads NUMERIC(9, 0) DEFAULT 0,
          number_of_responses NUMERIC(9, 0) DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (tableError) {
      console.error('Error creating marketing_campaign table:', tableError.message);
      return;
    }
    
    console.log('Marketing campaign table created successfully!');
    
    // Create indexes
    const { error: indexError1 } = await supabase.rpc('exec', {
      query: `
        CREATE INDEX IF NOT EXISTS idx_marketing_campaign_type_status 
        ON public.marketing_campaign(type, status);
      `
    });
    
    if (indexError1) {
      console.error('Error creating index on marketing_campaign(type, status):', indexError1.message);
    } else {
      console.log('Index on marketing_campaign(type, status) created successfully!');
    }
    
    // Add campaign_id to leads table
    const { error: alterError } = await supabase.rpc('exec', {
      query: `
        ALTER TABLE public.leads 
        ADD COLUMN IF NOT EXISTS campaign_id BIGINT REFERENCES marketing_campaign(campaign_id) ON DELETE SET NULL;
      `
    });
    
    if (alterError) {
      console.error('Error adding campaign_id to leads table:', alterError.message);
    } else {
      console.log('campaign_id column added to leads table successfully!');
    }
    
    // Create indexes for leads table
    const { error: indexError2 } = await supabase.rpc('exec', {
      query: `
        CREATE INDEX IF NOT EXISTS idx_leads_campaign_id 
        ON public.leads(campaign_id);
      `
    });
    
    if (indexError2) {
      console.error('Error creating index on leads(campaign_id):', indexError2.message);
    } else {
      console.log('Index on leads(campaign_id) created successfully!');
    }
    
    console.log('All database setup completed successfully!');
    
  } catch (err) {
    console.error('Exception when creating marketing campaign table:', err.message);
  }
}

createMarketingCampaignTable();