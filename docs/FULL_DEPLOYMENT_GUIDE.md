# Full Deployment Guide for Bondly

This guide provides step-by-step instructions for deploying both the frontend and backend of the Bondly application.

## Prerequisites

1. Supabase account with a project created
2. Netlify account for frontend deployment
3. Render account for backend deployment
4. Git repository with the latest code

## Supabase Configuration

### 1. Get Supabase Credentials
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "Project Settings" → "API"
4. Note down:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - service role key (SUPABASE_KEY)

## Frontend Deployment (Netlify)

### 1. Environment Variables
Set these environment variables in Netlify:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `NEXT_PUBLIC_BACKEND_API_URL` - Your Render backend URL (https://bondly-0r0c.onrender.com)

### 2. Deployment Settings
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 20.18.2 (as specified in netlify.toml)

### 3. Post-Deployment
After deployment, verify that:
1. The site loads correctly
2. Authentication works
3. API calls to the backend are successful

## Backend Deployment (Render)

### 1. Environment Variables
Set these environment variables in Render:
- `PORT` - 10000
- `NODE_ENV` - production
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase service role key
- `FRONTEND_URL` - Your Netlify frontend URL

### 2. Deployment Settings
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Plan: Free (or your preferred plan)

### 3. CORS Configuration
The backend is configured to allow:
- All origins in development
- Specific origins in production including your frontend URL
- Requests with no origin header (for direct API access)

## API Integration

### Frontend to Backend Communication
The frontend makes API calls to `/api/*` endpoints, which are proxied to the backend via Netlify redirects:
```
/api/* → https://bondly-0r0c.onrender.com/api/*
```

### Health Checks
Both frontend and backend have health check endpoints:
- Frontend: `/health` (proxied to backend)
- Backend: `/health` (direct access)

## Troubleshooting

### Common Issues

#### 1. CORS Errors
- Verify that `FRONTEND_URL` is set correctly in Render
- Check that the frontend URL matches exactly (including protocol)
- Ensure the backend is allowing requests from your frontend origin

#### 2. Environment Variables Not Set
- Double-check all environment variables in both Netlify and Render
- Ensure there are no extra spaces in variable names or values
- Redeploy after making changes to environment variables

#### 3. Port Binding Warnings
- Ensure the backend uses `process.env.PORT` as the primary port configuration
- Verify that the port in render.yaml matches the PORT environment variable

#### 4. 404 Errors
- Check that API routes are correctly defined
- Verify that the frontend is making requests to the correct endpoints
- Ensure Netlify redirects are properly configured

### Testing Your Deployment

#### Backend Testing
```bash
# Test health endpoint
curl https://bondly-0r0c.onrender.com/health

# Test root endpoint
curl https://bondly-0r0c.onrender.com/

# Test leads endpoint (example)
curl https://bondly-0r0c.onrender.com/api/leads
```

#### Frontend Testing
1. Visit your Netlify site URL
2. Try logging in/signing up
3. Navigate to different pages
4. Test form submissions

## Monitoring

### Render Dashboard
1. Check the "Logs" tab for real-time logs
2. Check the "Metrics" tab for performance data
3. Check the "Settings" tab to verify environment variables

### Netlify Dashboard
1. Check the "Deploys" tab for build logs
2. Check the "Functions" tab for serverless function logs
3. Check the "Settings" → "Environment" tab to verify environment variables

## Security Considerations

1. Never expose service role keys in frontend code
2. Use anon keys for frontend Supabase client
3. Use service role keys only in backend
4. Regularly rotate API keys
5. Monitor logs for suspicious activity

## Updates and Maintenance

### Updating the Application
1. Push changes to your Git repository
2. Netlify will automatically deploy frontend changes
3. Render will automatically deploy backend changes

### Database Schema Updates
1. Make changes in Supabase dashboard
2. Update API routes if needed
3. Update frontend components if needed
4. Test thoroughly

## Support

If you encounter issues:
1. Check the logs in both Netlify and Render
2. Verify all environment variables are set correctly
3. Ensure your Supabase project is active
4. Contact platform support if needed:
   - Netlify Support: https://www.netlify.com/support/
   - Render Support: https://render.com/help
   - Supabase Support: https://supabase.com/support