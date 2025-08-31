-- Comprehensive setup script for contact_submissions table
-- This script will drop existing policies and recreate them properly

-- First, disable RLS temporarily
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated read" ON contact_submissions;

-- Re-enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON contact_submissions
    FOR SELECT TO authenticated USING (true);

-- Grant necessary permissions
GRANT ALL ON contact_submissions TO anon;
GRANT ALL ON contact_submissions TO authenticated;

-- Verify the policies
SELECT * FROM pg_policy WHERE polrelid = 'contact_submissions'::regclass;