-- Create contact_submissions table for contact form submissions
-- This avoids conflicts with the existing contacts table used for team members

CREATE TABLE IF NOT EXISTS contact_submissions (
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
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert contact form submissions
CREATE POLICY "Allow public insert" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read contact submissions
CREATE POLICY "Allow authenticated read" ON contact_submissions
    FOR SELECT TO authenticated USING (true);

-- Grant necessary permissions
GRANT INSERT ON contact_submissions TO anon;
GRANT SELECT ON contact_submissions TO authenticated;
GRANT ALL ON contact_submissions TO authenticated;

-- Test the table creation
-- INSERT INTO contact_submissions (full_name, email, subject, message, company_type, company_name, location)
-- VALUES 
--     ('John Doe', 'john@example.com', 'Test Subject', 'This is a test message', 'individual', null, 'New York'),
--     ('Acme Corp', 'contact@acme.com', 'Business Inquiry', 'We are interested in your services', 'company', 'Acme Corporation', 'Los Angeles');

-- SELECT * FROM contact_submissions;