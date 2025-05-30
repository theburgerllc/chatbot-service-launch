@echo off
echo 🚀 Deploying Chatbot Service Launch to Vercel...
echo.

REM Enable script execution
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

REM Build the project
echo 📦 Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
echo Please follow the prompts in the browser...
call npx vercel

echo.
echo 🎉 Deployment process initiated!
echo Check your browser for authentication and follow the prompts.
echo.
pause
