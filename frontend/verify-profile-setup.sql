-- =============================
-- Verification script for profile setup
-- =============================

-- 1. Check if profiles table exists with correct schema
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check if profiles table has RLS enabled
SELECT 
  tablename AS table_name,
  relrowsecurity AS rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- 3. Check if handle_new_user function exists
SELECT 
  proname AS function_name,
  prosrc AS function_source
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 4. Check if trigger exists
SELECT 
  tgname AS trigger_name,
  tgrelid::regclass AS table_name
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 5. Check if policies exist
SELECT 
  polname AS policy_name,
  polrelid::regclass AS table_name,
  polcmd AS command_type
FROM pg_policy 
WHERE polrelid = 'profiles'::regclass;

-- 6. Check sample data (if any)
SELECT 
  id,
  email,
  full_name,
  role,
  status,
  created_at
FROM profiles 
LIMIT 5;

-- 7. Check if indexes exist
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'profiles';