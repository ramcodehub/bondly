-- Migration script to update contacts table structure
-- This script will migrate the existing contacts table to match the expected structure

-- First, rename the existing table
ALTER TABLE contacts RENAME TO contacts_old;

-- Create the new contacts table with the correct structure
CREATE TABLE contacts (
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

-- Copy data from the old table to the new table (mapping where possible)
INSERT INTO contacts (id, first_name, last_name, email, phone, created_at)
SELECT 
    id,
    SPLIT_PART(full_name, ' ', 1) as first_name,
    SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1) as last_name,
    email,
    phone,
    created_at
FROM contacts_old;

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

-- Drop the old table (uncomment this line when you're sure the migration is successful)
-- DROP TABLE contacts_old;