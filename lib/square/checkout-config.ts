import { PLAN_IDS, ENVIRONMENT_VARIABLES } from '@/lib/utils/constants';
import { PRICING_TIERS } from '@/lib/utils/pricing';
import { createHmac } from 'node:crypto';

export interface SquareCheckoutConfig {
  planId: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
  description: string;
  webhookEndpoint: string;
  redirectUrl: string;
}

export interface SquareEnvironmentConfig {
  environment: 'production' | 'sandbox';
  accessToken: string;
  webhookSecret: string;
  baseCheckoutUrl: string;
}

// Enhanced checkout URL mapping for 4-tier subscription system
export const CHECKOUT_URL_MAPPING = {
  [PLAN_IDS.STANDARD_MONTHLY]: {
    envVar: ENVIRONMENT_VARIABLES.SQUARE_STANDARD_CHECKOUT_URL,
    fallback: ENVIRONMENT_VARIABLES.SQUARE_CHECKOUT_URL
  },
  [PLAN_IDS.FIRST_MONTH_SPECIAL]: {
    envVar: ENVIRONMENT_VARIABLES.SQUARE_FIRST_MONTH_CHECKOUT_URL,
    fallback: ENVIRONMENT_VARIABLES.SQUARE_CHECKOUT_URL
  },
  [PLAN_IDS.TODAY_ONLY_SPECIAL]: {
    envVar: ENVIRONMENT_VARIABLES.SQUARE_TODAY_ONLY_CHECKOUT_URL,
    fallback: ENVIRONMENT_VARIABLES.SQUARE_CHECKOUT_URL
  },
  [PLAN_IDS.PREMIUM_PLAN]: {
    envVar: ENVIRONMENT_VARIABLES.SQUARE_PREMIUM_CHECKOUT_URL,
    fallback: ENVIRONMENT_VARIABLES.SQUARE_CHECKOUT_URL_PREMIUM
  },
  // Legacy plan support
  [PLAN_IDS.BASIC]: {
    envVar: ENVIRONMENT_VARIABLES.SQUARE_CHECKOUT_URL,
    fallback: ENVIRONMENT_VARIABLES.SQUARE_CHECKOUT_URL
  },
  [PLAN_IDS.PREMIUM]: {
    envVar: ENVIRONMENT_VARIABLES.SQUARE_CHECKOUT_URL_PREMIUM,
    fallback: ENVIRONMENT_VARIABLES.SQUARE_CHECKOUT_URL
  }
} as const;

export function getSquareEnvironmentConfig(): SquareEnvironmentConfig {
  const isProduction = process.env.SQUARE_ENVIRONMENT === 'production';
  
  return {
    environment: isProduction ? 'production' : 'sandbox',
    accessToken: isProduction 
      ? process.env.SQUARE_ACCESS_TOKEN || ''
      : process.env.SQUARE_ACCESS_TOKEN_SANDBOX || process.env.SQUARE_ACCESS_TOKEN || '',
    webhookSecret: isProduction
      ? process.env.SQUARE_WEBHOOK_SECRET || ''
      : process.env.SQUARE_WEBHOOK_SECRET_SANDBOX || process.env.SQUARE_WEBHOOK_SECRET || '',
    baseCheckoutUrl: isProduction
      ? process.env.SQUARE_CHECKOUT_URL || ''
      : process.env.SQUARE_CHECKOUT_URL_SANDBOX || ''
  };
}

export function getCheckoutUrlForPlan(planId: string): string {
  const mapping = CHECKOUT_URL_MAPPING[planId as keyof typeof CHECKOUT_URL_MAPPING];
  
  if (!mapping) {
    console.warn(`Unknown plan ID: ${planId}, falling back to default checkout URL`);
    return process.env.SQUARE_CHECKOUT_URL || '';
  }
  
  // Try the specific environment variable first
  const specificUrl = process.env[mapping.envVar];
  if (specificUrl) {
    return specificUrl;
  }
  
  // Fall back to the fallback environment variable
  const fallbackUrl = process.env[mapping.fallback];
  if (fallbackUrl) {
    return fallbackUrl;
  }
  
  // Final fallback to default
  return process.env.SQUARE_CHECKOUT_URL || '';
}

export function createSquareCheckoutConfig(
  planId: string,
  sessionId: string,
  campaignId?: string
): SquareCheckoutConfig {
  const plan = Object.values(PRICING_TIERS).find(p => p.id === planId);
  
  if (!plan) {
    throw new Error(`Invalid plan ID: ${planId}`);
  }
  
  const baseUrl = getCheckoutUrlForPlan(planId);
  const webhookEndpoint = `${process.env.NEXT_PUBLIC_APP_URL || 'https://aichatbotsolutions.io'}/api/square`;
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://aichatbotsolutions.io'}/configure`;
  
  // Build query parameters for checkout URL
  const params = new URLSearchParams({
    session_id: sessionId,
    plan: planId,
    redirect_url: redirectUrl,
    webhook_url: webhookEndpoint
  });
  
  if (campaignId) {
    params.set('campaign', campaignId);
  }
  
  return {
    planId,
    checkoutUrl: `${baseUrl}?${params.toString()}`,
    amount: plan.basePrice,
    currency: 'USD',
    description: `${plan.name} - ${plan.description}`,
    webhookEndpoint,
    redirectUrl
  };
}

export function validateSquareConfiguration(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const config = getSquareEnvironmentConfig();
  
  // Check required configuration
  if (!config.accessToken) {
    issues.push('Square access token is not configured');
  }
  
  if (!config.webhookSecret) {
    issues.push('Square webhook secret is not configured');
  }
  
  if (!config.baseCheckoutUrl) {
    issues.push('Square base checkout URL is not configured');
  }
  
  // Check plan-specific checkout URLs
  for (const [planId, mapping] of Object.entries(CHECKOUT_URL_MAPPING)) {
    const url = process.env[mapping.envVar];
    if (!url) {
      issues.push(`Missing checkout URL for plan ${planId}: ${mapping.envVar}`);
    }
  }
  
  // Validate webhook endpoint accessibility
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    issues.push('NEXT_PUBLIC_APP_URL is not configured for webhook endpoint');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

export function getSquareApiHeaders(): Record<string, string> {
  const config = getSquareEnvironmentConfig();
  
  return {
    'Authorization': `Bearer ${config.accessToken}`,
    'Content-Type': 'application/json',
    'Square-Version': '2023-10-18', // Use latest Square API version
    'Accept': 'application/json'
  };
}

export function generateWebhookSignature(body: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(body)
    .digest('base64');
}

export function verifyWebhookSignature(
  signature: string, 
  body: string, 
  secret: string
): boolean {
  const expectedSignature = generateWebhookSignature(body, secret);
  return signature === expectedSignature;
}