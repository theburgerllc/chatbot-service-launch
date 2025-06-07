// Application constants for the 4-tier subscription system

export const PLAN_IDS = {
  STANDARD_MONTHLY: 'standard_monthly',
  FIRST_MONTH_SPECIAL: 'first_month_special', 
  TODAY_ONLY_SPECIAL: 'today_only_special',
  PREMIUM_PLAN: 'premium_plan',
  // Legacy plan IDs for backward compatibility
  BASIC: 'basic',
  PREMIUM: 'premium'
} as const;

export const PLAN_TYPES = {
  STANDARD: 'standard',
  PROMOTIONAL: 'promotional', 
  PREMIUM: 'premium'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

export const WEBHOOK_EVENTS = {
  PAYMENT_CREATED: 'payment.created',
  PAYMENT_UPDATED: 'payment.updated',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPDATED: 'subscription.updated'
} as const;

export const CAMPAIGN_TYPES = {
  FIRST_MONTH_PROMO: 'first_month_promo',
  TODAY_ONLY_PROMO: 'today_only_promo',
  WEEKEND_SPECIAL: 'weekend_special'
} as const;

export const ANALYTICS_EVENTS = {
  PLAN_SELECTED: 'plan_selected',
  PAYMENT_STARTED: 'payment_started',
  PAYMENT_COMPLETED: 'payment_completed',
  CAMPAIGN_VIEWED: 'campaign_viewed',
  FORM_SUBMITTED: 'form_submitted',
  CHECKOUT_INITIATED: 'checkout_initiated'
} as const;

export const API_ENDPOINTS = {
  VERIFY_PAYMENT: '/api/verify-payment',
  SQUARE_WEBHOOK: '/api/square',
  SUBMIT_FORM: '/api/submit',
  LEAD_CAPTURE: '/api/lead-capture',
  ANALYTICS: '/api/analytics',
  DEBUG_ENV: '/api/debug-env'
} as const;

export const REDIRECT_URLS = {
  CONFIGURE: '/configure',
  SUCCESS: '/success',
  HOME: '/',
  PRICING: '/#pricing'
} as const;

export const SESSION_KEYS = {
  SELECTED_PLAN: 'selectedPlan',
  PLAN_PRICE: 'planPrice', 
  PLAN_TYPE: 'planType',
  ORIGINAL_PRICE: 'originalPrice',
  SAVINGS: 'savings',
  CAMPAIGN_ID: 'campaignId',
  LEAD_ID: 'leadId',
  PAYMENT_SESSION: 'paymentSession',
  CAMPAIGN_INTERACTIONS: 'campaignInteractions'
} as const;

export const ENVIRONMENT_VARIABLES = {
  // Square Configuration
  SQUARE_ENVIRONMENT: 'SQUARE_ENVIRONMENT',
  SQUARE_ACCESS_TOKEN: 'SQUARE_ACCESS_TOKEN',
  SQUARE_WEBHOOK_SECRET: 'SQUARE_WEBHOOK_SECRET',
  SQUARE_WEBHOOK_SECRET_SANDBOX: 'SQUARE_WEBHOOK_SECRET_SANDBOX',
  SQUARE_CHECKOUT_URL: 'SQUARE_CHECKOUT_URL',
  SQUARE_CHECKOUT_URL_PREMIUM: 'SQUARE_CHECKOUT_URL_PREMIUM',
  SQUARE_CHECKOUT_URL_SANDBOX: 'SQUARE_CHECKOUT_URL_SANDBOX',
  
  // New checkout URLs for 4-tier system
  SQUARE_STANDARD_CHECKOUT_URL: 'SQUARE_STANDARD_CHECKOUT_URL',
  SQUARE_FIRST_MONTH_CHECKOUT_URL: 'SQUARE_FIRST_MONTH_CHECKOUT_URL',
  SQUARE_TODAY_ONLY_CHECKOUT_URL: 'SQUARE_TODAY_ONLY_CHECKOUT_URL',
  SQUARE_PREMIUM_CHECKOUT_URL: 'SQUARE_PREMIUM_CHECKOUT_URL',
  
  // Airtable Configuration
  AIRTABLE_API_KEY: 'AIRTABLE_API_KEY',
  AIRTABLE_BASE_ID: 'AIRTABLE_BASE_ID',
  AIRTABLE_TABLE_NAME: 'AIRTABLE_TABLE_NAME',
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_NEW_PRICING: 'NEXT_PUBLIC_ENABLE_NEW_PRICING',
  NEXT_PUBLIC_ENABLE_FIRST_MONTH_PROMO: 'NEXT_PUBLIC_ENABLE_FIRST_MONTH_PROMO',
  NEXT_PUBLIC_ENABLE_TODAY_ONLY_PROMO: 'NEXT_PUBLIC_ENABLE_TODAY_ONLY_PROMO',
  NEXT_PUBLIC_ENABLE_WEEKEND_SPECIAL: 'NEXT_PUBLIC_ENABLE_WEEKEND_SPECIAL',
  NEXT_PUBLIC_ENABLE_ANALYTICS: 'NEXT_PUBLIC_ENABLE_ANALYTICS',
  
  // Analytics
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: 'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
  NEXT_PUBLIC_FACEBOOK_PIXEL_ID: 'NEXT_PUBLIC_FACEBOOK_PIXEL_ID',
  
  // Email Service
  EMAILJS_SERVICE_ID: 'EMAILJS_SERVICE_ID',
  EMAILJS_TEMPLATE_ID: 'EMAILJS_TEMPLATE_ID',
  EMAILJS_USER_ID: 'EMAILJS_USER_ID'
} as const;

export const ERROR_MESSAGES = {
  INVALID_PLAN: 'Invalid subscription plan selected',
  MISSING_AMOUNT: 'Payment amount is required',
  SESSION_EXPIRED: 'Payment session has expired',
  SESSION_NOT_FOUND: 'Payment session not found',
  INVALID_SESSION: 'Invalid payment session',
  WEBHOOK_SIGNATURE_INVALID: 'Invalid webhook signature',
  PAYMENT_FAILED: 'Payment processing failed',
  FORM_VALIDATION_FAILED: 'Please check your form entries',
  NETWORK_ERROR: 'Network error - please try again',
  UNKNOWN_ERROR: 'An unexpected error occurred'
} as const;

export const SUCCESS_MESSAGES = {
  PAYMENT_SESSION_CREATED: 'Payment session created successfully',
  WEBHOOK_PROCESSED: 'Webhook processed successfully',
  FORM_SUBMITTED: 'Form submitted successfully',
  LEAD_CAPTURED: 'Lead information captured',
  PAYMENT_COMPLETED: 'Payment completed successfully'
} as const;

export const PRICING_CONSTANTS = {
  CURRENCY: 'USD',
  CENTS_PER_DOLLAR: 100,
  SESSION_EXPIRY_HOURS: 24,
  DEFAULT_PLAN: PLAN_IDS.STANDARD_MONTHLY,
  LEGACY_PRICE: 497, // Legacy plan price for compatibility
  MIN_PRICE: 147, // Minimum promotional price
  MAX_PRICE: 497  // Maximum premium price
} as const;

export const BUSINESS_RULES = {
  MIN_BUSINESS_NAME_LENGTH: 2,
  MAX_BUSINESS_NAME_LENGTH: 100,
  MIN_FAQ_LENGTH: 10,
  MAX_FAQ_LENGTH: 500,
  MIN_BUSINESS_HOURS_LENGTH: 5,
  MAX_BUSINESS_HOURS_LENGTH: 200,
  SESSION_CLEANUP_INTERVAL_MS: 3600000, // 1 hour
  MAX_SESSION_STORAGE_ITEMS: 50
} as const;