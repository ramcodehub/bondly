# Supabase Deployment Troubleshooting Guide

This guide will help you troubleshoot and fix the "Your project's URL and Key are required to create a Supabase client!" error in your deployed application.

## Common Causes

1. Environment variables not configured in deployment platform
2. Incorrect environment variable names
3. Missing environment variables in deployment
4. Misconfigured Supabase client initialization

## Frontend (Netlify) Troubleshooting

### 1. Verify Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" → "Environment variables"
4. Ensure these variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

### 2. Check Variable Names

Make sure you're using the exact variable names:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)

### 3. Verify Values

Check that the values are correct:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "Project Settings" → "API"
4. Copy the values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon key (not service key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Backend (Render) Troubleshooting

### 1. Verify Environment Variables in Render

1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" section
4. Ensure these variables are set:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_KEY` - Your Supabase service role key (not anon key)

### 2. Check Variable Names

Make sure you're using the correct variable names for the backend:
- ✅ `SUPABASE_URL` (not `NEXT_PUBLIC_SUPABASE_URL`)
- ✅ `SUPABASE_KEY` (not `SUPABASE_SERVICE_ROLE_KEY`)

Note: The backend uses different variable names than the frontend.

## Testing Your Configuration

### 1. Local Testing

Create a simple test file to verify your environment variables:

```javascript
// test-env.js
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET')
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'SET' : 'NOT SET')
```

Run it with:
```bash
node test-env.js
```

### 2. Frontend Test

Add this to a frontend component to verify environment variables are available:

```javascript
useEffect(() => {
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
}, [])
```

Check the browser console for these values.

## Redeployment

After fixing environment variables:

1. **For Netlify (Frontend)**:
   - Trigger a new deployment from the Netlify dashboard
   - Or push a small change to your repository to trigger a new build

2. **For Render (Backend)**:
   - Go to your service in Render
   - Click "Manual Deploy" → "Deploy latest commit"

## Debugging Deployment Logs

Check deployment logs for errors:

1. **Netlify**: Check deploy logs in the "Deploys" tab
2. **Render**: Check logs in the "Logs" tab

Look for:
- Environment variable loading messages
- Supabase client initialization errors
- Any error messages related to missing variables

## Common Mistakes

1. **Mixing up variable names**: Frontend uses `NEXT_PUBLIC_*` variables, backend uses different names
2. **Using wrong keys**: Frontend needs anon key, backend needs service role key
3. **Not redeploying**: Changes to environment variables require a new deployment
4. **Typos in variable names**: Extra spaces or incorrect casing

## Still Having Issues?

1. Check that all files use the correct environment variable names:
   - Frontend: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Backend: `SUPABASE_URL` and `SUPABASE_KEY`

2. Verify that all Supabase client initialization files have proper validation:
   - Check that they throw descriptive errors when variables are missing

3. Contact your deployment platform support if environment variables seem to be configured correctly but still aren't being read.