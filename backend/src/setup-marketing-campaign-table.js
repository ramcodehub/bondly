import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function setupMarketingCampaignTable() {
  console.log('Setting up marketing campaign table in Supabase...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Please check your .env file.');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First, check if the marketing_campaign table exists
    console.log('Checking if marketing_campaign table exists...');
    
    // Try to query the table to see if it exists
    const { data, error } = await supabase
      .from('marketing_campaign')
      .select('campaign_id')
      .limit(1);
    
    if (error && error.message.includes('relation "marketing_campaign" does not exist')) {
      console.log('marketing_campaign table does not exist. Creating it now...');
      
      // Create the marketing_campaign table
      // Note: In Supabase, we need to use SQL directly for complex table creation
      const createTableSQL = `
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
        
        -- Add indexes
        CREATE INDEX IF NOT EXISTS idx_marketing_campaign_type_status ON public.marketing_campaign(type, status);
        CREATE INDEX IF NOT EXISTS idx_marketing_campaign_created_at ON public.marketing_campaign(created_at);
      `;
      
      // Try to execute the SQL directly
      console.log('Attempting to create marketing_campaign table...');
      
      // For Supabase, we need to execute this in the SQL editor or use a different approach
      // Let's try using the Supabase RPC if available
      try {
        // Try to create the table using raw SQL execution
        const { error: createError } = await supabase.rpc('exec', {
          query: createTableSQL
        });
        
        if (createError) {
          console.error('Error creating marketing_campaign table via RPC:', createError.message);
          console.log('Please create the table manually using the following SQL:');
          console.log(createTableSQL);
        } else {
          console.log('Marketing campaign table created successfully!');
        }
      } catch (rpcError) {
        console.error('RPC execution failed:', rpcError.message);
        console.log('Please create the table manually using the following SQL:');
        console.log(createTableSQL);
      }
    } else if (error) {
      console.error('Error checking table existence:', error.message);
    } else {
      console.log('marketing_campaign table already exists.');
    }
    
    // Now check if the campaign_id column exists in the leads table
    console.log('Checking if campaign_id column exists in leads table...');
    
    // Try to query the campaign_id column
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('campaign_id')
      .limit(1);
    
    if (leadError && leadError.message.includes('column "campaign_id" does not exist')) {
      console.log('campaign_id column does not exist in leads table. Adding it now...');
      
      // Add the campaign_id column to the leads table
      const addColumnSQL = `
        ALTER TABLE public.leads 
        ADD COLUMN IF NOT EXISTS campaign_id BIGINT REFERENCES marketing_campaign(campaign_id) ON DELETE SET NULL;
        
        -- Add index
        CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON public.leads(campaign_id);
      `;
      
      try {
        const { error: alterError } = await supabase.rpc('exec', {
          query: addColumnSQL
        });
        
        if (alterError) {
          console.error('Error adding campaign_id column:', alterError.message);
          console.log('Please add the column manually using the following SQL:');
          console.log(addColumnSQL);
        } else {
          console.log('campaign_id column added to leads table successfully!');
        }
      } catch (alterError) {
        console.error('Error adding campaign_id column:', alterError.message);
        console.log('Please add the column manually using the following SQL:');
        console.log(addColumnSQL);
      }
    } else if (leadError) {
      console.error('Error checking campaign_id column:', leadError.message);
    } else {
      console.log('campaign_id column already exists in leads table.');
    }
    
    console.log('Database setup completed!');
    
  } catch (err) {
    console.error('Exception during database setup:', err.message);
    console.log('Please check your Supabase configuration and try again.');
  }
}

setupMarketingCampaignTable();