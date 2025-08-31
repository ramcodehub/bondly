-- Check if the trigger exists
SELECT tgname, tgrelid::regclass 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Check if the profiles table exists and its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if the handle_new_user function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Check if there are any users in auth.users
SELECT id, email, created_at 
FROM auth.users 
LIMIT 5;

-- Check if there are any profiles in the profiles table
SELECT id, email, full_name, created_at 
FROM profiles 
LIMIT 5;