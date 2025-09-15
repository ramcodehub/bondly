# GoDaddy Deployment Troubleshooting Guide

## Issue Analysis

You've mentioned that after uploading files to GoDaddy, the frontend is not opening. This is a common issue with specific causes and solutions.

## Common Causes and Solutions

### 1. Incorrect File Upload Location
**Problem**: Files uploaded to a subdirectory instead of the root directory
**Solution**: 
- Upload all files directly to the `public_html` or `htdocs` directory (root)
- Do NOT upload to a subfolder like `public_html/frontend`

### 2. Missing or Incorrect .htaccess File
**Problem**: The [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) file is crucial for SPA routing on Apache servers
**Solution**:
- Ensure [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) is uploaded to the root directory
- Verify it contains the correct rewrite rules

### 3. Environment Variables Not Configured
**Problem**: Frontend can't connect to backend services
**Solution**:
- Set environment variables in GoDaddy control panel:
  - `NEXT_PUBLIC_SUPABASE_URL`=your_supabase_url
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`=your_supabase_anon_key
  - `NEXT_PUBLIC_BACKEND_API_URL`=https://your-backend-url.onrender.com

## Step-by-Step Fix Process

### Step 1: Extract and Verify Your Build
1. Extract the [dist.zip](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/dist.zip) file
2. Verify it contains these essential files:
   - `index.html`
   - CSS files (usually in a css/ folder or with .css extension)
   - JavaScript files (usually in a js/ folder or with .js extension)
   - [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess)
   - Images and other assets

### Step 2: Check .htaccess File Content
Your [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) file should look exactly like this:

```apache
# Redirect all requests to index.html for SPA routing
RewriteEngine On

# Allow direct access to existing files and directories
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Redirect all other requests to index.html
RewriteRule ^ index.html [L]

# Security headers
<IfModule mod_headers.c>
  # Prevent MIME type sniffing
  Header always set X-Content-Type-Options "nosniff"
  
  # Prevent clickjacking
  Header always set X-Frame-Options "DENY"
  
  # Enable XSS protection
  Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Cache control for static files
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

### Step 3: Correct Upload Process
1. Log into your GoDaddy hosting File Manager or use FTP
2. Navigate to your root directory (`public_html` or `htdocs`)
3. Delete any existing files in this directory (backup first if needed)
4. Upload ALL files from your extracted [dist.zip](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/dist.zip) directly to this root directory
5. Ensure [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) is visible in the root directory (not in a subfolder)

### Step 4: Configure Environment Variables
1. Log into your GoDaddy hosting control panel
2. Find the section for environment variables or application settings
3. Add these three variables:
   - `NEXT_PUBLIC_SUPABASE_URL`=your_actual_supabase_url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`=your_actual_supabase_anon_key
   - `NEXT_PUBLIC_BACKEND_API_URL`=https://bondly-0r0c.onrender.com
4. Save the settings

### Step 5: Verify Apache mod_rewrite
Contact GoDaddy support to confirm that `mod_rewrite` is enabled on your hosting account, as it's required for the [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) rules to work.

## Testing and Verification

### After Upload, Test These URLs:
1. Your main domain (should show homepage)
2. `/dashboard` (should show dashboard, not 404)
3. `/login` (should show login page)
4. Check browser console for errors (F12 > Console tab)

## Common Error Solutions

### Error: "404 Page Not Found" on All Routes
**Cause**: Missing or incorrect [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess)
**Fix**: 
1. Re-upload [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) to root directory
2. Verify `mod_rewrite` is enabled
3. Clear browser cache and try again

### Error: Blank White Page
**Cause**: JavaScript errors or missing assets
**Fix**:
1. Check browser console (F12) for errors
2. Verify all CSS/JS files are uploaded
3. Check that file paths in `index.html` are correct

### Error: API Calls Failing
**Cause**: Environment variables not set or CORS issues
**Fix**:
1. Verify environment variables are correctly set in GoDaddy
2. Check browser console for CORS errors
3. Ensure your Render backend allows requests from your GoDaddy domain

## Alternative Solution: Rebuild and Redeploy

If the current [dist.zip](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/dist.zip) continues to cause issues:

1. Navigate to your frontend directory:
   ```
   cd c:\Users\sathi\OneDrive\Desktop\NextGen_AI\Travels\frontend
   ```

2. Run the simple build script:
   ```
   npm run build:godaddy:simple
   ```

3. This will create files in `.next/server/app` directory

4. Upload the contents of `.next/server/app` to your GoDaddy root directory

## Final Verification Checklist

Before contacting support, verify:
- [ ] All files uploaded to root directory (not subfolder)
- [ ] [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) file is in root directory
- [ ] Environment variables set in GoDaddy control panel
- [ ] `mod_rewrite` enabled (contact GoDaddy if unsure)
- [ ] Browser cache cleared
- [ ] Try accessing in incognito/private browser mode

## If Issues Persist

If you continue to experience problems:
1. Take screenshots of:
   - Your file structure in GoDaddy File Manager
   - Browser console errors (F12)
   - Network tab errors showing failed requests
2. Share the exact URL where you're trying to access the site
3. Note which pages work and which don't

This will help identify the specific issue more quickly.