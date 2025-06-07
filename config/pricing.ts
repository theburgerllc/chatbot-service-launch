import { EnhancedSubscriptionPlan } from '@/types/subscription';

export const PRICING_CONFIG = {
  currency: 'USD',
  defaultPlan: 'standard_monthly',
  premiumPlan: 'premium_plan',
  
  // Base prices in cents
  basePrices: {
    standard: 29700, // $297
    premium: 49700,  // $497
    promotional: 14700 // $147
  },

  // Promotional pricing
  promotions: {
    firstMonthDiscount: 0.5, // 50% off
    todayOnlyDiscount: 100, // $100 off
    weekendSpecial: 0.25 // 25% off
  }
} as const;

export const SUBSCRIPTION_PLANS: EnhancedSubscriptionPlan[] = [
  {
    id: 'standard_monthly',
    name: 'AI Chatbot Standard',
    price: PRICING_CONFIG.basePrices.standard,
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
    price: PRICING_CONFIG.basePrices.promotional,
    originalPrice: PRICING_CONFIG.basePrices.standard,
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
    savingsAmount: Math.round((PRICING_CONFIG.basePrices.standard - PRICING_CONFIG.basePrices.promotional) / 100),
    savingsPercentage: Math.round(PRICING_CONFIG.promotions.firstMonthDiscount * 100),
    legacyPlanId: 'basic'
  },
  {
    id: 'today_only_special',
    name: 'Today Only Special',
    price: PRICING_CONFIG.basePrices.standard - (PRICING_CONFIG.promotions.todayOnlyDiscount * 100),
    originalPrice: PRICING_CONFIG.basePrices.standard,
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
    savingsAmount: PRICING_CONFIG.promotions.todayOnlyDiscount,
    savingsPercentage: Math.round((PRICING_CONFIG.promotions.todayOnlyDiscount * 100) / PRICING_CONFIG.basePrices.standard * 100),
    popular: true,
    legacyPlanId: 'basic'
  },
  {
    id: 'premium_plan',
    name: 'AI Chatbot Premium',
    price: PRICING_CONFIG.basePrices.premium,
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

export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(0)}`;
}

export function calculateSavings(originalPrice: number, currentPrice: number): { amount: number; percentage: number } {
  const savings = originalPrice - currentPrice;
  const percentage = Math.round((savings / originalPrice) * 100);
  
  return {
    amount: Math.round(savings / 100),
    percentage
  };
}