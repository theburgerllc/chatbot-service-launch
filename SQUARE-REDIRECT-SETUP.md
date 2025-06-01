# 🔄 Square Checkout Redirect Configuration

## Overview

This guide explains how to configure Square checkout to redirect customers to the chatbot configuration page after successful payment.

## 🎯 Goal

After payment completion, customers should be redirected to:
```
https://your-domain.com/configure?payment_success=true&session_id=PAYMENT_ID
```

## 🛠️ Setup Instructions

### Step 1: Configure Square Checkout Redirect URL

1. **Go to Square Dashboard**: [squareup.com/dashboard](https://squareup.com/dashboard)
2. **Navigate to**: Online → Square Online → Checkout Links
3. **Edit your existing checkout link** or create a new one
4. **Set Redirect URL**: 
   - **Success URL**: `https://chatbot-service-launch.vercel.app/configure?payment_success=true`
   - **Cancel URL**: `https://chatbot-service-launch.vercel.app/?payment_cancelled=true`

### Step 2: Update Checkout Link in Code

If you create a new checkout link, update the URL in `pages/index.tsx`:

```typescript
const SQUARE_CHECKOUT_URLS = {
  production: "YOUR_NEW_CHECKOUT_URL_WITH_REDIRECT",
  sandbox: "YOUR_SANDBOX_CHECKOUT_URL_WITH_REDIRECT"
};
```

### Step 3: Test the Flow

1. **Visit your website**: https://chatbot-service-launch.vercel.app/
2. **Click**: "🚀 Start Your Subscription Now"
3. **Complete payment** (use test card in sandbox: `4111 1111 1111 1111`)
4. **Verify redirect** to `/configure?payment_success=true`
5. **Fill out configuration form**
6. **Verify final redirect** to `/success?configured=true`

## 🔄 Complete Customer Journey

### New Flow (Fixed):
1. **Customer visits homepage** → Sees lead capture form and payment CTA
2. **Customer clicks payment button** → Goes to Square checkout
3. **Customer completes payment** → Redirected to `/configure?payment_success=true`
4. **Customer fills configuration form** → Detailed chatbot setup
5. **Customer submits form** → Redirected to `/success?configured=true`
6. **Success page shows** → "Your chatbot is being built!"

### Old Flow (Broken):
1. ❌ Customer could see configuration questions without paying
2. ❌ Customer could submit form and get "success" without payment
3. ❌ No connection between payment and configuration

## 🎨 UI Changes Made

### Homepage (`pages/index.tsx`):
- ✅ Removed detailed configuration form
- ✅ Added simple lead capture form
- ✅ Enhanced payment CTA section
- ✅ Clear call-to-action flow

### Configuration Page (`pages/configure.tsx`):
- ✅ New protected page requiring payment
- ✅ Session validation (24-hour window)
- ✅ Progress indicator showing payment → configure → go live
- ✅ Detailed configuration form (moved from homepage)

### Success Page (`pages/success.tsx`):
- ✅ Two different success states:
  - **Configured**: Full success after payment + configuration
  - **Not Configured**: Reminder to complete payment

### Form Component (`components/Form.tsx`):
- ✅ Smart redirect based on current page
- ✅ Different success flows for different contexts

## 🔒 Security Features

### Payment Verification:
- ✅ URL parameter validation (`payment_success=true`)
- ✅ Session storage with 24-hour expiry
- ✅ Protected configuration page
- ✅ Fallback to payment reminder

### Session Management:
```javascript
// Saves session after successful payment
const sessionData = {
  sessionId: router.query.session_id,
  timestamp: new Date().toISOString(),
  paymentVerified: true
};
localStorage.setItem('chatbot_config_session', JSON.stringify(sessionData));
```

## 🚨 Important Notes

### Square Checkout Limitations:
- Square checkout redirect URLs must be configured in the Square dashboard
- You cannot dynamically change redirect URLs via API
- Each checkout link has a fixed redirect URL

### Alternative Solutions:
If you need dynamic redirects, consider:
1. **Square Web Payments SDK**: More control but requires custom implementation
2. **Intermediate landing page**: Redirect to a page that then redirects based on logic
3. **Webhook-based flow**: Use webhooks to trigger email with configuration link

## 🧪 Testing Checklist

- [ ] Homepage shows lead capture form (not detailed config)
- [ ] Payment button goes to Square checkout
- [ ] Square checkout redirects to `/configure?payment_success=true`
- [ ] Configuration page validates payment and shows form
- [ ] Form submission redirects to `/success?configured=true`
- [ ] Success page shows appropriate message
- [ ] Unauthorized access to `/configure` shows payment required message
- [ ] Session expires after 24 hours

## 🔧 Troubleshooting

### If redirect doesn't work:
1. Check Square dashboard redirect URL configuration
2. Verify the checkout link includes redirect parameters
3. Test with sandbox environment first

### If session validation fails:
1. Check browser localStorage for session data
2. Verify 24-hour expiry logic
3. Clear localStorage and test fresh flow

### If form doesn't submit:
1. Check API endpoint `/api/submit`
2. Verify Airtable integration
3. Check browser console for errors

## 🎉 Benefits of New Flow

✅ **Security**: No configuration access without payment
✅ **Clarity**: Clear payment-first flow
✅ **Conversion**: Simplified homepage with focused CTA
✅ **User Experience**: Logical step-by-step process
✅ **Business Logic**: Payment required before service delivery
