# GoDaddy Deployment Guide for Bondly CRM Frontend

This guide explains how to deploy the Bondly CRM frontend to GoDaddy hosting while keeping the existing Netlify deployment intact.

## Overview

- **Existing Deployment**: Netlify (unchanged)
- **New Deployment**: GoDaddy (static hosting)
- **Backend**: Render (unchanged)
- **Database**: Supabase (unchanged)

## Prerequisites

1. Ensure you have the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_BACKEND_API_URL`

2. Node.js v16 or higher installed locally

## Build Process

### 1. Create Production Build for GoDaddy

```bash
npm run build:godaddy
```

This command will:
- Use the [next.config.godaddy.mjs](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/next.config.godaddy.mjs) configuration optimized for static export
- Generate a static build in the `.next/server/app` directory
- Copy all public files (including [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess)) to the output directory
- Note: We don't run `next export` because we're using App Router which handles static export during the build process

### 2. Environment Variables

For GoDaddy deployment, you need to configure your environment variables in the GoDaddy hosting control panel:
- `NEXT_PUBLIC_SUPABASE_URL`=your_supabase_url
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`=your_supabase_anon_key
- `NEXT_PUBLIC_BACKEND_API_URL`=https://your-backend-url.onrender.com

Note: These values should match your Render backend deployment.

## Deployment to GoDaddy

### Method 1: File Manager (Recommended)

1. After running `npm run build:godaddy`, you'll have a `.next/server/app` directory with static files
2. Upload all contents of the `.next/server/app` directory to your GoDaddy hosting root folder via File Manager
3. Ensure the [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) file is in the root directory (it will be copied from the public directory during build)

### Method 2: FTP

1. Connect to your GoDaddy hosting via FTP
2. Upload all contents of the `.next/server/app` directory to your hosting root folder
3. Ensure the [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) file is in the root directory (it will be copied from the public directory during build)

## Configuration Details

### next.config.godaddy.mjs

This configuration file is specifically designed for static export:
- Sets `output: 'export'` for static site generation
- Configures `images.unoptimized: true` as required for static export
- Maintains all other necessary configurations

### .htaccess

The [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) file handles:
- SPA routing (redirects all non-file requests to index.html)
- Security headers
- Basic caching for static assets

## Verification

After deployment, verify that:

1. Homepage loads correctly
2. All dashboard routes work (e.g., `/dashboard`, `/dashboard/leads`, etc.)
3. API calls to your Render backend function properly
4. Supabase authentication works
5. All forms and interactive elements function as expected

## Troubleshooting

### Common Issues

1. **404 errors on routes**: Ensure [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) is properly uploaded and Apache mod_rewrite is enabled

2. **Environment variables not loading**: Make sure your environment variables are correctly configured in the GoDaddy hosting control panel

3. **Images not loading**: The configuration uses `images.unoptimized: true` which means images are not optimized by Next.js but served directly

### Routing Issues

If you encounter routing issues:
1. Verify that [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) contains the rewrite rules
2. Check that all files were uploaded correctly
3. Clear your browser cache and GoDaddy's cache if applicable

## Maintaining Both Deployments

- **Netlify**: Continues to work as before with server-side rendering
- **GoDaddy**: Serves static files with client-side routing
- Both deployments use the same environment variables but configured separately
- No changes to UI/UX or functionality between deployments

## Updating Deployments

To update either deployment:

1. Pull the latest code
2. For Netlify: Simply trigger a new build via Git or Netlify dashboard
3. For GoDaddy:
   a. Run `npm run build:godaddy`
   b. Upload the new `.next/server/app` directory contents
   c. Replace all files on the server