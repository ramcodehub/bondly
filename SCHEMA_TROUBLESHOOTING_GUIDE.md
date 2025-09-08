# Database Schema Troubleshooting Guide

This guide helps you diagnose and fix the database schema issues causing foreign key relationship errors in your dashboard.

## Current Issues

1. **Foreign Key Relationship Errors**:
   - `Could not find a relationship between 'tasks' and 'deals' in the schema cache`
   - `Could not find a relationship between 'contacts' and 'companies' in the schema cache`

2. **Inconsistent Table Structures**:
   - Multiple versions of similar tables with different column structures
   - Data type mismatches between foreign key relationships

## Diagnostic Steps

### 1. Run the Diagnostic Script

Execute [diagnose-schema-issues.sql](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/diagnose-schema-issues.sql) in your Supabase SQL Editor to identify the exact issues:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of [diagnose-schema-issues.sql](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/diagnose-schema-issues.sql)
4. Run each section separately to see the results

### 2. Analyze the Results

Look for:
- Column data types that don't match between foreign key relationships
- Missing foreign key constraints
- Inconsistent table structures

## Safe Fix Approach

Instead of dropping and recreating tables (which causes data loss), use this safer approach:

### 1. Fix API Routes First

The API routes have been updated to handle schema inconsistencies gracefully:

- [tasks/route.ts](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/src/app/api/tasks/route.ts) - Now falls back to simple queries when joins fail
- [contacts/route.ts](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/src/app/api/contacts/route.ts) - Now handles both table structures

### 2. Gradual Schema Fixes

If you need to fix the schema, do it gradually:

1. **Add missing columns** without dropping tables
2. **Migrate data** from old columns to new ones
3. **Update foreign key constraints** one at a time
4. **Test each change** before proceeding

### 3. Run the Safe Fix Script

Execute [fix-database-schema.sql](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/fix-database-schema.sql) in your Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of [fix-database-schema.sql](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/fix-database-schema.sql)
4. Run the script section by section

## Common Issues and Solutions

### 1. Data Type Mismatches

**Problem**: Foreign key column has different data type than referenced column
**Solution**: 
```sql
-- Check current types
SELECT data_type FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'id';
SELECT data_type FROM information_schema.columns WHERE table_name = 'deals' AND column_name = 'lead_id';

-- Fix by converting data type
ALTER TABLE deals ALTER COLUMN lead_id TYPE INTEGER USING lead_id::INTEGER;
```

### 2. Missing Foreign Key Constraints

**Problem**: Foreign key relationships not properly defined
**Solution**:
```sql
-- Add foreign key constraint
ALTER TABLE deals 
ADD CONSTRAINT deals_lead_id_fkey 
FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL;
```

### 3. Inconsistent Table Structures

**Problem**: Multiple versions of similar tables
**Solution**: 
1. Identify which table structure is being used by the application
2. Migrate data to the correct structure
3. Update API routes to match

## Testing the Fixes

### 1. Verify API Routes

Test each API route individually:
```bash
# Test tasks API
curl -X GET "http://localhost:3000/api/tasks"

# Test contacts API
curl -X GET "http://localhost:3000/api/contacts"

# Test companies API
curl -X GET "http://localhost:3000/api/companies"
```

### 2. Check Dashboard Functionality

1. Reload the dashboard
2. Verify that all CRUD operations work
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

## Files Modified

1. `frontend/fix-database-schema.sql` - Safe schema fix script
2. `frontend/diagnose-schema-issues.sql` - Diagnostic script
3. `frontend/src/app/api/tasks/route.ts` - Updated with fallback logic
4. `frontend/src/app/api/contacts/route.ts` - Updated with dual structure support
5. `SCHEMA_TROUBLESHOOTING_GUIDE.md` - This guide

## Next Steps

1. Run the diagnostic script to identify exact issues
2. Apply the safe fixes to API routes
3. Gradually fix schema issues if needed
4. Test all functionality
5. Monitor for any remaining issues