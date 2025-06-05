# 🚀 Vercel Sandbox Testing Setup

## Why Use Vercel for Webhook Testing?

- ✅ **HTTPS by default** (required by Square)
- ✅ **Already deployed** and working
- ✅ **Easy environment switching**
- ✅ **Real production-like testing**

## Step-by-Step Setup

### **Step 1: Add Sandbox Environment Variables to Vercel**

1. **Go to**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Select your project**: `chatbot-service-launch`
3. **Go to**: Settings → Environment Variables
4. **Add these SANDBOX variables**:

```env
SQUARE_WEBHOOK_SECRET_SANDBOX=your_sandbox_webhook_secret_here
SQUARE_APPLICATION_ID_SANDBOX=sandbox-sq0idb-9pQyEUDoGVX7ah18DT9v6Q
SQUARE_ACCESS_TOKEN_SANDBOX=EAAAl4keViOp-6oFpPvPi1bhbdRT1LCrd4PQR2sPuSbS9W93_lJPY6Pd47TuOtXV
SQUARE_ENVIRONMENT=sandbox
SQUARE_API_VERSION=2025-05-21
```

### **Step 2: Create Sandbox Webhook in Square**

1. **Go to**: [developer.squareup.com](https://developer.squareup.com)
2. **Switch to Sandbox mode**
3. **Go to**: Webhooks tab
4. **Create New Webhook**:
   - **Endpoint URL**: `https://chatbot-service-launch.vercel.app/api/square`
   - **API Version**: `2025-05-21`
   - **Events**: payment.created, payment.updated, subscription.created, etc.
5. **Copy the Webhook Signature Key**

### **Step 3: Create Sandbox Checkout Link**

1. **Go to**: [squareup.com/dashboard](https://squareup.com/dashboard) (Sandbox mode)
2. **Create test product**: AI Chatbot Pro Plan (Sandbox) - $497
3. **Generate checkout link**
4. **Copy the sandbox checkout URL**

### **Step 4: Test on Live Vercel Site**

1. **Visit**: https://chatbot-service-launch.vercel.app/
2. **Fill out form** (saves to Airtable)
3. **Click payment button** (goes to sandbox checkout)
4. **Complete payment** with test card: `4111 1111 1111 1111`
5. **Check Vercel function logs** for webhook events

### **Step 5: Monitor Webhook Events**

1. **Vercel Dashboard** → Your Project → Functions → `/api/square`
2. **View real-time logs** of webhook events
3. **Verify payment processing**

## Benefits of This Approach

- ✅ **Real HTTPS environment**
- ✅ **Production-like testing**
- ✅ **Easy to monitor logs**
- ✅ **No local setup required**
- ✅ **Works from anywhere**

## Test Card Details

```
Card Number: 4111 1111 1111 1111
Expiration: 12/25
CVV: 123
ZIP: 12345
```

## After Testing

When sandbox testing is complete:
1. **Switch environment variables** back to production
2. **Update webhook URL** to production
3. **Update checkout links** to production
4. **Ready for real customers!**
