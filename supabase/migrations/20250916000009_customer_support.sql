-- Part 09: Customer Support and Success

-- 1. Tables
CREATE TABLE IF NOT EXISTS customer_service (
    id SERIAL PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    stage TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interactions (
    id SERIAL PRIMARY KEY,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 2. Performance
CREATE INDEX IF NOT EXISTS idx_customer_service_company_id ON customer_service(company_id);
CREATE INDEX IF NOT EXISTS idx_interactions_contact_id ON interactions(contact_id);

-- 3. Security Enablement
ALTER TABLE customer_service ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Allow authenticated read on customer_service" ON customer_service FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to interactions" ON interactions FOR ALL TO authenticated USING (true);
