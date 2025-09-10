-- =============================
-- Supabase Bondly Database Setup (with deal_summary_view)
-- =============================

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- 1. Companies
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  industry TEXT,
  size TEXT CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  revenue TEXT,
  website TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect')),
  contacts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Contacts
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  company_id INT REFERENCES companies(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead')),
  last_contact TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Deals
CREATE TABLE deals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0,
  company_id INT REFERENCES companies(id) ON DELETE SET NULL,
  contact_id INT REFERENCES contacts(id) ON DELETE SET NULL,
  stage TEXT DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  close_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tasks
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  assigned_to TEXT,
  deal_id INT REFERENCES deals(id) ON DELETE CASCADE,
  contact_id INT REFERENCES contacts(id) ON DELETE CASCADE,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  plan_name TEXT DEFAULT 'Free',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Payment Methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('card', 'bank_account')),
  last4 TEXT,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  due_date DATE,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================
-- Trigger function for updated_at
-- =============================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_contacts_updated BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_deals_updated BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_subscriptions_updated BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_invoices_updated BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================
-- Sample Data
-- =============================

-- Companies
INSERT INTO companies (name, industry, size, revenue, website, status) VALUES
  ('Tech Corp', 'Technology', '51-200', '$5M', 'techcorp.com', 'active'),
  ('Design Studio', 'Creative', '11-50', '$2M', 'designstudio.com', 'prospect'),
  ('Marketing Inc', 'Marketing', '201-500', '$10M', 'marketinginc.com', 'active')
ON CONFLICT (name) DO NOTHING;

-- Contacts
INSERT INTO contacts (name, email, phone, company_id, status) VALUES
  ('John Doe', 'john@example.com', '123-456-7890', (SELECT id FROM companies WHERE name='Tech Corp'), 'active'),
  ('Jane Smith', 'jane@example.com', '987-654-3210', (SELECT id FROM companies WHERE name='Design Studio'), 'lead'),
  ('Bob Johnson', 'bob@example.com', '555-123-4567', (SELECT id FROM companies WHERE name='Marketing Inc'), 'active')
ON CONFLICT (email) DO NOTHING;

-- Deals
INSERT INTO deals (name, amount, company_id, contact_id, stage, probability, close_date) VALUES
  ('Website Redesign', 25000.00, (SELECT id FROM companies WHERE name='Tech Corp'), (SELECT id FROM contacts WHERE name='John Doe'), 'proposal', 75, '2024-02-15'),
  ('Brand Identity', 15000.00, (SELECT id FROM companies WHERE name='Design Studio'), (SELECT id FROM contacts WHERE name='Jane Smith'), 'qualified', 60, '2024-03-01'),
  ('Digital Campaign', 50000.00, (SELECT id FROM companies WHERE name='Marketing Inc'), (SELECT id FROM contacts WHERE name='Bob Johnson'), 'negotiation', 90, '2024-01-30');

-- Tasks
INSERT INTO tasks (title, description, due_date, priority, status, deal_id, company_id) VALUES
  ('Follow up with Tech Corp', 'Discuss proposal feedback', '2024-01-20', 'high', 'todo', (SELECT id FROM deals WHERE name='Website Redesign'), (SELECT id FROM companies WHERE name='Tech Corp')),
  ('Prepare Design Studio pitch', 'Create presentation materials', '2024-01-25', 'medium', 'in-progress', (SELECT id FROM deals WHERE name='Brand Identity'), (SELECT id FROM companies WHERE name='Design Studio')),
  ('Review Marketing Inc contract', 'Legal review of terms', '2024-01-22', 'urgent', 'todo', (SELECT id FROM deals WHERE name='Digital Campaign'), (SELECT id FROM companies WHERE name='Marketing Inc'));

-- =============================
-- Views
-- =============================

CREATE OR REPLACE VIEW deal_summary_view AS
SELECT 
  d.id AS deal_id,
  d.name AS deal_name,
  d.amount,
  d.stage,
  d.probability,
  d.close_date,
  c.name AS company_name,
  c.industry AS company_industry,
  ct.name AS contact_name,
  ct.email AS contact_email,
  ct.phone AS contact_phone
FROM deals d
LEFT JOIN companies c ON d.company_id = c.id
LEFT JOIN contacts ct ON d.contact_id = ct.id;

-- =============================
-- Enable RLS
-- =============================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
