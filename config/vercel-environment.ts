// Vercel Environment Configuration for 4-Tier Subscription System
// This file generates the complete environment variable configuration for deployment

export interface VercelEnvironmentConfig {
  name: string;
  value: string;
  target: ('production' | 'preview' | 'development')[];
  type: 'encrypted' | 'plain';
  comment?: string;
}

export const REQUIRED_VERCEL_ENVIRONMENT_VARIABLES: VercelEnvironmentConfig[] = [
  // Square Core Configuration
  {
    name: 'SQUARE_ENVIRONMENT',
    value: 'production',
    target: ['production'],
    type: 'plain',
    comment: 'Square API environment (production/sandbox)'
  },
  {
    name: 'SQUARE_ACCESS_TOKEN',
    value: 'EAAAl0BMtPQHgOCZ4uOaWuFZuZI-h_3aNFITJ9m-RUJjPl5z0bkGlBGhNkN3bKrG', // Placeholder - replace with actual
    target: ['production'],
    type: 'encrypted',
    comment: 'Square production access token'
  },
  {
    name: 'SQUARE_WEBHOOK_SECRET',
    value: 'xfjiT4w2X_jdnAMfKDu9rPGhlEYWx2-cJ-mxkbAshvQ', // Placeholder - replace with actual
    target: ['production'],
    type: 'encrypted',
    comment: 'Square webhook signature verification secret'
  },
  
  // Enhanced Checkout URLs for 4-Tier System
  {
    name: 'SQUARE_CHECKOUT_URL',
    value: 'https://square.link/u/AAt7dzT4',
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Default Square checkout URL (legacy basic plan)'
  },
  {
    name: 'SQUARE_CHECKOUT_URL_PREMIUM',
    value: 'https://square.link/u/AAt7dzT4', // Will be updated with specific premium URL
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Square checkout URL for premium plan ($497/month)'
  },
  {
    name: 'SQUARE_STANDARD_CHECKOUT_URL',
    value: 'https://square.link/u/STANDARD297', // To be created
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Square checkout URL for standard monthly plan ($297/month)'
  },
  {
    name: 'SQUARE_FIRST_MONTH_CHECKOUT_URL',
    value: 'https://square.link/u/FIRST147', // To be created
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Square checkout URL for first month special ($147 first month)'
  },
  {
    name: 'SQUARE_TODAY_ONLY_CHECKOUT_URL',
    value: 'https://square.link/u/TODAY197', // To be created
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Square checkout URL for today only special ($197/month)'
  },
  {
    name: 'SQUARE_PREMIUM_CHECKOUT_URL',
    value: 'https://square.link/u/PREMIUM497', // To be created
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Square checkout URL for premium plan ($497/month)'
  },
  
  // Sandbox Configuration
  {
    name: 'SQUARE_CHECKOUT_URL_SANDBOX',
    value: 'https://square.link/u/duE0KIaE',
    target: ['development', 'preview'],
    type: 'plain',
    comment: 'Square sandbox checkout URL for testing'
  },
  {
    name: 'SQUARE_WEBHOOK_SECRET_SANDBOX',
    value: 'sandbox_webhook_secret_placeholder',
    target: ['development', 'preview'],
    type: 'encrypted',
    comment: 'Square sandbox webhook secret for testing'
  },
  
  // Airtable Configuration
  {
    name: 'AIRTABLE_API_KEY',
    value: 'patxXxXxXxXxXxXxXxXxXx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    target: ['production', 'preview'],
    type: 'encrypted',
    comment: 'Airtable API key for lead and customer management'
  },
  {
    name: 'AIRTABLE_BASE_ID',
    value: 'appXxXxXxXxXxXxXx',
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Airtable base ID for customer data'
  },
  {
    name: 'AIRTABLE_TABLE_NAME',
    value: 'Leads',
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Airtable table name for lead storage'
  },
  
  // Feature Flags for Controlled Deployment
  {
    name: 'NEXT_PUBLIC_ENABLE_NEW_PRICING',
    value: 'false',
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Enable 4-tier pricing system (false for initial deployment)'
  },
  {
    name: 'NEXT_PUBLIC_ENABLE_FIRST_MONTH_PROMO',
    value: 'false',
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Enable first month promotional pricing'
  },
  {
    name: 'NEXT_PUBLIC_ENABLE_TODAY_ONLY_PROMO',
    value: 'false',
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Enable today only promotional pricing'
  },
  {
    name: 'NEXT_PUBLIC_ENABLE_WEEKEND_SPECIAL',
    value: 'false',
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Enable weekend special pricing'
  },
  {
    name: 'NEXT_PUBLIC_ENABLE_ANALYTICS',
    value: 'true',
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'Enable analytics tracking'
  },
  
  // Analytics Configuration
  {
    name: 'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
    value: 'G-XXXXXXXXXX',
    target: ['production'],
    type: 'plain',
    comment: 'Google Analytics measurement ID'
  },
  {
    name: 'NEXT_PUBLIC_FACEBOOK_PIXEL_ID',
    value: '123456789012345',
    target: ['production'],
    type: 'plain',
    comment: 'Facebook Pixel ID for conversion tracking'
  },
  
  // Application Configuration
  {
    name: 'NEXT_PUBLIC_APP_URL',
    value: 'https://aichatbotsolutions.io',
    target: ['production'],
    type: 'plain',
    comment: 'Production application URL'
  },
  {
    name: 'NODE_ENV',
    value: 'production',
    target: ['production'],
    type: 'plain',
    comment: 'Node.js environment'
  },
  
  // Email Service Configuration
  {
    name: 'EMAILJS_SERVICE_ID',
    value: 'service_xxxxxxxx',
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'EmailJS service ID for notifications'
  },
  {
    name: 'EMAILJS_TEMPLATE_ID',
    value: 'template_xxxxxxxx',
    target: ['production', 'preview'],
    type: 'plain',
    comment: 'EmailJS template ID for customer emails'
  },
  {
    name: 'EMAILJS_USER_ID',
    value: 'user_xxxxxxxxxxxxxxxx',
    target: ['production', 'preview'],
    type: 'encrypted',
    comment: 'EmailJS user ID for authentication'
  }
];

export function generateVercelEnvironmentScript(): string {
  const commands: string[] = [
    '#!/bin/bash',
    '# Vercel Environment Variable Configuration Script',
    '# Generated for 4-Tier Subscription System Deployment',
    '',
    'echo "🚀 Configuring Vercel environment variables..."',
    ''
  ];
  
  REQUIRED_VERCEL_ENVIRONMENT_VARIABLES.forEach(envVar => {
    const targets = envVar.target.join(' ');
    const comment = envVar.comment ? ` # ${envVar.comment}` : '';
    
    commands.push(`echo "Setting ${envVar.name}..."${comment}`);
    commands.push(`vercel env add ${envVar.name} ${envVar.value} ${targets}`);
    commands.push('');
  });
  
  commands.push('echo "✅ Environment variables configured successfully!"');
  commands.push('echo "⚠️  Remember to:"');
  commands.push('echo "   1. Update checkout URLs with actual Square links"');
  commands.push('echo "   2. Replace placeholder tokens with real values"');
  commands.push('echo "   3. Test all payment flows before enabling new pricing"');
  
  return commands.join('\n');
}

export function validateEnvironmentConfiguration(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for placeholder values that need to be replaced
  const placeholderPatterns = [
    'placeholder',
    'xxxxxxxx',
    'XxXxXx',
    'STANDARD297',
    'FIRST147',
    'TODAY197',
    'PREMIUM497'
  ];
  
  REQUIRED_VERCEL_ENVIRONMENT_VARIABLES.forEach(envVar => {
    placeholderPatterns.forEach(pattern => {
      if (envVar.value.includes(pattern)) {
        issues.push(`${envVar.name} contains placeholder value: ${envVar.value}`);
      }
    });
    
    // Check required fields
    if (!envVar.name || !envVar.value) {
      issues.push(`Environment variable missing name or value: ${envVar.name}`);
    }
    
    // Validate URL format for checkout URLs
    if (envVar.name.includes('CHECKOUT_URL') && !envVar.value.startsWith('https://square.link/')) {
      issues.push(`Invalid checkout URL format for ${envVar.name}: ${envVar.value}`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

export function getEnvironmentSummary(): string {
  const production = REQUIRED_VERCEL_ENVIRONMENT_VARIABLES.filter(v => v.target.includes('production'));
  const preview = REQUIRED_VERCEL_ENVIRONMENT_VARIABLES.filter(v => v.target.includes('preview'));
  const development = REQUIRED_VERCEL_ENVIRONMENT_VARIABLES.filter(v => v.target.includes('development'));
  
  return `Environment Configuration Summary:
- Production variables: ${production.length}
- Preview variables: ${preview.length}
- Development variables: ${development.length}
- Total unique variables: ${REQUIRED_VERCEL_ENVIRONMENT_VARIABLES.length}

Feature Flags (initially disabled for controlled deployment):
- NEXT_PUBLIC_ENABLE_NEW_PRICING: false
- NEXT_PUBLIC_ENABLE_FIRST_MONTH_PROMO: false
- NEXT_PUBLIC_ENABLE_TODAY_ONLY_PROMO: false
- NEXT_PUBLIC_ENABLE_WEEKEND_SPECIAL: false

Checkout URLs to be created:
- Standard Monthly ($297): SQUARE_STANDARD_CHECKOUT_URL
- First Month Special ($147): SQUARE_FIRST_MONTH_CHECKOUT_URL
- Today Only Special ($197): SQUARE_TODAY_ONLY_CHECKOUT_URL
- Premium Plan ($497): SQUARE_PREMIUM_CHECKOUT_URL`;
}