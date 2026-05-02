-- Part 04: CRM Contacts

-- 1. Tables
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    position VARCHAR(150),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- 3. Security Enablement
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Allow authenticated read contacts" ON contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert contacts" ON contacts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update contacts" ON contacts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete contacts" ON contacts FOR DELETE TO authenticated USING (true);
