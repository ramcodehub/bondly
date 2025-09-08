# Deployment Environment Variables Setup

This guide will help you configure the required environment variables for your deployed application.

## Supabase Configuration

First, you need to get your Supabase credentials from your project dashboard:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "Project Settings" → "API"
4. Copy the following values:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Project API Key (anon key for NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Service Role Key (for SUPABASE_SERVICE_ROLE_KEY)

## Netlify Deployment (Frontend)

1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" → "Environment variables"
4. Add the following environment variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase project URL | The URL of your Supabase project |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase anon key | The public API key for client-side operations |
| NEXT_PUBLIC_APP_URL | Your Netlify site URL | Your deployed frontend URL (e.g., https://your-site.netlify.app) |

## Render Deployment (Backend)

1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" section
4. Add the following environment variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| SUPABASE_URL | Your Supabase project URL | The URL of your Supabase project |
| SUPABASE_SERVICE_ROLE_KEY | Your Supabase service role key | The secret key for server-side operations |
| FRONTEND_URL | Your frontend URL | Your deployed frontend URL (e.g., https://your-site.netlify.app) |

## Verification

After setting up the environment variables:

1. Trigger a new deployment for both frontend and backend
2. Check the deployment logs for any errors
3. Test the application by visiting your deployed URL

## Common Issues

### Environment Variables Not Found
If you're still seeing the "URL and Key are required" error:
1. Double-check that all environment variables are correctly named
2. Ensure there are no extra spaces in the variable names or values
3. Verify that the variables are marked as "Published" in Netlify

### Connection Issues
If the application deploys but can't connect to Supabase:
1. Verify that your Supabase project URL and keys are correct
2. Check that your Supabase project is not paused
3. Ensure that your frontend URL is added to the Supabase auth settings

## Troubleshooting

To debug environment variable issues:

1. Add temporary logging in your application:
   ```javascript
   console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
   console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
   ```

2. Check deployment logs for these values (be careful not to expose keys in logs)

3. Use deployment platform's environment variable testing features if available