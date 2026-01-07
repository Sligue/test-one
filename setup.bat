@echo off
REM HustleHub Setup Script for Windows
REM This script checks for Node.js and installs npm dependencies

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   HustleHub Setup Script for Windows
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please follow these steps:
    echo.
    echo 1. Go to: https://nodejs.org
    echo 2. Download the LTS version
    echo 3. Run the installer and follow the prompts
    echo 4. Restart this script after installation
    echo.
    pause
    exit /b 1
)

REM Get Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% is installed
echo.

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not found!
    echo Please reinstall Node.js from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% is installed
echo.

echo ========================================
echo Installing npm dependencies...
echo (This may take 2-3 minutes)
echo ========================================
echo.

REM Install dependencies
cd /d "%~dp0"
call npm install

if %ERRORLEVEL% EQ 0 (
    echo.
    echo ========================================
    echo   [SUCCESS] Setup complete!
    echo ========================================
    echo.
    echo Next steps:
    echo.
    echo 1. CONFIGURE SUPABASE:
    echo    - Go to https://app.supabase.com
    echo    - Open your project's SQL Editor
    echo    - Paste entire content of sql/seed.sql
    echo    - Click "Run"
    echo.
    echo 2. CREATE STORAGE BUCKETS:
    echo    - Go to Storage
    echo    - Create "products" bucket (set to Public)
    echo    - Create "avatars" bucket (set to Public)
    echo.
    echo 3. START DEV SERVER:
    echo    - Open PowerShell in this folder
    echo    - Run: npm run dev
    echo    - Visit: http://localhost:3000
    echo.
    echo 4. TEST THE APP:
    echo    - Click "Sign Up" and create an account
    echo    - Go to Marketplace and browse
    echo    - Try creating a product listing
    echo.
    echo ========================================
    echo For detailed setup, see: QUICK_FIX.md
    echo ========================================
    echo.
    pause
) else (
    echo.
    echo [ERROR] npm install failed!
    echo Please check the errors above.
    echo.
    pause
    exit /b 1
)
