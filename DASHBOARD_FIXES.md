# Dashboard Issues Fix Guide

This document provides a comprehensive guide to fix all the issues identified in your dashboard.

## Issues Identified

1. **Foreign Key Relationship Errors**:
   - `Could not find a relationship between 'tasks' and 'deals' in the schema cache`
   - `Could not find a relationship between 'contacts' and 'companies' in the schema cache`

2. **API Route Error**:
   - `Error fetching companies: Error: HTTP error! status: 500`

3. **Missing Avatar Image**:
   - `GET https://Bondly.netlify.app/avatars/01.png [HTTP/2 404]`

4. **User Settings Error**:
   - `HTTP 406 Not Acceptable` for user_settings requests

## Fixes Applied

### 1. API Route Fixes

#### Tasks API Route
- Removed problematic join with `deals` table that was causing foreign key errors
- Simplified query to only join with tables that have proper relationships
- Maintained joins with `leads`, `contacts`, and `companies` tables

#### Contacts API Route
- Removed problematic join with `companies` table that was causing foreign key errors
- Simplified query to fetch only contact data

#### Companies API Route
- Already had correct implementation, no changes needed

### 2. Database Schema Fixes

Created a comprehensive SQL script to fix database schema issues:

1. **Fixed ID Type Inconsistencies**:
   - Made all foreign key references use consistent data types
   - Fixed SERIAL vs INTEGER mismatches

2. **Recreated Foreign Key Constraints**:
   - Properly defined foreign key relationships between tables
   - Ensured referential integrity

3. **Fixed RLS Policies**:
   - Made all RLS policies consistent across tables
   - Allowed all operations for authenticated users

### 3. Missing Assets

The avatar image issue (`404 Not Found`) indicates missing static assets. This needs to be addressed by:

1. Adding avatar images to the `public/avatars/` directory
2. Or updating the frontend to use a default avatar when the specific one is not found

## Required Actions

### 1. Run Database Schema Fix Script

Execute the [fix-database-schema.sql](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/fix-database-schema.sql) script in your Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of [fix-database-schema.sql](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/fix-database-schema.sql)
4. Run the script

**Warning**: This script will modify your database schema. Make sure to backup your data before running it.

### 2. Add Missing Avatar Images

Create avatar images or handle missing avatars gracefully:

1. Create a `public/avatars/` directory in your frontend project
2. Add avatar images (01.png, 02.png, etc.) to this directory
3. Or modify the frontend code to use a default avatar when specific ones are not found

### 3. Handle User Settings Error

The `406 Not Acceptable` error for user_settings suggests:

1. The user_settings table may not exist
2. Or the API endpoint is not properly configured

Check if the user_settings table exists and create it if needed:

```sql
CREATE TABLE IF NOT EXISTS user_settings (
  id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view and edit their own settings" 
ON user_settings 
FOR ALL 
TO authenticated 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());
```

## Testing the Fixes

After applying all fixes:

1. **Restart your application** to clear any cached schema information
2. **Test CRUD operations** for all entities (leads, companies, contacts, deals, tasks)
3. **Verify dashboard loads** without foreign key relationship errors
4. **Check that avatar images** load correctly or gracefully fallback

## Expected Outcomes

After applying these fixes:

✅ All CRUD operations should work correctly
✅ Dashboard should load without foreign key errors
✅ API routes should return proper responses (200 OK)
✅ Avatar images should either load or gracefully fallback
✅ User settings should be accessible

## Troubleshooting

If issues persist:

1. **Clear browser cache** and reload the application
2. **Check browser console** for any remaining errors
3. **Verify Supabase connection** and environment variables
4. **Check Supabase logs** for any database errors
5. **Ensure all required tables** exist with correct schemas

## Additional Recommendations

1. **Implement proper error handling** in frontend components to gracefully handle missing assets
2. **Add loading states** for API calls to improve user experience
3. **Implement retry logic** for failed API calls
4. **Add proper logging** for debugging purposes
5. **Consider implementing a fallback mechanism** for avatar images

## Files Modified

1. `frontend/src/app/api/tasks/route.ts` - Fixed foreign key relationship issues
2. `frontend/src/app/api/contacts/route.ts` - Fixed foreign key relationship issues
3. `frontend/fix-database-schema.sql` - Database schema fix script
4. `DASHBOARD_FIXES.md` - This guide

## Next Steps

1. Run the database schema fix script
2. Add missing avatar images or implement fallback mechanism
3. Test all dashboard functionality
4. Monitor for any remaining issues
5. Update documentation as needed