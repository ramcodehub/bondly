-- Create deals table with proper relationships
CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) DEFAULT 0,
  stage VARCHAR(50) DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  close_date DATE,
  description TEXT,
  
  -- Foreign key relationships (matching existing table schemas)
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Additional fields for Bondly functionality
  deal_source VARCHAR(100),
  competitors TEXT[],
  next_step TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_close_date ON deals(close_date);
CREATE INDEX IF NOT EXISTS idx_deals_owner_id ON deals(owner_id);
CREATE INDEX IF NOT EXISTS idx_deals_company_id ON deals(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_deals_updated_at 
    BEFORE UPDATE ON deals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for deals
CREATE POLICY "Users can view all deals" ON deals
    FOR SELECT USING (true);

CREATE POLICY "Users can insert deals" ON deals
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update deals" ON deals
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete deals" ON deals
    FOR DELETE USING (true);

-- Insert sample data
INSERT INTO deals (name, amount, stage, probability, close_date, description, deal_source) VALUES
('Website Redesign Project', 25000.00, 'proposal', 75, '2024-07-15', 'Complete website redesign with modern UI/UX', 'Referral'),
('Mobile App Development', 40000.00, 'negotiation', 60, '2024-08-01', 'Native mobile app for iOS and Android', 'Website'),
('Cloud Migration Services', 120000.00, 'qualified', 40, '2024-09-10', 'Migration of legacy systems to cloud infrastructure', 'Trade Show'),
('E-commerce Platform', 75000.00, 'proposal', 80, '2024-07-30', 'Custom e-commerce solution with payment integration', 'Cold Call'),
('Digital Marketing Campaign', 15000.00, 'lead', 20, '2024-06-20', 'Comprehensive digital marketing strategy', 'Social Media')
ON CONFLICT DO NOTHING;