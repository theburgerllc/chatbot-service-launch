# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Core development
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint validation
npm run validate     # Combined build + lint

# Deployment
npm run deploy       # Automated deployment (build + commit + push)
./deploy.bat         # Windows deployment script
./deploy-production.bat  # Production deployment with verification

# Testing integrations
node test-airtable-integration.js    # Test Airtable connection
node test-sandbox-integration.js     # Test Square sandbox
node test-webhook-signature.js       # Test webhook verification
```

## Architecture Overview

This is a **Next.js TypeScript chatbot service sales funnel** with payment-first architecture. Users must pay before configuring their chatbot.

### Customer Journey Flow
1. **Homepage** (`pages/index.tsx`) → Landing page with payment CTAs
2. **Payment** → Square checkout for $497/month subscription
3. **Configuration** (`pages/configure.tsx`) → Post-payment chatbot setup
4. **Success** (`pages/success.tsx`) → Completion confirmation

### Key API Routes
- `/api/verify-payment` - Creates Square payment sessions
- `/api/square` - Webhook handler for payment events
- `/api/lead-capture` - Stores leads in Airtable
- `/api/submit` - Full chatbot configuration submission
- `/api/debug-env` - Environment variable debugging

### Data Storage
- **Airtable**: Leads and chatbot configurations
- **Session Storage**: Payment session management (24hr expiry)
- **Square**: Subscription payment processing

## Critical Environment Variables

```env
# Required for production
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
SQUARE_ENVIRONMENT=production
SQUARE_WEBHOOK_SECRET=
SQUARE_CHECKOUT_URL=
SQUARE_CHECKOUT_URL_PREMIUM=

# Sandbox testing
SQUARE_WEBHOOK_SECRET_SANDBOX=
SQUARE_CHECKOUT_URL_SANDBOX=

# Email notifications
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
```

Check `/api/debug-env` to verify environment setup.

## Development Patterns

### API Route Security Pattern
All API routes include:
- CORS headers with XSS protection
- HTTP method validation
- Input validation with error handling
- Graceful degradation for external service failures

### Payment Integration
- **Payment-first model**: Configuration only after successful payment
- **Dual subscription plans**: Basic/Premium both $497/month
- **Session verification**: Uses Square session IDs for access control
- **Webhook validation**: Cryptographic signature verification

### Form Handling
- **React Hook Form**: Client-side validation
- **TypeScript interfaces**: Strict typing for form data
- **Error states**: Real-time validation feedback
- **Session persistence**: Data survives payment redirects

## Testing & Debugging

Use the test scripts to verify integrations:
- Run `node test-airtable-integration.js` if lead capture fails
- Run `node test-sandbox-integration.js` for payment testing
- Check `/api/debug-env` for environment issues
- Verify webhook signatures with `test-webhook-signature.js`

## Deployment

Configured for **Vercel** with automated deployments from main branch. Security headers and function timeouts are configured in `vercel.json`.

Environment variables must be set in Vercel dashboard - they are not automatically synced from `.env.local`.