@echo off
echo ========================================
echo GoDaddy Deployment Helper Script
echo ========================================

echo.
echo This script will help you prepare files for GoDaddy deployment.
echo.

cd /d "C:\Users\sathi\OneDrive\Desktop\NextGen_AI\Travels\frontend"

echo Checking current directory...
echo %CD%

echo.
echo 1. Running verification script...
echo ========================================
node scripts/verify-godaddy-deployment.mjs

echo.
echo 2. Checking if dist.zip exists...
echo ========================================
if exist "dist.zip" (
    echo [FOUND] dist.zip - You can extract this and upload to GoDaddy
    echo Size: 
    for %%A in ("dist.zip") do echo %%~zA bytes
) else (
    echo [MISSING] dist.zip - Will create a new build
)

echo.
echo 3. Creating build for GoDaddy...
echo ========================================
npm run build:godaddy:simple

echo.
echo 4. Build complete! Files are in .next/server/app
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Open File Manager in GoDaddy hosting control panel
echo 2. Navigate to your root directory (public_html or htdocs)
echo 3. Upload ALL contents of .next/server/app to this directory
echo 4. Make sure .htaccess is in the root directory
echo 5. Set environment variables in GoDaddy control panel:
echo    - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
echo    - NEXT_PUBLIC_BACKEND_API_URL=https://bondly-0r0c.onrender.com
echo.
echo Press any key to exit...
pause >nul