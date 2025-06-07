#!/bin/bash
# Vercel Environment Variable Configuration Script
# Generated for 4-Tier Subscription System Deployment

echo "🚀 Configuring Vercel environment variables for 4-Tier Subscription System..."
echo "═══════════════════════════════════════════════════════════════════════════"

# Core Square Configuration
echo "Setting Square Core Configuration..."
vercel env add SQUARE_ENVIRONMENT production production
vercel env add SQUARE_ACCESS_TOKEN EAAAl0BMtPQHgOCZ4uOaWuFZuZI-h_3aNFITJ9m-RUJjPl5z0bkGlBGhNkN3bKrG production
vercel env add SQUARE_WEBHOOK_SECRET xfjiT4w2X_jdnAMfKDu9rPGhlEYWx2-cJ-mxkbAshvQ production

# Enhanced Checkout URLs (placeholder values - update with actual Square links)
echo "Setting Enhanced Checkout URLs..."
vercel env add SQUARE_CHECKOUT_URL https://square.link/u/AAt7dzT4 production preview
vercel env add SQUARE_CHECKOUT_URL_PREMIUM https://square.link/u/AAt7dzT4 production preview
vercel env add SQUARE_STANDARD_CHECKOUT_URL https://square.link/u/STANDARD297 production preview
vercel env add SQUARE_FIRST_MONTH_CHECKOUT_URL https://square.link/u/FIRST147 production preview
vercel env add SQUARE_TODAY_ONLY_CHECKOUT_URL https://square.link/u/TODAY197 production preview
vercel env add SQUARE_PREMIUM_CHECKOUT_URL https://square.link/u/PREMIUM497 production preview

# Sandbox Configuration  
echo "Setting Sandbox Configuration..."
vercel env add SQUARE_CHECKOUT_URL_SANDBOX https://square.link/u/duE0KIaE development preview
vercel env add SQUARE_WEBHOOK_SECRET_SANDBOX sandbox_webhook_secret_placeholder development preview

# Airtable Configuration
echo "Setting Airtable Configuration..."
vercel env add AIRTABLE_API_KEY patxXxXxXxXxXxXxXxXxXx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx production preview
vercel env add AIRTABLE_BASE_ID appXxXxXxXxXxXxXx production preview
vercel env add AIRTABLE_TABLE_NAME Leads production preview

# Feature Flags (initially disabled for controlled deployment)
echo "Setting Feature Flags (initially disabled)..."
vercel env add NEXT_PUBLIC_ENABLE_NEW_PRICING false production preview
vercel env add NEXT_PUBLIC_ENABLE_FIRST_MONTH_PROMO false production preview
vercel env add NEXT_PUBLIC_ENABLE_TODAY_ONLY_PROMO false production preview
vercel env add NEXT_PUBLIC_ENABLE_WEEKEND_SPECIAL false production preview
vercel env add NEXT_PUBLIC_ENABLE_ANALYTICS true production preview

# Analytics Configuration
echo "Setting Analytics Configuration..."
vercel env add NEXT_PUBLIC_GOOGLE_ANALYTICS_ID G-XXXXXXXXXX production
vercel env add NEXT_PUBLIC_FACEBOOK_PIXEL_ID 123456789012345 production

# Application Configuration
echo "Setting Application Configuration..."
vercel env add NEXT_PUBLIC_APP_URL https://aichatbotsolutions.io production
vercel env add NODE_ENV production production

# Email Service Configuration
echo "Setting Email Service Configuration..."
vercel env add EMAILJS_SERVICE_ID service_xxxxxxxx production preview
vercel env add EMAILJS_TEMPLATE_ID template_xxxxxxxx production preview
vercel env add EMAILJS_USER_ID user_xxxxxxxxxxxxxxxx production preview

echo "✅ Environment variables configured successfully!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "   1. Update checkout URLs with actual Square links"
echo "   2. Replace placeholder tokens with real values"
echo "   3. Create 4 new Square checkout links:"
echo "      - Standard Monthly: $297/month"
echo "      - First Month Special: $147 first month" 
echo "      - Today Only Special: $197/month"
echo "      - Premium Plan: $497/month"
echo "   4. Test all payment flows before enabling new pricing"
echo "   5. Deploy with: vercel --prod"
echo ""
echo "🎯 After deployment, enable new pricing with:"
echo "   vercel env add NEXT_PUBLIC_ENABLE_NEW_PRICING true production"
echo "   vercel --prod"