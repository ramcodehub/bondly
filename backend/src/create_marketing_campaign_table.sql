-- Create marketing_campaign table
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

-- Add index on (type, status) for faster queries
CREATE INDEX IF NOT EXISTS idx_marketing_campaign_type_status ON public.marketing_campaign(type, status);

-- Add campaign_id to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS campaign_id BIGINT REFERENCES marketing_campaign(campaign_id) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON public.leads(campaign_id);