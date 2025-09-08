# Backend Deployment Troubleshooting Guide

This guide will help you troubleshoot and fix common issues with your backend deployment on Render.

## Port Configuration Issues

### Problem
Your backend is running on port 5001, but Render expects it to run on the port specified in the environment variable `PORT` (configured as 10000 in your [render.yaml](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/render.yaml)).

### Solution
We've updated your [index.js](file:///c:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/backend/src/index.js) to use `PORT = process.env.PORT || 10000` to match your Render configuration.

## 404 Errors

### Problem
Your logs show many 404 errors for requests to `/` and `/favicon.ico`.

### Solution
We've added:
1. A root route (`/`) that returns a JSON response with server status
2. Proper handling of favicon requests

## Environment Variables

### Required Variables
Make sure these environment variables are set in your Render dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `10000` | Port for the server to listen on |
| `NODE_ENV` | `production` | Environment mode |
| `SUPABASE_URL` | Your Supabase project URL | Database connection |
| `SUPABASE_KEY` | Your Supabase service role key | Database authentication |
| `FRONTEND_URL` | Your frontend URL | CORS configuration |

### How to Set in Render
1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" section
4. Add/update the variables listed above

## Health Check

### Verify Your Deployment
You can check if your backend is running properly by visiting:
```
https://your-render-url.onrender.com/health
```

This should return a JSON response indicating the server is healthy.

## CORS Issues

### Problem
If your frontend can't connect to your backend, it might be a CORS issue.

### Solution
Your CORS configuration allows:
- All origins in development
- Specific origins in production (including your FRONTEND_URL)

Make sure your `FRONTEND_URL` environment variable is set correctly in Render.

## Supabase Connection

### Verify Connection
Check your Render logs for Supabase connection messages. If there are issues:
1. Verify `SUPABASE_URL` and `SUPABASE_KEY` are set correctly
2. Check that your Supabase project is not paused
3. Ensure your service role key has the necessary permissions

## Redeployment

### After Making Changes
1. Push your changes to your repository
2. Render will automatically deploy the new version
3. Monitor the deployment logs for any errors

## Common Issues and Solutions

### 1. Port Binding Warning
**Issue**: "Detected service running on port 5001"
**Solution**: Ensure your application uses `process.env.PORT` and that it's set to 10000 in Render

### 2. CORS Errors
**Issue**: Frontend can't make requests to backend
**Solution**: 
- Verify `FRONTEND_URL` is set in Render
- Check that the frontend URL matches exactly (including protocol and port)

### 3. 404 Errors
**Issue**: Requests to API routes return 404
**Solution**:
- Verify your API routes are correctly defined
- Check that route paths match what your frontend is requesting

### 4. Supabase Connection Issues
**Issue**: Database operations fail
**Solution**:
- Verify `SUPABASE_URL` and `SUPABASE_KEY` environment variables
- Check Supabase dashboard for project status
- Ensure service role key has proper permissions

## Testing Your API

### Using curl
Test your API endpoints using curl:

```bash
# Test health endpoint
curl https://your-render-url.onrender.com/health

# Test root endpoint
curl https://your-render-url.onrender.com/

# Test leads endpoint (example)
curl https://your-render-url.onrender.com/api/leads
```

### Using Postman
1. Create a new request
2. Set the URL to your endpoint
3. Send the request
4. Check the response

## Monitoring

### Render Dashboard
1. Check the "Logs" tab for real-time logs
2. Check the "Metrics" tab for performance data
3. Check the "Settings" tab to verify environment variables

### Error Tracking
All errors are logged with request details including:
- Request method and path
- Request body, params, and query
- Error message and stack trace
- Unique request ID for tracking

## Still Having Issues?

1. Check Render logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure your frontend is making requests to the correct backend URL
4. Check that your Supabase project is active and accessible
5. Contact Render support if the issue persists