@echo off
TITLE Bondly CRM - Dist Files Tester
COLOR 0A

echo ======================================================
echo    Bondly CRM - Test Dist Files Locally
echo ======================================================
echo.

REM Check if we're in the right directory
if not exist "frontend\dist" (
    echo ❌ Error: frontend\dist folder not found!
    echo Please run the build first: npm run build:godaddy
    echo.
    pause
    exit /b 1
)

echo ✅ Found dist folder
echo.

REM Check if http-server is installed
echo 🔍 Checking for http-server...
npm list -g http-server >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  http-server not found. Installing...
    npm install -g http-server
    if %errorlevel% neq 0 (
        echo ❌ Failed to install http-server
        pause
        exit /b 1
    )
)

echo ✅ http-server is ready
echo.

echo 🚀 Starting server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

REM Change to dist directory and start server
cd frontend\dist
if %errorlevel% neq 0 (
    echo ❌ Failed to change directory
    pause
    exit /b 1
)

REM Start the server
npx http-server -p 3000 -o

echo.
echo 👋 Server stopped
pause