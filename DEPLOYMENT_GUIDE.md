# Deployment Guide for AMGS CRM CRM

This guide will help you deploy the AMGS CRM CRM application with the frontend on Netlify and the backend on Render.

## Prerequisites

1. A [Netlify](https://netlify.com/) account
2. A [Render](https://render.com/) account
3. A [Supabase](https://supabase.com/) account with your project configured

## Frontend Deployment (Netlify)

### 1. Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/) and sign in to your account
2. Click "New site from Git"
3. Connect your GitHub repository
4. Select the repository that contains the AMGS CRM CRM code

### 2. Configure Build Settings

Netlify should automatically detect the following settings:
- Build command: `npm run build`
- Publish directory: `.next`

If these settings are not automatically detected, manually enter them.

### 3. Set Environment Variables

In Netlify, go to Site settings > Build & deploy > Environment and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-url.onrender.com
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase credentials.
Replace `your-backend-url.onrender.com` with your actual Render backend URL after deploying the backend.

### 4. Deploy

Click "Deploy site" to start the deployment process.

## Backend Deployment (Render)

### 1. Connect to Render

1. Go to [Render](https://dashboard.render.com/) and sign in to your account
2. Click "New Web Service"
3. Connect your GitHub repository
4. Select the repository that contains the AMGS CRM CRM code

### 2. Configure Service Settings

- Name: AMGS CRM-backend (or any name you prefer)
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Plan: Free (or select a paid plan for production)

### 3. Set Environment Variables

In Render, add the following environment variables:

```
NODE_ENV=production
PORT=10000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
FRONTEND_URL=https://your-frontend-url.netlify.app
```

Replace:
- `your_supabase_project_url` with your actual Supabase project URL
- `your_supabase_service_role_key` with your Supabase service role key (NOT the anon key)
- `your-frontend-url.netlify.app` with your actual Netlify frontend URL

### 4. Advanced Settings

Make sure to set the following in Advanced settings:
- Auto-deploy: Yes (if you want automatic deployments on code changes)

### 5. Deploy

Click "Create Web Service" to start the deployment process.

## Post-Deployment Configuration

### 1. Update Frontend with Backend URL

After your backend is deployed on Render:

1. Copy the Render URL (e.g., https://AMGS CRM-backend.onrender.com)
2. Go to your Netlify site settings
3. Update the `NEXT_PUBLIC_BACKEND_API_URL` environment variable with the Render URL
4. Trigger a new deployment of your frontend

### 2. Update Backend with Frontend URL

After your frontend is deployed on Netlify:

1. Copy the Netlify URL (e.g., https://your-site-name.netlify.app)
2. Go to your Render service settings
3. Update the `FRONTEND_URL` environment variable with the Netlify URL
4. Restart your Render service

## Supabase Configuration

Make sure your Supabase project is properly configured:

1. Enable Auth and configure sign-in providers as needed
2. Set up your database tables according to the schema in your project
3. Configure Row Level Security (RLS) policies as needed
4. Add your Netlify and Render URLs to Supabase's auth settings:
   - Go to Supabase Dashboard > Authentication > Settings
   - Add your URLs to "Additional Redirect URLs"

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your `FRONTEND_URL` environment variable is correctly set in your Render backend service.

2. **Environment Variables Not Found**: Double-check that all environment variables are correctly set in both Netlify and Render.

3. **Build Failures**: Check the build logs in Netlify and Render for specific error messages.

4. **API Calls Not Working**: Ensure that `NEXT_PUBLIC_BACKEND_API_URL` is correctly set in Netlify and matches your Render backend URL.

### Checking Logs

- **Netlify**: Go to your site dashboard > Deploys or Functions to view logs
- **Render**: Go to your service dashboard > Logs to view application logs

## Updating Your Application

To update your deployed application:

1. Push changes to your GitHub repository
2. Netlify and Render will automatically detect changes and start new deployments (if auto-deploy is enabled)
3. You can also manually trigger deployments from the respective dashboards

## Scaling Considerations

For production use:

1. Consider upgrading from free tiers on Netlify and Render
2. Set up custom domains
3. Configure SSL certificates (both platforms provide these automatically)
4. Set up monitoring and alerting
5. Consider implementing caching strategies