-- Check existing policies on contact_submissions table
SELECT * FROM pg_policy WHERE polrelid = 'contact_submissions'::regclass;

-- Check table permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'contact_submissions';

-- Check if RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'contact_submissions';