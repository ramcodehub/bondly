-- Part 05: Sales and Marketing (Campaigns and Leads)

-- 1. Tables
CREATE TABLE IF NOT EXISTS marketing_campaign (
    campaign_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT,
    campaign_id UUID REFERENCES marketing_campaign(campaign_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);

-- 3. Security Enablement
ALTER TABLE marketing_campaign ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Allow authenticated full access to campaigns" ON marketing_campaign FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to leads" ON leads FOR ALL TO authenticated USING (true);
