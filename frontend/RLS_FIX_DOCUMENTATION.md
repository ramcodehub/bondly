# Lead Creation 400 Bad Request Fix - RLS Issue Resolution

## Problem Summary
The application was returning a **400 Bad Request** error when trying to create leads through the form. Upon investigation, this was actually a **403 Forbidden** error due to Supabase Row Level Security (RLS) policies blocking the INSERT operation.

## Root Cause
**Error Code**: `42501`
**Error Message**: "new row violates row-level security policy for table 'leads'"

**Explanation**: 
- Supabase has Row Level Security (RLS) enabled on the `leads` table
- No RLS policies exist that allow INSERT operations
- The API was trying to insert data without proper authentication context or permissions

## Error Evolution
1. **Original Error**: 400 Bad Request with generic "Failed to save lead" message
2. **After Investigation**: 403 Forbidden with detailed RLS policy violation message
3. **Improved Error Handling**: Clear error messages explaining the issue and suggesting solutions

## Solutions Implemented

### 1. **Improved API Error Handling** ✅
- Updated `/api/leads/route.ts` to detect RLS policy violations (error code `42501`)
- Provides clear error messages explaining the issue
- Suggests solutions for the database administrator

### 2. **Enhanced Frontend Error Handling** ✅
- Updated `lead-form.tsx` to handle 403 Forbidden responses
- Displays user-friendly error messages for permission issues
- Explains that it might be a database configuration issue

### 3. **Database Solutions** (Choose One)

#### **Option A: Allow Public Insert (Recommended for Bondly)**
```sql
CREATE POLICY "Allow public insert on leads"
ON leads
FOR INSERT
TO public
WITH CHECK (true);
```

#### **Option B: Allow Authenticated Users Only**
```sql
CREATE POLICY "Allow authenticated insert on leads"
ON leads
FOR INSERT
TO authenticated
WITH CHECK (true);
```

#### **Option C: Disable RLS (Development Only)**
```sql
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
```

#### **Option D: Full CRUD for Authenticated Users**
```sql
CREATE POLICY "Allow authenticated all operations"
ON leads
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

## Recommended Action
For a Bondly system, **Option A** or **Option D** is recommended:

- **Option A**: Allows public lead creation (good for lead capture forms on websites)
- **Option D**: Requires authentication but allows full management (good for internal Bondly operations)

## Implementation Steps
1. **Immediate Fix**: Run one of the SQL commands above in your Supabase SQL editor
2. **Test**: Try creating a lead through the form again
3. **Verify**: Check that the lead appears in the database

## Files Modified
- `src/app/api/leads/route.ts` - Enhanced error handling for RLS issues
- `src/app/dashboard/leads/lead-form.tsx` - Improved user error messages
- `supabase-rls-fix.sql` - Database policy solutions

## Prevention
- When creating new tables, consider RLS policies from the start
- Document which tables require authentication vs. public access
- Test API endpoints with different permission levels

## Testing
After applying the database fix:
```bash
# Test with curl (replace with your actual URL)
curl -X POST http://localhost:3000/api/leads \\
  -H "Content-Type: application/json" \\
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com"}'
```

Expected result: 201 Created with lead data returned.