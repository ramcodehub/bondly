-- =============================
-- Verify Current Schema and Data
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

-- 2. Check if handle_new_user function exists and its definition
SELECT 
  proname AS function_name,
  pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p 
JOIN pg_namespace n ON p.pronamespace = n.oid 
WHERE proname = 'handle_new_user';

-- 3. Check if trigger exists
SELECT 
  tgname AS trigger_name,
  tgrelid::regclass AS table_name
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 4. Check RLS policies
SELECT 
  polname AS policy_name,
  polrelid::regclass AS table_name,
  polcmd AS command,
  polqual AS qualifier
FROM pg_policy 
WHERE polrelid = 'profiles'::regclass;

-- 5. Check sample data (if any)
SELECT 
  id,
  email,
  full_name,
  role,
  status,
  created_at,
  updated_at
FROM profiles 
LIMIT 5;

-- 6. Count total profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- 7. Check if current user has a profile
-- Replace 'YOUR_USER_ID' with an actual user ID to test
-- SELECT * FROM profiles WHERE id = 'YOUR_USER_ID';