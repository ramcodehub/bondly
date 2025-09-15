# How to Test Your Bondly CRM Before Deploying to GoDaddy

## Why Test Before Deploying?

Testing your dist files locally before uploading to GoDaddy helps you:
- Catch issues early without affecting your live site
- Verify all functionality works correctly
- Identify configuration problems
- Ensure a smooth deployment process

## New Tools We've Created for You

We've created several tools to make testing your dist files easy:

1. **Automated Test Script** - `npm run test:dist`
2. **Windows Batch File** - Double-click `TEST_DIST_WINDOWS.bat`
3. **Comprehensive Testing Guide** - `COMPREHENSIVE_TESTING_GUIDE.md`
4. **Quick Reference** - `TEST_DIST_FILES.md`
5. **Testing README** - `TESTING_README.md`

## Step-by-Step Testing Process

### 1. Build Your Project

First, make sure you have built your project:

```bash
npm run build:godaddy
```

Or if you want to use the simpler build process:

```bash
npm run build:godaddy:simple
```

### 2. Verify Your Dist Folder

Check that your `frontend/dist` folder exists and contains files:

```bash
ls frontend/dist
```

You should see files like:
- `index.html`
- [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess)
- CSS and JS files
- Image assets

### 3. Test Your Dist Files

Choose one of these methods:

#### Method 1: Automated Script (Recommended)
```bash
npm run test:dist
```

This script will:
- Check if your dist folder exists
- Verify essential files are present
- Check for available server options
- Provide clear instructions

#### Method 2: Windows Batch File (Windows Only)
Simply double-click the `TEST_DIST_WINDOWS.bat` file. This will:
- Automatically check for the dist folder
- Install http-server if needed
- Start the server on port 3000
- Open your browser automatically

#### Method 3: Manual Testing
```bash
cd frontend/dist
npx http-server -p 3000
```
Then open `http://localhost:3000` in your browser.

### 4. What to Check During Testing

When testing your dist files locally, verify these critical areas:

1. **Basic Functionality**
   - Homepage loads correctly
   - All navigation links work
   - Images and CSS load properly
   - JavaScript functions execute without errors

2. **SPA Routing**
   - Try refreshing on different pages (should not show 404)
   - Direct navigation to subpages works (e.g., `/login`, `/dashboard`)
   - Back/forward browser buttons work correctly

3. **API Integration**
   - Login functionality works
   - Data fetching from your Render backend works
   - Form submissions work
   - Supabase authentication functions

4. **Environment Variables**
   - Check that all environment variables are properly configured
   - API endpoints are accessible
   - External services (if any) are working

### 5. Common Issues to Look For

- **404 errors on page refresh** - Indicates [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) issues
- **Blank pages** - Could be JavaScript errors
- **Missing images or CSS** - Path issues
- **API connection failures** - Environment variables not configured
- **Console errors** - Check browser developer tools (F12)

### 6. Browser Testing Checklist

- [ ] Homepage loads without errors
- [ ] All navigation links work
- [ ] Page refresh works on all routes
- [ ] Login functionality works
- [ ] Dashboard loads and displays data
- [ ] All forms submit correctly
- [ ] Images and styles load properly
- [ ] No console errors
- [ ] No network errors
- [ ] Mobile responsiveness works

## After Successful Testing

Once you've confirmed everything works locally:

1. Create a zip file of your dist folder contents (not the folder itself)
2. Upload to GoDaddy root directory (public_html or www)
3. Ensure [.htaccess](file:///C:/Users/sathi/OneDrive/Desktop/NextGen_AI/Travels/frontend/public/.htaccess) is in the root directory
4. Configure environment variables in GoDaddy control panel

## Troubleshooting

If you encounter issues during testing:

1. Run `npm run verify:godaddy` to check your configuration
2. Review the `GODADDY_DEPLOYMENT_TROUBLESHOOTING.md` file
3. Check browser developer tools for specific error messages
4. Refer to `COMPREHENSIVE_TESTING_GUIDE.md` for detailed troubleshooting

## Need More Help?

If you continue to have issues:
1. Share the specific error messages you're seeing
2. Let us know which testing method you're using
3. Provide details about your environment (Windows version, Node.js version, etc.)

We're here to help you get your Bondly CRM working perfectly on GoDaddy!