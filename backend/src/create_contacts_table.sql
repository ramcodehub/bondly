-- Create contacts table for contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT,
    company_type VARCHAR(20),  -- 'individual' or 'company'
    company_name VARCHAR(150),  -- company name if company_type is 'company'
    location VARCHAR(150),      -- user's location
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow public to insert contact form submissions
CREATE POLICY "Allow public insert" ON contacts
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read contact submissions
CREATE POLICY "Allow authenticated read" ON contacts
    FOR SELECT TO authenticated USING (true);

-- Grant necessary permissions
GRANT INSERT ON contacts TO anon;
GRANT SELECT ON contacts TO authenticated;