# 🚀 Vercel Environment Variables Setup

## ✅ Current Status

- ✅ **Sandbox Webhook Signature**: `AyQY3lSEd--B4QuTKQmVAQ`
- ✅ **Sandbox Checkout URL**: `https://square.link/u/duE0KIaE`
- ✅ **Local Testing**: Webhook working with signature verification
- ❌ **Vercel Environment**: Needs sandbox variables added

## 🔧 Add Environment Variables to Vercel

### **Step 1: Go to Vercel Dashboard**
1. **Visit**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click**: `chatbot-service-launch` project
3. **Go to**: Settings → Environment Variables

### **Step 2: Add These Sandbox Variables**

**Add each variable individually:**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `SQUARE_WEBHOOK_SECRET_SANDBOX` | `AyQY3lSEd--B4QuTKQmVAQ` | Production |
| `SQUARE_APPLICATION_ID_SANDBOX` | `sandbox-sq0idb-9pQyEUDoGVX7ah18DT9v6Q` | Production |
| `SQUARE_ACCESS_TOKEN_SANDBOX` | `EAAAl4keViOp-6oFpPvPi1bhbdRT1LCrd4PQR2sPuSbS9W93_lJPY6Pd47TuOtXV` | Production |
| `SQUARE_ENVIRONMENT` | `sandbox` | Production |
| `SQUARE_API_VERSION` | `2025-05-21` | Production |

### **Step 3: Redeploy**

After adding variables:
1. **Go to**: Deployments tab
2. **Click**: "Redeploy" on latest deployment
3. **Wait**: For deployment to complete

## 🧪 Test Complete Flow

### **After Vercel Variables Are Added:**

1. **Visit**: https://chatbot-service-launch.vercel.app/
2. **Fill out form**: Use test business information
3. **Submit form**: Should save to Airtable
4. **Click**: "🚀 Start Your Subscription Now"
5. **Complete payment**: Use test card details below

### **Test Card Details:**
```
Card Number: 4111 1111 1111 1111
Expiration: 12/25
CVV: 123
ZIP: 12345
Name: Test Customer
```

### **Expected Flow:**
1. **Form submission** → Saves to Airtable
2. **Payment button** → Redirects to sandbox checkout
3. **Payment completion** → Triggers webhook
4. **Webhook received** → Logs in Vercel functions
5. **Status update** → Customer marked as paid

## 📊 Monitor Results

### **Check Airtable:**
- New record with form data
- Status should update after payment

### **Check Vercel Function Logs:**
1. **Vercel Dashboard** → Your Project → Functions
2. **Click**: `/api/square`
3. **View**: Real-time webhook logs

### **Expected Webhook Log:**
```
🔔 Square Webhook Received:
Environment: SANDBOX
Event Type: payment.created
✅ Webhook signature verified
💰 Payment Created: sandbox-payment-123
💰 Amount: { amount: 49700, currency: 'USD' }
💰 Status: COMPLETED
```

## 🎯 Success Criteria

- ✅ Form saves to Airtable
- ✅ Payment redirects to sandbox checkout
- ✅ Payment completes with test card
- ✅ Webhook received and verified
- ✅ Payment logged in Vercel functions

## 🔄 Switch to Production

When sandbox testing is complete:

1. **Update Vercel environment variables**:
   - Change `SQUARE_ENVIRONMENT` to `production`
   - Use production webhook secret
   - Use production application ID and access token

2. **Update Square webhook URL**:
   - Change from sandbox to production
   - Update endpoint to production webhook

3. **Ready for real customers!**

## 📞 Next Steps

1. **Add the 5 environment variables to Vercel**
2. **Redeploy the application**
3. **Test the complete payment flow**
4. **Monitor webhook events**
5. **Celebrate successful integration!** 🎉
