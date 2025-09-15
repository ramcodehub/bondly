# Testing Your Bondly CRM Before GoDaddy Deployment

## Quick Start

To test your dist files locally before deploying to GoDaddy:

1. **Build your project** (if not already done):
   ```bash
   npm run build:godaddy
   ```

2. **Test your dist files** using one of these methods:

   **Option 1 - Automated Script** (Recommended):
   ```bash
   npm run test:dist
   ```

   **Option 2 - Windows Batch File** (Windows only):
   - Double-click `TEST_DIST_WINDOWS.bat`

   **Option 3 - Manual Testing**:
   ```bash
   cd frontend/dist
   npx http-server -p 3000
   ```
   Then open `http://localhost:3000` in your browser

## Prerequisites

Before testing, ensure you have:
1. Built your project using `npm run build:godaddy` or `npm run build:godaddy:simple`
2. A `dist` folder in your `frontend` directory with all the built files
3. Node.js installed on your system

## Available Testing Tools

### 1. Automated Test Script
- **File**: `frontend/scripts/test-dist-locally.mjs`
- **Command**: `npm run test:dist`
- **Features**:
  - Checks if dist folder exists
  - Verifies essential files are present
  - Automatically detects available server options
  - Provides clear instructions

### 2. Windows Batch File
- **File**: `TEST_DIST_WINDOWS.bat`
- **Usage**: Double-click to run
- **Features**:
  - Automatically installs http-server if needed
  - Starts server on port 3000
  - Opens browser automatically
  - No command line required

### 3. Comprehensive Testing Guide
- **File**: `COMPREHENSIVE_TESTING_GUIDE.md`
- **Content**: Detailed instructions for all testing methods
- **Includes**: Troubleshooting tips and checklists

### 4. Quick Reference Guide
- **File**: `TEST_DIST_FILES.md`
- **Content**: Quick instructions for testing dist files
- **Includes**: Multiple testing methods

## What to Check During Testing

1. **Homepage loads correctly**
2. **All navigation routes work** (click through all pages)
3. **Images and static assets load**
4. **API calls work** (login, data fetching, etc.)
5. **SPA routing works** (try direct URLs to subpages)
6. **Forms and user interactions work**

## Common Issues to Look For

- **404 errors on page refresh** (indicates .htaccess issues)
- **Blank pages** (could be JavaScript errors)
- **Missing images or CSS** (path issues)
- **API connection failures** (environment variables)
- **Console errors** (check browser developer tools)

## After Successful Testing

Once you've confirmed everything works locally:
1. Create a zip file of your dist folder contents (not the folder itself)
2. Upload to GoDaddy root directory (public_html or www)
3. Ensure .htaccess is in the root directory
4. Configure environment variables in GoDaddy control panel

## Need More Help?

- Review `GODADDY_DEPLOYMENT_TROUBLESHOOTING.md` for common deployment issues
- Run `npm run verify:godaddy` to check your deployment readiness
- Check browser developer tools (F12) for specific error messages