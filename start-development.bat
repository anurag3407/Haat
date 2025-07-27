@echo off
cls
echo.
echo 🚀 Haat - Street Vendor Supply Management Platform
echo =============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js and try again.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ Prerequisites met!
echo 🔄 Running comprehensive setup script...
echo.

REM Run the Node.js setup script
node start-development.cjs

pause
