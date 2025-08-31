# Companies RLS Fix Documentation

## Problem Summary
You are encountering a **Database security policy violation** error when trying to create companies through the form. This is a Supabase Row Level Security (RLS) issue similar to what was previously fixed for the leads table.

## Error Details
**Error Code**: `42501`
**Error Message**: "Database security policy violation" 
**Cause**: Row Level Security (RLS) is enabled on the `companies` table but no policies exist to allow INSERT operations.

## Quick Fix Instructions

### Option 1: Apply RLS Policies (Recommended)
1. Go to your Supabase Dashboard: https://supabase.com
2. Navigate to **"SQL Editor"**
3. Click **"New Query"**
4. Copy and paste the contents of `companies-rls-fix.sql`
5. Click **"Run"** to execute the script

### Option 2: Temporary Fix for Development
If you need a quick fix and are in development mode, you can temporarily disable RLS:

```sql
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
```

**⚠️ Warning**: This removes all security restrictions. Only use this for development!

## What the Fix Does

The RLS fix script creates a comprehensive policy that allows authenticated users to:
- SELECT (read) companies
- INSERT (create) companies  
- UPDATE (modify) companies
- DELETE (remove) companies

This is appropriate for a CRM system where authenticated users need full access to company data.

## Files Modified
- `src/app/api/companies/route.ts` - Enhanced error handling and fallback to admin client
- `src/app/dashboard/companies/company-form.tsx` - Improved user error messages
- `companies-rls-fix.sql` - Database policy solutions (NEW)
- `fix-companies-rls.js` - Helper script with instructions (NEW)

## Verification
After applying the fix:
1. Try creating a company through the form
2. The operation should succeed without RLS errors
3. Check the Supabase logs to confirm the policy is working

## Prevention
- When creating new tables, consider RLS policies from the start
- Document which tables require authentication vs. public access
- Test API endpoints with different permission levels
- Keep RLS fix scripts for common issues

## Related Issues
This is the same type of issue that was previously fixed for the `leads` table. The solution follows the same pattern established in `supabase-rls-fix.sql`.

## Technical Details
The error occurs because:
1. Supabase enables RLS by default on tables
2. RLS blocks all operations unless explicit policies allow them
3. The `companies` table had RLS enabled but no INSERT policies
4. The API tries to insert data but gets blocked by the security policy

The fix creates permissive policies for authenticated users while maintaining security boundaries.