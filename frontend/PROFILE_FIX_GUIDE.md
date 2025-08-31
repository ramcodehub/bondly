# Profile Fix Guide

This guide will help you resolve the profile update issues in your application.

## Step 1: Verify Database Schema

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the `verify-current-schema.sql` script to check your current database structure
4. Note any missing columns or incorrect setup

## Step 2: Fix Database Schema

1. In the Supabase SQL Editor, run the `comprehensive-profile-fix.sql` script
2. This will ensure your profiles table has the correct structure and the proper triggers

## Step 3: Test Profile Functionality

1. Navigate to `/debug-profile` in your application
2. This page will run several tests to verify:
   - User session
   - Profile fetching
   - Direct database queries
   - Profile creation/update

## Step 4: Test API Routes

1. Navigate to `/api-test` in your application
2. Test both GET and PUT operations for the profile API

## Step 5: Test Database Directly

1. Navigate to `/test-db` in your application
2. This will verify the database structure and sample data

## Common Issues and Solutions

### Issue: "Failed to update profile" error
**Solution**: 
- Check browser console for detailed error messages
- Verify the profiles table has the correct structure
- Ensure the handle_new_user trigger function exists

### Issue: Profile not being created automatically
**Solution**:
- Verify the on_auth_user_created trigger exists
- Check that the handle_new_user function is properly defined
- Ensure RLS policies are correctly set up

### Issue: Fields not saving
**Solution**:
- Verify all required columns exist in the profiles table
- Check that the API route is correctly handling all fields
- Ensure the frontend is sending all required data

## Debugging Steps

1. **Check Browser Console**: Look for any JavaScript errors or network issues
2. **Check Network Tab**: Verify API requests are being sent and received correctly
3. **Check Supabase Logs**: Look for any database errors in the Supabase dashboard
4. **Test Direct Database Access**: Use the Supabase SQL Editor to manually query and update profiles

## Verification Queries

Run these queries in your Supabase SQL Editor to verify everything is working:

```sql
-- Check profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if trigger function exists
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- Check if trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check sample profile data
SELECT * FROM profiles LIMIT 5;
```

## Next Steps

If you're still experiencing issues after following this guide:

1. Create a new user account and verify if the profile is created automatically
2. Check the Supabase Auth logs for any errors during user creation
3. Verify that your environment variables are correctly set
4. Ensure you're using the latest versions of the Supabase client libraries

## Contact Support

If you continue to experience issues, please provide:
1. Screenshots of any error messages
2. Browser console output
3. Network request/response details
4. Supabase logs for relevant time periods