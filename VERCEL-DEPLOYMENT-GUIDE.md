# 🚀 Vercel Deployment Guide - Complete Setup

## ✅ Current Status

Your chatbot service is now deployed at: **https://chatbot-service-launch.vercel.app/**

## 🔧 Environment Variables Setup

### Step 1: Configure Vercel Environment Variables

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these variables for **Production**:

```env
# Airtable Configuration
AIRTABLE_API_KEY=patvWQUVZiitIh7gL.a199bc1a36fa9b622299ad42e3b00458f6e440e282187719afa20de64d72dfc1
AIRTABLE_BASE_ID=appz2t8CUMw5UycT8
AIRTABLE_TABLE_NAME=Chatbot_Requests

# Square Configuration (Production)
SQUARE_WEBHOOK_SECRET=xfjiT4w2Ie3q_8uLYfaT2w
SQUARE_APPLICATION_ID=sq0idp-uduv7c6xnh4Pjb4oXLLJbA
SQUARE_ACCESS_TOKEN=EAAAl0BM6Bb9RV-O64baCVuhxTZ8oGvXzfk51WF6GT0bxypRkGAOA2epFaGnKYQT
SQUARE_ENVIRONMENT=production
SQUARE_API_VERSION=2025-05-21

# Next.js Configuration
NEXTAUTH_URL=https://chatbot-service-launch.vercel.app
NEXTAUTH_SECRET=u0xBCTtO+OsdEnD/19+kpsOj11hqORtQljaiaUW2dT0=
```

### Step 2: Configure Square Checkout Redirect

1. **Go to Square Dashboard**: [squareup.com/dashboard](https://squareup.com/dashboard)
2. **Navigate to**: Online → Square Online → Checkout Links
3. **Edit your checkout link**: `https://checkout.square.site/merchant/MLPTAEBXR0WWD/checkout/GYSOBO3BXN3GTCISHBZEFIDV`
4. **Set Redirect URLs**:
   - **Success URL**: `https://chatbot-service-launch.vercel.app/configure?payment_success=true`
   - **Cancel URL**: `https://chatbot-service-launch.vercel.app/?payment_cancelled=true`

### Step 3: Configure Square Webhooks

1. **Go to**: [Square Developer Dashboard](https://developer.squareup.com/apps)
2. **Select your application**
3. **Go to "Webhooks" tab**
4. **Create/Update Webhook**:
   - **Endpoint URL**: `https://chatbot-service-launch.vercel.app/api/square`
   - **API Version**: `2025-05-21`
   - **Events to Subscribe**:
     - ✅ `payment.created`
     - ✅ `payment.updated`
     - ✅ `subscription.created`
     - ✅ `subscription.updated`
     - ✅ `subscription.canceled`

## 🧪 Testing the Complete Flow

### Test 1: Homepage Flow
1. **Visit**: https://chatbot-service-launch.vercel.app/
2. **Verify**: Lead capture form is visible (not detailed config)
3. **Fill out**: Lead capture form
4. **Verify**: Redirects to pricing section

### Test 2: Payment Flow
1. **Click**: "🚀 Start Your Subscription Now"
2. **Verify**: Goes to Square checkout
3. **Complete payment**: Use test card `4111 1111 1111 1111` (if sandbox) or real payment
4. **Verify**: Redirects to `/configure?payment_success=true`

### Test 3: Configuration Flow
1. **After payment**: Should land on configuration page
2. **Verify**: Shows "Payment Successful" message
3. **Fill out**: Detailed configuration form
4. **Submit**: Form data
5. **Verify**: Redirects to `/success?configured=true`

### Test 4: Security Flow
1. **Try accessing**: `/configure` directly without payment
2. **Verify**: Shows "Payment Required" message
3. **Verify**: Cannot access configuration without payment

## 🔍 Monitoring & Debugging

### Vercel Function Logs
1. **Go to**: [Vercel Dashboard](https://vercel.com/dashboard)
2. **Select**: Your project
3. **Go to**: Functions tab
4. **Monitor**: `/api/square` and `/api/submit` logs

### Expected Webhook Logs
```
🔔 Square Webhook Received:
Environment: PRODUCTION
Event Type: payment.created
✅ Webhook signature verified
💰 Payment Created: pay_prod_123456
💰 Amount: { amount: 29700, currency: 'USD' }
💰 Status: COMPLETED
```

### Airtable Integration
1. **Check**: [Airtable Base](https://airtable.com/appz2t8CUMw5UycT8)
2. **Verify**: New records appear in "Chatbot_Requests" table
3. **Check fields**: Business Name, Email, FAQs, etc.

## 🚨 Troubleshooting

### If Payment Redirect Doesn't Work:
- Check Square checkout redirect URL configuration
- Verify the checkout link includes redirect parameters
- Test with sandbox environment first

### If Webhooks Don't Work:
- Check Vercel function logs for errors
- Verify webhook URL in Square dashboard
- Ensure environment variables are set correctly
- Check webhook signature verification

### If Configuration Page Shows "Payment Required":
- Check URL parameters: `?payment_success=true`
- Verify localStorage session data
- Check 24-hour session expiry

### If Form Submission Fails:
- Check Airtable API key and permissions
- Verify base ID and table name
- Check browser console for errors

## 🎯 Success Criteria

- ✅ Homepage shows lead capture (not detailed config)
- ✅ Payment button goes to Square checkout
- ✅ Square checkout redirects to configuration page
- ✅ Configuration page validates payment
- ✅ Form submission saves to Airtable
- ✅ Success page shows appropriate message
- ✅ Unauthorized access blocked
- ✅ Webhooks receive and process payments

## 🔄 Auto-Deployment

Your project is configured for auto-deployment:
- ✅ **GitHub Integration**: Pushes to `main` branch auto-deploy
- ✅ **Build Command**: `npm run build`
- ✅ **Framework**: Next.js detected
- ✅ **Environment**: Production variables configured

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Monitor function logs for API errors
3. Verify Square dashboard configuration
4. Test with sandbox environment first

## 🎉 Your Chatbot Service is Live!

**Production URL**: https://chatbot-service-launch.vercel.app/

The service now has:
- ✅ Secure payment-first flow
- ✅ Protected configuration access
- ✅ Automated deployment
- ✅ Webhook integration
- ✅ Airtable data storage
- ✅ Professional UI/UX
