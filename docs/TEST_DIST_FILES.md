# How to Test Dist Files Before GoDaddy Deployment

## Method 1: Using the Automated Test Script (Easiest)

1. Run the test script we created:
   ```bash
   npm run test:dist
   ```

2. Follow the instructions provided by the script

## Method 2: Using Windows Batch File (Windows Only)

1. Double-click the `TEST_DIST_WINDOWS.bat` file we created
2. The script will automatically:
   - Check for the dist folder
   - Install http-server if needed
   - Start the server on port 3000
   - Open your browser automatically

## Method 3: Using a Local HTTP Server (Manual)

### Option A: Using Node.js http-server (Simplest)

1. Install http-server globally (if not already installed):
   ```bash
   npm install -g http-server
   ```

2. Navigate to your dist folder:
   ```bash
   cd frontend/dist
   ```

3. Start the server:
   ```bash
   http-server -p 3000
   ```

4. Open your browser and go to `http://localhost:3000`

### Option B: Using Python (if you have Python installed)

1. Navigate to your dist folder:
   ```bash
   cd frontend/dist
   ```

2. For Python 3:
   ```bash
   python -m http.server 3000
   ```

3. For Python 2:
   ```bash
   python -m SimpleHTTPServer 3000
   ```

4. Open your browser and go to `http://localhost:3000`

## Method 2: Using the Built-in Test Script

We've created a test script that automatically verifies your dist files:

1. Run the test script:
   ```bash
   npm run verify:godaddy
   ```

This will check:
- If all required files are present
- If .htaccess is properly configured
- If environment variables are set correctly
- If the build was successful

## Using the Windows Batch File

If you're on Windows, you can simply double-click the `TEST_DIST_WINDOWS.bat` file to automatically:
- Check if your dist folder exists
- Install http-server if needed
- Start a local server on port 3000
- Automatically open your browser

This is the easiest way to test your dist files on Windows.

## What to Check During Testing

1. **Homepage loads correctly**
2. **All navigation routes work** (click through all pages)
3. **Images and static assets load**
4. **API calls work** (login, data fetching, etc.)
5. **SPA routing works** (try direct URLs to subpages)
6. **Forms and user interactions work**

## Common Issues to Look For

1. **404 errors on page refresh** (indicates .htaccess issues)
2. **Blank pages** (could be JavaScript errors)
3. **Missing images or CSS** (path issues)
4. **API connection failures** (environment variables)
5. **Console errors** (check browser developer tools)

## Testing Environment Variables

Before deploying, ensure your environment variables will work on GoDaddy by:

1. Checking that all API URLs in your app are absolute (not relative)
2. Verifying that any authentication endpoints are accessible
3. Confirming that Supabase and Render URLs are correctly configured

## Next Steps

Once you've confirmed everything works locally:
1. Create a zip file of your dist folder contents (not the folder itself)
2. Upload to GoDaddy root directory (public_html or www)
3. Ensure .htaccess is in the root directory
4. Configure environment variables in GoDaddy control panel

If you encounter any issues during local testing, fix them before deploying to GoDaddy.