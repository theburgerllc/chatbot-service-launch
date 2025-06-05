// Form data interface for the onboarding form
export interface OnboardingFormData {
  businessName: string;
  websiteUrl: string;
  email: string;
  phoneNumber: string;
  businessHours: string;
  faq1: string;
  faq2: string;
  faq3: string;
  brandColor: string;
  subscriptionPlan?: 'basic' | 'premium';
}

// API response interface
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Email template data interface
export interface EmailTemplateData {
  businessName: string;
  email: string;
  websiteUrl: string;
  phoneNumber: string;
  businessHours: string;
  faqs: string[];
  brandColor: string;
}

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
