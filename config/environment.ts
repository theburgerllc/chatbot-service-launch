export const environment = {
  // Square Configuration
  square: {
    environment: process.env.SQUARE_ENVIRONMENT || 'sandbox',
    accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
    webhookSecret: process.env.SQUARE_WEBHOOK_SECRET || '',
    webhookSecretSandbox: process.env.SQUARE_WEBHOOK_SECRET_SANDBOX || '',
    checkoutUrl: process.env.SQUARE_CHECKOUT_URL || '',
    checkoutUrlPremium: process.env.SQUARE_CHECKOUT_URL_PREMIUM || ''
  },

  // Airtable Configuration
  airtable: {
    apiKey: process.env.AIRTABLE_API_KEY || '',
    baseId: process.env.AIRTABLE_BASE_ID || ''
  },

  // Email Configuration
  email: {
    serviceId: process.env.EMAILJS_SERVICE_ID || '',
    templateId: process.env.EMAILJS_TEMPLATE_ID || '',
    userId: process.env.EMAILJS_USER_ID || ''
  },

  // Analytics Configuration
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || ''
  },

  // Feature Flags
  features: {
    enableFirstMonthPromo: process.env.NEXT_PUBLIC_ENABLE_FIRST_MONTH_PROMO === 'true',
    enableTodayOnlyPromo: process.env.NEXT_PUBLIC_ENABLE_TODAY_ONLY_PROMO === 'true',
    enableWeekendSpecial: process.env.NEXT_PUBLIC_ENABLE_WEEKEND_SPECIAL === 'true',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
  },

  // Application Configuration
  app: {
    environment: process.env.NODE_ENV || 'development',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    version: process.env.npm_package_version || '1.0.0'
  }
};

export const isProduction = environment.app.environment === 'production';
export const isDevelopment = environment.app.environment === 'development';