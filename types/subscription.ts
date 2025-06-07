// Subscription plan interface
export interface SubscriptionPlan {
  id: 'basic' | 'premium';
  name: string;
  price: number;
  frequency: string;
  description: string;
  features: string[];
  checkoutUrl: string;
  popular?: boolean;
}

// Enhanced subscription plan interface for new 4-tier system
export interface EnhancedSubscriptionPlan {
  id: 'standard_monthly' | 'first_month_special' | 'today_only_special' | 'premium_plan';
  name: string;
  price: number;
  originalPrice?: number;
  frequency: string;
  description: string;
  features: string[];
  checkoutUrl: string;
  popular?: boolean;
  planType: 'standard' | 'promotional' | 'premium';
  badge?: string;
  urgency?: string;
  legacyPlanId?: 'basic' | 'premium';
  savingsAmount?: number;
  savingsPercentage?: number;
}

export interface PaymentSession {
  paymentId: string;
  customerId: string;
  amount: number;
  subscriptionPlan: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  expiresAt: string;
  campaignId?: string;
}