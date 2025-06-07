// API response interface
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Campaign configuration interface
export interface CampaignConfig {
  firstMonthPromo: boolean;
  todayOnlyPromo: boolean; 
  weekendSpecial: boolean;
}

// Analytics event interface
export interface AnalyticsEvent {
  event: string;
  planId: string;
  planType: string;
  amount: number;
  campaignId?: string;
  timestamp: string;
}

// Environment configuration interface
export interface EnvironmentConfig {
  square: {
    environment: string;
    accessToken: string;
    webhookSecret: string;
    webhookSecretSandbox: string;
    checkoutUrl: string;
    checkoutUrlPremium: string;
  };
  airtable: {
    apiKey: string;
    baseId: string;
  };
  email: {
    serviceId: string;
    templateId: string;
    userId: string;
  };
  analytics: {
    googleAnalyticsId: string;
    facebookPixelId: string;
  };
  features: {
    enableFirstMonthPromo: boolean;
    enableTodayOnlyPromo: boolean;
    enableWeekendSpecial: boolean;
    enableAnalytics: boolean;
  };
  app: {
    environment: string;
    baseUrl: string;
    version: string;
  };
}