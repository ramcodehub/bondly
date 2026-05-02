# Authentication Setup Guide

This document explains how authentication works in the Travels application and how to troubleshoot common issues.

## How Authentication Works

The application uses Supabase Auth for authentication with the following components:

1. **Middleware** (`src/middleware.ts`): Handles session management for all requests
2. **Supabase Client** (`src/lib/supabase-client.ts`): Client-side Supabase client
3. **Server Client** (`src/utils/supabase/server.ts`): Server-side Supabase client for SSR
4. **Middleware Client** (`src/utils/supabase/middleware.ts`): Special client for middleware operations

## Common Authentication Issues

### 1. AuthSessionMissingError

This error is **normal** when there's no active session (i.e., when a user is not logged in). It should not prevent the application from working.

**Solution**: The error has been handled gracefully in the middleware. No action needed unless you're seeing actual authentication failures.

### 2. Environment Variables Missing

Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Cookie Issues

If you're experiencing issues with session persistence, try:

1. Clearing browser cookies for localhost
2. Checking browser console for cookie-related errors
3. Ensuring your browser is not blocking third-party cookies

## Testing Authentication

### 1. Using the Test Page

Visit `/test-auth` to test authentication functionality:

- Login with valid credentials
- Check session status
- Logout to test session cleanup

### 2. Using the API Endpoint

Visit `/api/test-connection` to verify Supabase connectivity:

- Should return a success message if connection is working
- Will show error details if connection fails

## Troubleshooting Steps

1. **Check Environment Variables**:
   - Verify `.env.local` exists and contains correct values
   - Restart the development server after changes

2. **Clear Browser Data**:
   - Clear cookies and local storage for localhost
   - Try in an incognito/private browsing window

3. **Check Supabase Dashboard**:
   - Ensure your Supabase project is active
   - Verify auth settings are configured correctly

4. **Review Console Logs**:
   - Check browser console for client-side errors
   - Check terminal for server-side errors

## Expected Behavior

- Users can access public pages without authentication
- Users are redirected to login when accessing protected pages
- Session is maintained across page navigations
- Users can logout and clear their session