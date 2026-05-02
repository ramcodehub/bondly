-- Part 11: Public Form Submissions

-- 1. Tables
CREATE TABLE IF NOT EXISTS contact_form_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT,
    company_type VARCHAR(20),
    company_name VARCHAR(150),
    location VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT,
    company_type VARCHAR(20),
    company_name VARCHAR(150),
    location VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Performance
CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_email ON contact_form_submissions(email);

-- 3. Security Enablement
ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Allow public insert on contact_form_submissions" ON contact_form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read on contact_form_submissions" ON contact_form_submissions FOR SELECT TO authenticated USING (true);
