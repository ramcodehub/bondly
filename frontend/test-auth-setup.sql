-- =============================
-- Test Authentication Setup
-- =============================

-- Check if the profiles table exists with the correct structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if the handle_new_user function exists
SELECT 
  proname AS function_name
FROM pg_proc
WHERE proname = 'handle_new_user';

-- Check if the trigger exists
SELECT 
  tgname AS trigger_name
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- Check if there are any users in auth.users
SELECT 
  id, 
  email, 
  created_at 
FROM auth.users 
LIMIT 3;

-- Check if there are any profiles in the profiles table
SELECT 
  id, 
  email, 
  full_name, 
  created_at 
FROM profiles 
LIMIT 3;

-- Check the relationship between auth.users and profiles
SELECT 
  u.id AS user_id,
  u.email AS user_email,
  p.id AS profile_id,
  p.email AS profile_email,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LIMIT 10;