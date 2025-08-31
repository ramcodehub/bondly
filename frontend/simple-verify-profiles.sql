-- =============================
-- Simple verification script for profile setup
-- =============================

-- 1. Check if profiles table exists with correct schema
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check if handle_new_user function exists
SELECT 
  proname AS function_name
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 3. Check if trigger exists
SELECT 
  tgname AS trigger_name
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 4. Check sample data (if any)
SELECT 
  id,
  email,
  full_name,
  role,
  status
FROM profiles 
LIMIT 3;

-- 5. Count total profiles
SELECT COUNT(*) as total_profiles FROM profiles;