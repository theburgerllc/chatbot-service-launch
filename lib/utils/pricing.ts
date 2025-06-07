// Enhanced pricing configuration with MCP integration support

// Enhanced pricing configuration with MCP integration support
export const PRICING_TIERS = {
  STANDARD: {
    id: 'standard_monthly',
    basePrice: 29700, // $297 in cents
    name: 'AI Chatbot Standard',
    description: 'Perfect for growing businesses',
    features: [
      '24/7 AI Customer Support',
      'Lead Capture & Qualification',
      'Monthly Optimization Reports', 
      'Email Integration',
      'Basic Analytics Dashboard',
      'Email Support',
      'Standard Response Time'
    ]
  },
  FIRST_MONTH_SPECIAL: {
    id: 'first_month_special',
    basePrice: 14700, // $147 in cents
    originalPrice: 29700,
    name: 'First Month Special',
    description: 'First month 50% OFF, then $297/month',
    badge: '50% OFF First Month',
    features: [
      'Everything in Standard Plan',
      '💰 50% off first month ($147 vs $297)',
      '🎯 Priority onboarding support',
      '⏰ Extended 30-day trial period',
      '🎁 Free setup consultation',
      '📊 Bonus analytics training'
    ]
  },
  TODAY_ONLY_SPECIAL: {
    id: 'today_only_special',
    basePrice: 19700, // $197 in cents  
    originalPrice: 29700,
    name: 'Today Only Special',
    description: 'Today only - $100 off standard monthly price',
    badge: 'TODAY ONLY',
    features: [
      'Everything in Standard Plan',
      '⚡ $100 off every month ($197 vs $297)',
      '🚀 Immediate setup priority',
      '💎 Exclusive today-only pricing',
      '🎁 Free brand customization',
      '📞 Direct phone support'
    ]
  },
  PREMIUM: {
    id: 'premium_plan',
    basePrice: 49700, // $497 in cents
    name: 'AI Chatbot Premium',
    description: 'Maximum performance with weekly optimization',
    features: [
      'Everything in Standard Plan',
      '🚀 Weekly AI Optimization Sessions',
      '⚡ Priority Support (4h response)',
      '🧠 Advanced AI Features & Integrations',
      '📊 Advanced Analytics & Reporting',
      '🎨 Custom Branding & White-label',
      '🔗 API Access & Custom Integrations',
      '📞 Phone Support & Dedicated Manager',
      '🎯 Conversion Rate Optimization'
    ]
  }
} as const;

export interface PricingCalculation {
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  savingsPercentage: number;
  isPromotion: boolean;
}

export function calculatePricing(planId: string): PricingCalculation {
  const plan = Object.values(PRICING_TIERS).find(p => p.id === planId);
  
  if (!plan) {
    throw new Error(`Unknown plan ID: ${planId}`);
  }

  const basePrice = ('originalPrice' in plan ? plan.originalPrice : plan.basePrice) || plan.basePrice;
  const finalPrice = plan.basePrice;
  const discountAmount = basePrice - finalPrice;
  const savingsPercentage = discountAmount > 0 ? Math.round((discountAmount / basePrice) * 100) : 0;
  const isPromotion = discountAmount > 0;

  return {
    basePrice,
    discountAmount,
    finalPrice,
    savingsPercentage,
    isPromotion
  };
}

export function formatCurrency(amountInCents: number): string {
  return `$${(amountInCents / 100).toFixed(0)}`;
}

export function getPlanFeatures(planId: string): string[] {
  const plan = Object.values(PRICING_TIERS).find(p => p.id === planId);
  return plan?.features ? [...plan.features] : [];
}

export function getPromotionalUrgency(planId: string): string | null {
  switch (planId) {
    case 'today_only_special':
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      return `Expires ${endOfDay.toLocaleTimeString()}`;
    case 'first_month_special':
      return 'Limited time offer';
    default:
      return null;
  }
}

export function validatePlanConfiguration(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Validate all required environment variables
  const requiredEnvVars = [
    'SQUARE_CHECKOUT_URL',
    'SQUARE_CHECKOUT_URL_PREMIUM',
    'SQUARE_ENVIRONMENT',
    'SQUARE_ACCESS_TOKEN',
    'SQUARE_WEBHOOK_SECRET'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      issues.push(`Missing environment variable: ${envVar}`);
    }
  }
  
  // Validate pricing consistency
  const standardPrice = PRICING_TIERS.STANDARD.basePrice;
  const premiumPrice = PRICING_TIERS.PREMIUM.basePrice;
  
  if (premiumPrice <= standardPrice) {
    issues.push('Premium plan should be priced higher than standard plan');
  }
  
  // Validate promotional pricing
  if (PRICING_TIERS.FIRST_MONTH_SPECIAL.basePrice >= standardPrice) {
    issues.push('First month special should be lower than standard price');
  }
  
  if (PRICING_TIERS.TODAY_ONLY_SPECIAL.basePrice >= standardPrice) {
    issues.push('Today only special should be lower than standard price');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}