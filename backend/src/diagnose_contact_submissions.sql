-- Diagnostic script for contact_submissions table
-- Run this to check the current state of the table and policies

-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'contact_submissions';

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contact_submissions'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'contact_submissions';

-- Check existing policies
SELECT polname, polroles, polcmd, polqual, polwithcheck
FROM pg_policy 
WHERE polrelid = 'contact_submissions'::regclass;

-- Check table permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'contact_submissions';

-- Check for any data
SELECT COUNT(*) as row_count FROM contact_submissions;

-- If there are rows, show first 5
SELECT * FROM contact_submissions LIMIT 5;