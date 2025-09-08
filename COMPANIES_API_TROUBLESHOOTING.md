# Companies API Troubleshooting Guide

This guide helps you resolve issues with the companies API in your Bondly CRM application.

## Common Issues and Solutions

### 1. 500 Internal Server Error

#### Problem
When accessing `/api/companies`, you receive a 500 Internal Server Error.

#### Possible Causes and Solutions

##### A. Database Table Missing
**Error**: `relation "companies" does not exist`
**Solution**: 
1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Run the `companies-table-schema.sql` script to create the companies table

##### B. RLS (Row Level Security) Policy Violation
**Error**: `permission denied for table companies` or `42501 error`
**Solution**:
1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Run the `companies-rls-fix.sql` script to fix RLS policies

##### C. Environment Variables Not Set
**Error**: `Missing Supabase environment variables`
**Solution**:
1. Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in your frontend environment
2. For Netlify deployment, ensure these are set in the Netlify dashboard under "Site settings" → "Environment variables"

### 2. CORS Issues

#### Problem
Frontend cannot access the backend API due to CORS restrictions.

#### Solution
1. Ensure your Netlify `netlify.toml` file has the correct proxy configuration:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://bondly-0r0c.onrender.com/api/:splat"
     status = 200
   ```
2. Verify that your Render backend allows requests from your Netlify frontend origin

### 3. Authentication Issues

#### Problem
API requests fail due to authentication problems.

#### Solution
1. Ensure users are properly authenticated before making API requests
2. Check that the Supabase session is active
3. Verify that the user has the necessary permissions

## Testing the Companies API

### 1. Direct Database Test
Test your database connection and companies table directly:

```javascript
// test-companies-db.js
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testDatabase() {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Database error:', error)
    } else {
      console.log('Database connection successful')
      console.log('Sample data:', data)
    }
  } catch (error) {
    console.error('Connection error:', error)
  }
}

testDatabase()
```

### 2. API Endpoint Test
Test the API endpoint directly:

```bash
# Test GET request
curl -X GET https://your-netlify-site.netlify.app/api/companies

# Test POST request
curl -X POST https://your-netlify-site.netlify.app/api/companies \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Company","industry":"Technology"}'
```

## Debugging Steps

### 1. Check Browser Console
Look for detailed error messages in the browser's developer console.

### 2. Check Network Tab
Inspect the failed request in the Network tab to see:
- Request headers
- Response status and body
- Timing information

### 3. Check Backend Logs
If you're using Render for backend deployment:
1. Go to your Render dashboard
2. Select your service
3. Check the "Logs" tab for error messages

### 4. Verify Environment Variables
Ensure all required environment variables are set:
- Frontend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Backend: `SUPABASE_URL`, `SUPABASE_KEY`

## Database Schema Verification

### 1. Check Companies Table
Run this query in your Supabase SQL Editor:
```sql
SELECT * FROM information_schema.tables WHERE table_name = 'companies';
```

### 2. Check Table Structure
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;
```

### 3. Check RLS Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'companies';
```

## Common Fixes

### 1. Recreate Companies Table
If the table is corrupted or missing:
1. Drop the existing table:
   ```sql
   DROP TABLE IF EXISTS companies;
   ```
2. Run the `companies-table-schema.sql` script again

### 2. Fix RLS Policies
If there are RLS issues:
1. Run the `companies-rls-fix.sql` script
2. Verify policies are applied correctly

### 3. Update Environment Variables
If credentials have changed:
1. Update environment variables in Netlify
2. Redeploy the frontend
3. Update environment variables in Render
4. Redeploy the backend

## Still Having Issues?

1. Check that your Supabase project is active and not paused
2. Verify that your Supabase credentials are correct
3. Ensure your frontend and backend are using the same Supabase project
4. Contact support for your deployment platform (Netlify or Render) if the issue persists