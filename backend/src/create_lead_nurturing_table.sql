-- Create lead_nurturing table for Phase 1 Lead Enhancements
CREATE TABLE IF NOT EXISTS public.lead_nurturing (
  id SERIAL PRIMARY KEY,
  lead_id INT REFERENCES leads(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- e.g., 'email', 'call', 'follow-up'
  action_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  status TEXT DEFAULT 'pending'
);

-- Add score column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;

-- Add source column to leads table (if not already exists)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lead_nurturing_lead_id ON lead_nurturing(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_nurturing_action_type ON lead_nurturing(action_type);
CREATE INDEX IF NOT EXISTS idx_lead_nurturing_status ON lead_nurturing(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);