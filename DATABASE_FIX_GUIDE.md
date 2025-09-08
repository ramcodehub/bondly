# Database Schema Fix Guide

This guide helps you resolve the database schema issues causing foreign key relationship errors in your dashboard.

## Current Issues

1. **Foreign Key Relationship Errors**:
   - `Could not find a relationship between 'tasks' and 'deals' in the schema cache`
   - `Could not find a relationship between 'contacts' and 'companies' in the schema cache`
   - `column "company_id" does not exist` error

2. **Inconsistent Table Structures**:
   - Multiple versions of similar tables with different column structures
   - Data type mismatches between foreign key relationships

## Step-by-Step Solution

### 1. Diagnose Current State

First, run the diagnostic script to understand your current database structure:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of [check-table-structure.sql](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/check-table-structure.sql)
4. Run the script and review the output

### 2. Apply Minimal Fixes First

Start with the minimal fix script to address the most critical issues:

1. Copy the contents of [minimal-fix.sql](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/minimal-fix.sql)
2. Run it in your Supabase SQL Editor
3. Test your dashboard to see if the errors are resolved

### 3. If Issues Persist, Apply Full Fix

If the minimal fix doesn't resolve all issues, use the full fix script:

1. Copy the contents of [fix-database-schema.sql](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/fix-database-schema.sql)
2. Run it in your Supabase SQL Editor section by section
3. Monitor for any errors and address them as they appear

## Common Issues and Solutions

### 1. Column Does Not Exist Error

**Problem**: `column "company_id" does not exist`
**Cause**: The contacts table doesn't have a [company_id](file://c:\Users\sathi\OneDrive\Desktop\NextGen_AI\Travels\frontend\src\lib\stores\types.ts#L175-L175) column
**Solution**: The fix script will add the missing column and foreign key constraint

### 2. Foreign Key Relationship Errors

**Problem**: `Could not find a relationship between tables`
**Cause**: Foreign key constraints are missing or mismatched
**Solution**: The fix script drops problematic constraints and recreates them properly

### 3. RLS Policy Issues

**Problem**: Permission denied errors
**Cause**: Restrictive Row Level Security policies
**Solution**: The fix script creates permissive policies for testing

## API Route Resilience

The updated API routes now include fallback logic:

1. If a join fails, they fall back to simpler queries
2. Error handling is more detailed
3. Graceful degradation when schema issues occur

## Testing the Fixes

### 1. Verify Database Changes

Run these queries to verify the fixes:

```sql
-- Check that contacts table has company_id
SELECT column_name FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'company_id';

-- Check foreign key constraints
SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'contacts' AND constraint_type = 'FOREIGN KEY';

-- Check RLS policies
SELECT policyname FROM pg_policies WHERE tablename = 'contacts';
```

### 2. Test Dashboard Functionality

1. Reload the dashboard
2. Test CRUD operations for all entities
3. Check that no foreign key errors appear in the console

### 3. Monitor for Errors

Check the browser console and Supabase logs for any remaining errors.

## Preventing Future Issues

### 1. Schema Migration Best Practices

- Always backup data before schema changes
- Test changes in a development environment first
- Use version control for database schema changes
- Document all schema changes

### 2. Consistent Development Process

- Keep frontend and backend in sync
- Use TypeScript interfaces to ensure consistency
- Regularly validate database schema against API routes

### 3. Monitoring and Maintenance

- Regularly check for schema inconsistencies
- Monitor application logs for database errors
- Keep database documentation up to date

## Files Created/Modified

1. `frontend/fix-database-schema.sql` - Full schema fix script
2. `frontend/minimal-fix.sql` - Minimal fix script
3. `frontend/check-table-structure.sql` - Diagnostic script
4. `frontend/src/app/api/deals/route.ts` - Updated with fallback logic
5. `DATABASE_FIX_GUIDE.md` - This guide

## Next Steps

1. Run the diagnostic script to identify exact issues
2. Apply the minimal fixes first
3. If needed, apply the full fix script
4. Test all functionality
5. Monitor for any remaining issues