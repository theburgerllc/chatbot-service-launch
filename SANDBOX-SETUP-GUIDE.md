# 🧪 Square Sandbox Testing Setup Guide

## ✅ What's Already Configured

I've implemented the following sandbox setup:

- ✅ **Environment Configuration**: Set to sandbox mode in `.env.local`
- ✅ **Dynamic Checkout URLs**: Automatically switches between sandbox/production
- ✅ **Enhanced Webhook Logging**: Shows environment and detailed event data
- ✅ **Test Scripts**: Created sandbox integration testing tools
- ✅ **Code Structure**: Ready for sandbox testing

## 🔧 Remaining Manual Tasks

### **Task 1: Get Sandbox Credentials (5 minutes)**

1. **Go to**: [developer.squareup.com](https://developer.squareup.com)
2. **Sign in** to your Square Developer account
3. **Select your application**: "Chatbot Service Launch"
4. **Switch to Sandbox** (toggle in top-right corner)
5. **Go to "Credentials" tab**
6. **Copy these values**:
   ```
   Sandbox Application ID: sandbox-sq0idp-XXXXXXXX
   Sandbox Access Token: EAAAl-sandbox-XXXXXXXX
   Sandbox Webhook Signature Key: different_from_production
   ```

### **Task 2: Update Environment Variables (2 minutes)**

Replace the current values in `.env.local` with your sandbox credentials:

```env
# Square Configuration - SANDBOX MODE FOR TESTING
SQUARE_WEBHOOK_SECRET=your_sandbox_webhook_secret_here
SQUARE_APPLICATION_ID=sandbox-sq0idp-your_sandbox_app_id_here
SQUARE_ACCESS_TOKEN=EAAAl-sandbox-your_sandbox_token_here
SQUARE_ENVIRONMENT=sandbox
SQUARE_API_VERSION=2025-05-21
```

### **Task 3: Create Sandbox Checkout Link (5 minutes)**

1. **In Square Dashboard** (make sure you're in Sandbox mode)
2. **Go to**: Items & Orders → Items
3. **Create new item**:
   - **Name**: `AI Chatbot Pro Plan (Sandbox Test)`
   - **Price**: `$497.00`
   - **Description**: `Test subscription for chatbot service`
4. **Go to**: Online → Square Online
5. **Create checkout link** for your test item
6. **Copy the sandbox checkout URL**

### **Task 4: Update Sandbox Checkout URL (1 minute)**

In `pages/index.tsx`, replace the sandbox placeholder:

```typescript
const SQUARE_CHECKOUT_URLS = {
  production: "https://square.link/u/AAt7dzT4",
  sandbox: "YOUR_SANDBOX_CHECKOUT_URL_HERE" // Replace this
};
```

### **Task 5: Configure Sandbox Webhook (3 minutes)**

1. **In Square Developer Dashboard** (Sandbox mode)
2. **Go to**: Webhooks tab
3. **Create New Webhook**:
   - **Endpoint URL**: `http://localhost:3000/api/square` (for local testing)
   - **API Version**: `2025-05-21`
   - **Events to Subscribe**:
     - ✅ `payment.created`
     - ✅ `payment.updated`
     - ✅ `subscription.created`
     - ✅ `subscription.updated`
     - ✅ `subscription.canceled`

### **Task 6: Test Complete Flow (10 minutes)**

#### **Start Local Development**:
```bash
npm run dev
```

#### **Run Integration Test**:
```bash
node test-sandbox-integration.js
```

#### **Test Payment Flow**:
1. **Visit**: http://localhost:3000
2. **Fill out form** with test data
3. **Click**: "🚀 Start Your Subscription Now"
4. **Complete payment** with test card:
   ```
   Card: 4111 1111 1111 1111
   Exp: 12/25
   CVV: 123
   ZIP: 12345
   ```

#### **Monitor Webhook Events**:
- **Watch terminal** for webhook logs
- **Check Airtable** for form submissions
- **Verify payment** in Square Sandbox Dashboard

## 🎯 **Expected Test Results**

### **Successful Form Submission**:
```json
{
  "success": true,
  "message": "Form submitted successfully! We'll be in touch within 24 hours.",
  "data": {
    "submissionId": "CB-1234567890",
    "businessName": "Sandbox Test Business",
    "estimatedDelivery": "2025-06-01T12:00:00.000Z"
  }
}
```

### **Successful Webhook Reception**:
```
🔔 Square Webhook Received:
Environment: SANDBOX
Event Type: payment.created
Event ID: evt_sandbox_123456
💰 Payment Created: pay_sandbox_789012
💰 Amount: { amount: 49700, currency: 'USD' }
💰 Status: COMPLETED
```

## 🔄 **Switch Back to Production**

When testing is complete:

1. **Update `.env.local`** with production credentials
2. **Update checkout URL** to production
3. **Deploy to Vercel** with production environment variables
4. **Update webhook URL** in Square to production endpoint

## 🚨 **Important Notes**

- **Sandbox transactions are fake** - no real money involved
- **Test cards only work in sandbox** environment
- **Webhook events are simulated** but follow same structure
- **Always test in sandbox first** before going live

## 📞 **Ready to Test!**

Complete the 6 tasks above, then you'll have a fully functional sandbox environment for testing your Square payment integration safely! 🧪✅
