-- ==============================================
-- CORRECTED DEALS AND TASKS SETUP FOR SUPABASE
-- ==============================================

-- First, create deals table with proper integer references
CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) DEFAULT 0,
  stage VARCHAR(50) DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  close_date DATE,
  description TEXT,
  
  -- Foreign key relationships (using UUID for leads and companies, INTEGER for contacts)
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Additional fields for CRM functionality
  deal_source VARCHAR(100),
  competitors TEXT[],
  next_step TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_close_date ON deals(close_date);
CREATE INDEX IF NOT EXISTS idx_deals_owner_id ON deals(owner_id);
CREATE INDEX IF NOT EXISTS idx_deals_company_id ON deals(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);

-- Create updated_at trigger for deals
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

-- Enable Row Level Security for deals
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

-- Insert sample deals
INSERT INTO deals (name, amount, stage, probability, close_date, description, deal_source) VALUES
('Website Redesign Project', 25000.00, 'proposal', 75, '2024-07-15', 'Complete website redesign with modern UI/UX', 'Referral'),
('Mobile App Development', 40000.00, 'negotiation', 60, '2024-08-01', 'Native mobile app for iOS and Android', 'Website'),
('Cloud Migration Services', 120000.00, 'qualified', 40, '2024-09-10', 'Migration of legacy systems to cloud infrastructure', 'Trade Show'),
('E-commerce Platform', 75000.00, 'proposal', 80, '2024-07-30', 'Custom e-commerce solution with payment integration', 'Cold Call'),
('Digital Marketing Campaign', 15000.00, 'lead', 20, '2024-06-20', 'Comprehensive digital marketing strategy', 'Social Media')
ON CONFLICT DO NOTHING;

-- ==============================================
-- TASKS TABLE
-- ==============================================

-- Create tasks table with proper integer references
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')),
  
  -- Foreign key relationships (using INTEGER for deals, UUID for leads and companies)
  deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Additional fields
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  tags TEXT[],
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Create updated_at trigger for tasks
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for completed_at
CREATE OR REPLACE FUNCTION update_completed_at_column()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'done' AND OLD.status != 'done' THEN
        NEW.completed_at = NOW();
    ELSIF NEW.status != 'done' AND OLD.status = 'done' THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_completed_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_completed_at_column();

-- Enable Row Level Security for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tasks
CREATE POLICY "Users can view all tasks" ON tasks
    FOR SELECT USING (true);

CREATE POLICY "Users can insert tasks" ON tasks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update tasks" ON tasks
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete tasks" ON tasks
    FOR DELETE USING (true);

-- Insert sample tasks
INSERT INTO tasks (title, description, due_date, priority, status, estimated_hours) VALUES
('Follow up with Acme Inc', 'Call John about the website redesign proposal', '2024-06-10', 'high', 'todo', 0.5),
('Prepare Globex presentation', 'Create slides and demo for mobile app project', '2024-06-11', 'medium', 'in_progress', 4.0),
('Send Initech contract', 'Prepare and send contract for cloud migration', '2024-06-12', 'urgent', 'todo', 1.0),
('Research competitors for E-commerce deal', 'Analyze competitor solutions and pricing', '2024-06-15', 'medium', 'todo', 2.0),
('Schedule demo for Digital Marketing client', 'Set up product demo meeting', '2024-06-08', 'low', 'done', 0.25)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Deals and Tasks tables created successfully!' as status;