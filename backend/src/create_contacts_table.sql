-- Create contacts table with proper structure for CRM
CREATE TABLE IF NOT EXISTS contacts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
    position VARCHAR(150),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert contacts
CREATE POLICY "Allow authenticated insert" ON contacts
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to read contacts
CREATE POLICY "Allow authenticated read" ON contacts
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to update contacts
CREATE POLICY "Allow authenticated update" ON contacts
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users to delete contacts
CREATE POLICY "Allow authenticated delete" ON contacts
    FOR DELETE TO authenticated USING (true);

-- Grant necessary permissions
GRANT ALL ON contacts TO authenticated;