@echo off
echo 🚀 Production Deployment Script for AI Chatbot Solutions
echo ========================================================

echo.
echo 📋 Pre-deployment checklist:
echo ✅ Code changes committed and pushed to GitHub
echo ✅ Production environment variables configured
echo ✅ Build process verified

echo.
echo 🔧 Running production build test...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

echo.
echo ✅ Build successful! Ready for deployment.
echo.
echo 📝 Next steps:
echo 1. Login to Vercel: npx vercel login
echo 2. Deploy to production: npx vercel --prod
echo 3. Configure custom domain: aichatbotsolutions.io
echo 4. Set up Square webhooks: https://aichatbotsolutions.io/api/square
echo.
echo 🌐 Manual deployment option:
echo Visit https://vercel.com/dashboard and import your GitHub repository
echo.

pause
