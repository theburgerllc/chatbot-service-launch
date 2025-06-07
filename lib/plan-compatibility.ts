import { EnhancedSubscriptionPlan } from '@/types';

export const PLAN_MIGRATION_MAP = {
  'basic': 'standard_monthly',
  'premium': 'premium_plan',
  'standard_monthly': 'standard_monthly', 
  'first_month_special': 'first_month_special',
  'today_only_special': 'today_only_special',
  'premium_plan': 'premium_plan'
} as const;

export const PLAN_PRICING_MAP = {
  'basic': 497,
  'premium': 497,
  'standard_monthly': 297,
  'first_month_special': 147,
  'today_only_special': 197,
  'premium_plan': 497
} as const;

export function getPlanPrice(planId: string): number {
  return PLAN_PRICING_MAP[planId as keyof typeof PLAN_PRICING_MAP] || 297;
}

export function getPlanType(planId: string): string {
  const typeMap = {
    'basic': 'standard',
    'premium': 'premium',
    'standard_monthly': 'standard', 
    'first_month_special': 'promotional',
    'today_only_special': 'promotional',
    'premium_plan': 'premium'
  };
  return typeMap[planId as keyof typeof typeMap] || 'standard';
}

export function getLegacyPlanId(planId: string): string {
  const legacyMap = {
    'standard_monthly': 'basic',
    'first_month_special': 'basic',
    'today_only_special': 'basic',
    'premium_plan': 'premium',
    'basic': 'basic', 
    'premium': 'premium'
  };
  return legacyMap[planId as keyof typeof legacyMap] || 'basic';
}

export function getSquareCheckoutUrl(planId: string): string {
  const existingUrl = process.env.SQUARE_CHECKOUT_URL || 'https://square.link/u/AAt7dzT4';
  
  const checkoutUrls = {
    'basic': existingUrl,
    'premium': process.env.SQUARE_CHECKOUT_URL_PREMIUM || existingUrl,
    'standard_monthly': process.env.SQUARE_STANDARD_CHECKOUT_URL || existingUrl,
    'first_month_special': process.env.SQUARE_FIRST_MONTH_CHECKOUT_URL || existingUrl,
    'today_only_special': process.env.SQUARE_TODAY_ONLY_CHECKOUT_URL || existingUrl,
    'premium_plan': process.env.SQUARE_PREMIUM_CHECKOUT_URL || existingUrl
  };
  
  return checkoutUrls[planId as keyof typeof checkoutUrls] || existingUrl;
}

export function getCampaignConfig() {
  return {
    firstMonthPromo: process.env.NEXT_PUBLIC_ENABLE_FIRST_MONTH_PROMO === 'true',
    todayOnlyPromo: process.env.NEXT_PUBLIC_ENABLE_TODAY_ONLY_PROMO === 'true',
    weekendSpecial: process.env.NEXT_PUBLIC_ENABLE_WEEKEND_SPECIAL === 'true'
  };
}

export const ENHANCED_SUBSCRIPTION_PLANS: EnhancedSubscriptionPlan[] = [
  {
    id: 'standard_monthly',
    name: 'AI Chatbot Standard',
    price: 297,
    frequency: 'month',
    description: 'Perfect for growing businesses',
    features: [
      'Custom AI chatbot for your website',
      '24/7 automated customer support',
      'Integration with your existing systems',
      'Analytics and reporting dashboard',
      'Email support'
    ],
    checkoutUrl: process.env.SQUARE_CHECKOUT_URL || '',
    planType: 'standard',
    legacyPlanId: 'basic'
  },
  {
    id: 'first_month_special',
    name: 'First Month Special',
    price: 147,
    originalPrice: 297,
    frequency: 'month',
    description: 'Try our standard plan with 50% off first month',
    features: [
      'Everything in Standard plan',
      '50% off first month only',
      'Then $297/month after first month'
    ],
    checkoutUrl: process.env.SQUARE_CHECKOUT_URL || '',
    planType: 'promotional',
    badge: 'Limited Time',
    savingsAmount: 150,
    savingsPercentage: 50,
    legacyPlanId: 'basic'
  },
  {
    id: 'today_only_special',
    name: 'Today Only Special',
    price: 197,
    originalPrice: 297,
    frequency: 'month',
    description: 'Special pricing available today only',
    features: [
      'Everything in Standard plan',
      'Locked-in pricing for life',
      'Save $100/month forever'
    ],
    checkoutUrl: process.env.SQUARE_CHECKOUT_URL || '',
    planType: 'promotional',
    badge: 'Today Only',
    urgency: 'Expires at midnight!',
    savingsAmount: 100,
    savingsPercentage: 34,
    popular: true,
    legacyPlanId: 'basic'
  },
  {
    id: 'premium_plan',
    name: 'AI Chatbot Premium',
    price: 497,
    frequency: 'month',
    description: 'Advanced features for enterprise businesses',
    features: [
      'Everything in Standard plan',
      'Priority support and setup',
      'Advanced customization options',
      'Multi-language support',
      'Custom integrations',
      'Dedicated account manager'
    ],
    checkoutUrl: process.env.SQUARE_CHECKOUT_URL_PREMIUM || '',
    planType: 'premium',
    legacyPlanId: 'premium'
  }
];

export function getPlanById(planId: string): EnhancedSubscriptionPlan | undefined {
  return ENHANCED_SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

export function getCheckoutUrlForPlan(planId: string): string {
  const plan = getPlanById(planId);
  return plan?.checkoutUrl || process.env.SQUARE_CHECKOUT_URL || '';
}