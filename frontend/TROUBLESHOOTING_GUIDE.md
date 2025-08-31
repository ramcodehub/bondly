# Profile Update Troubleshooting Guide

Based on the error logs you provided, the issue is with authentication in the API routes. The profile is being fetched successfully, but updates are failing with a 500 server error.

## Latest Solution

I've implemented a comprehensive solution with multiple fallbacks to fix the profile update issue:

1. **Primary Approach**: Uses a server-side Supabase client with a service role key
2. **Fallback Approach**: Uses the regular Supabase client if the service role key is not available
3. **Improved Error Handling**: Better error messages and debugging information

## Immediate Steps to Fix the Issue

### 1. Test the Current Setup

Navigate to these test pages to diagnose the issue:

1. `/test-env-api` - Check if environment variables are properly set
2. `/test-client` - Check which Supabase client is being used
3. `/test-api-v3` - Test the new API endpoint

### 2. Add the Service Role Key (Recommended)

For the best solution, add the Supabase service role key to your `.env.local` file:

```
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find this key in your Supabase dashboard:
1. Go to your Supabase project
2. Click on "Project Settings" (gear icon)
3. Click on "API"
4. The service role key is listed under "Service Role Key" (keep this secret!)

### 3. Test the Profile Update

Navigate to `/dashboard/settings/profile` and try updating your profile again. This page now uses the new `/api/profile-v3` endpoint with improved error handling.

## Common Causes and Solutions

### Cause 1: Missing Service Role Key
**Symptoms**: 500 server errors in API routes
**Solution**: 
- Add the `SUPABASE_SERVICE_ROLE_KEY` to your environment variables
- The system will automatically fall back to the anon key if the service role key is not available

### Cause 2: JSON Parsing Errors
**Symptoms**: "JSON.parse: unexpected character" errors
**Solution**:
- The new implementation includes better error handling for JSON parsing
- Check the browser console for more detailed error messages

### Cause 3: Cookie/Session Issues
**Symptoms**: Authentication failures in API routes
**Solution**:
- The new approach extracts the access token directly from cookies
- This is more reliable than relying on the route handler client

## Debugging Steps

### Step 1: Check Environment Variables
1. Navigate to `/test-env-api` to check if your environment variables are set
2. If the service role key is not set, add it to your `.env.local` file
3. Restart your development server after adding the key

### Step 2: Check Supabase Client
1. Navigate to `/test-client` to see which Supabase client is being used
2. The preferred client is "Server (Service Role)" for full access

### Step 3: Test the API Endpoint
1. Navigate to `/test-api-v3`
2. Test both GET and PUT operations
3. Check the response status and data

### Step 4: Check Browser Console and Network Tab
1. Open the browser's developer tools
2. Go to the Network tab
3. Try to update your profile
4. Look for the PUT request to `/api/profile-v3`
5. Check the request headers and response

## Database Verification Queries

Run these queries in your Supabase SQL Editor:

```sql
-- 1. Check profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check if trigger function exists
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- 3. Check if trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- 4. Check your specific profile
SELECT * FROM profiles WHERE id = '8f2809ba-457c-41f7-9805-2d4228a6b5bf';

-- 5. Check RLS policies
SELECT polname, polcmd FROM pg_policy WHERE polrelid = 'profiles'::regclass;
```

## If the Issue Persists

### 1. Update Dependencies
```bash
npm install @supabase/supabase-js@latest @supabase/auth-helpers-nextjs@latest
```

### 2. Restart Development Server
```bash
npm run dev
```

### 3. Clear Browser Cache and Cookies
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Clear site data in browser developer tools

### 4. Check Supabase Dashboard Logs
- Go to your Supabase project
- Check the Authentication logs
- Check the Database logs

## Emergency Fix

If nothing else works, you can manually update your profile through the Supabase SQL Editor:

```sql
UPDATE profiles 
SET 
  full_name = 'Your Name',
  phone = 'Your Phone',
  bio = 'Your Bio',
  location = 'Your Location',
  updated_at = NOW()
WHERE id = '8f2809ba-457c-41f7-9805-2d4228a6b5bf';
```

## Contact Support

If you're still experiencing issues, please provide:
1. Screenshots of the browser console errors
2. Network request/response details for the failed API call
3. Output of the database verification queries
4. Your Supabase project URL (without the key)

This will help us diagnose the specific issue with your setup.