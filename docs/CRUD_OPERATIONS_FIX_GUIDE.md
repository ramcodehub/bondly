# CRUD Operations Fix Guide

This guide provides step-by-step instructions to fix all CRUD operations in your dashboard.

## Issues Identified

1. **Inconsistent API Route Implementation**: Different API routes were using different authentication patterns
2. **Schema Mismatch**: Contacts table had different structure than expected
3. **RLS (Row Level Security) Policies**: Some tables had restrictive policies preventing operations
4. **Error Handling**: Inconsistent error handling across API routes

## Fixes Applied

### 1. Standardized API Routes

All API routes have been updated to use the same pattern:
- Use `createClient()` from `@/utils/supabase/server` for consistent authentication
- Proper error handling with detailed error messages
- Consistent response format with success flags
- Proper validation of required fields

### 2. Corrected Contacts Table Structure

The contacts table in the database uses:
- `name` field (not `first_name`/`last_name`)
- `email` field
- `role` field
- `phone` field
- `image_url` field

### 3. RLS Policy Fixes Required

You need to run the following SQL script in your Supabase SQL Editor to fix RLS policies:

```sql
-- Fix RLS policies for all tables
-- Run this in your Supabase SQL Editor

-- Contacts table
DROP POLICY IF EXISTS "Allow authenticated insert" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated read" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated update" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated delete" ON contacts;

CREATE POLICY "Allow authenticated insert" ON contacts
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON contacts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update" ON contacts
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON contacts
    FOR DELETE TO authenticated USING (true);

-- Companies table
DROP POLICY IF EXISTS "Allow public read access to companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated insert on companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated update on companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated delete on companies" ON companies;

CREATE POLICY "Allow all operations on companies"
ON companies
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Leads table
DROP POLICY IF EXISTS "Users can view all leads" ON leads;
DROP POLICY IF EXISTS "Users can insert leads" ON leads;
DROP POLICY IF EXISTS "Users can update leads" ON leads;
DROP POLICY IF EXISTS "Users can delete leads" ON leads;

CREATE POLICY "Allow all operations on leads"
ON leads
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Deals table
DROP POLICY IF EXISTS "Users can view all deals" ON deals;
DROP POLICY IF EXISTS "Users can insert deals" ON deals;
DROP POLICY IF EXISTS "Users can update deals" ON deals;
DROP POLICY IF EXISTS "Users can delete deals" ON deals;

CREATE POLICY "Allow all operations on deals"
ON deals
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Tasks table
DROP POLICY IF EXISTS "Users can view all tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks" ON tasks;

CREATE POLICY "Allow all operations on tasks"
ON tasks
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON contacts TO authenticated;
GRANT ALL ON companies TO authenticated;
GRANT ALL ON leads TO authenticated;
GRANT ALL ON deals TO authenticated;
GRANT ALL ON tasks TO authenticated;
```

## Testing the Fixes

After applying the RLS fixes, all CRUD operations should work correctly:

1. **POST operations**: Create new records in all tables
2. **GET operations**: Retrieve records from all tables
3. **PUT operations**: Update existing records
4. **DELETE operations**: Remove records from all tables

## Verification Steps

1. Run the RLS fix script in your Supabase SQL Editor
2. Restart your development server
3. Test each CRUD operation in the dashboard:
   - Create new leads, companies, contacts, deals, and tasks
   - View existing records
   - Update records
   - Delete records

## Additional Notes

- All API routes now have consistent error handling
- Pagination support has been added to GET operations
- Field validation has been improved
- Response formats are now consistent across all API routes

If you continue to experience issues, please check:
1. Environment variables are correctly set
2. Database tables have the correct structure
3. RLS policies have been properly applied
4. Network connectivity to Supabase