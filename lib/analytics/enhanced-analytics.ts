// Enhanced Analytics Integration for 4-Tier Subscription System

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  enabled: boolean;
  debugMode: boolean;
}

export interface EnhancedAnalyticsEvent {
  event: string;
  planId: string;
  planType: 'standard' | 'promotional' | 'premium';
  amount: number;
  currency: string;
  campaignId?: string;
  sessionId?: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
  customData?: Record<string, unknown>;
}

export class EnhancedAnalyticsTracker {
  private static instance: EnhancedAnalyticsTracker;
  private config: AnalyticsConfig;
  private events: EnhancedAnalyticsEvent[] = [];
  
  static getInstance(): EnhancedAnalyticsTracker {
    if (!EnhancedAnalyticsTracker.instance) {
      EnhancedAnalyticsTracker.instance = new EnhancedAnalyticsTracker();
    }
    return EnhancedAnalyticsTracker.instance;
  }
  
  constructor() {
    this.config = {
      googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
      facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
      enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
      debugMode: process.env.NODE_ENV === 'development'
    };
  }
  
  // Enhanced plan selection tracking with campaign attribution
  trackPlanSelected(
    planId: string, 
    planType: 'standard' | 'promotional' | 'premium', 
    amount: number, 
    campaignId?: string,
    sessionId?: string
  ): void {
    const event = this.createEvent('plan_selected', planId, planType, amount, campaignId, sessionId);
    this.trackEvent(event);
    
    // Google Analytics Enhanced Ecommerce
    this.sendToGoogleAnalytics('select_item', {
      item_list_id: 'pricing_plans',
      item_list_name: 'Subscription Plans',
      items: [{
        item_id: planId,
        item_name: this.getPlanDisplayName(planId),
        item_category: planType,
        item_variant: campaignId || 'direct',
        price: amount / 100,
        quantity: 1
      }],
      value: amount / 100,
      currency: 'USD',
      campaign_id: campaignId
    });
    
    // Facebook Pixel Custom Event
    this.sendToFacebookPixel('AddToCart', {
      content_ids: [planId],
      content_type: 'product',
      content_name: this.getPlanDisplayName(planId),
      content_category: planType,
      value: amount / 100,
      currency: 'USD',
      custom_data: {
        plan_type: planType,
        campaign_id: campaignId
      }
    });
  }
  
  // Enhanced checkout initiation tracking
  trackCheckoutInitiated(
    planId: string,
    planType: 'standard' | 'promotional' | 'premium',
    amount: number,
    campaignId?: string,
    sessionId?: string
  ): void {
    const event = this.createEvent('checkout_initiated', planId, planType, amount, campaignId, sessionId);
    this.trackEvent(event);
    
    // Google Analytics Enhanced Ecommerce
    this.sendToGoogleAnalytics('begin_checkout', {
      currency: 'USD',
      value: amount / 100,
      coupon: this.getCouponCode(planId, campaignId),
      items: [{
        item_id: planId,
        item_name: this.getPlanDisplayName(planId),
        item_category: planType,
        item_variant: campaignId || 'direct',
        price: amount / 100,
        quantity: 1
      }],
      campaign_id: campaignId,
      session_id: sessionId
    });
    
    // Facebook Pixel Checkout Event
    this.sendToFacebookPixel('InitiateCheckout', {
      content_ids: [planId],
      content_type: 'product',
      value: amount / 100,
      currency: 'USD',
      num_items: 1
    });
  }
  
  // Enhanced purchase completion tracking
  trackPurchaseCompleted(
    planId: string,
    planType: 'standard' | 'promotional' | 'premium',
    amount: number,
    paymentId: string,
    campaignId?: string,
    sessionId?: string
  ): void {
    const event = this.createEvent('purchase_completed', planId, planType, amount, campaignId, sessionId, {
      payment_id: paymentId
    });
    this.trackEvent(event);
    
    // Google Analytics Enhanced Ecommerce Purchase
    this.sendToGoogleAnalytics('purchase', {
      transaction_id: paymentId,
      value: amount / 100,
      currency: 'USD',
      coupon: this.getCouponCode(planId, campaignId),
      items: [{
        item_id: planId,
        item_name: this.getPlanDisplayName(planId),
        item_category: planType,
        item_variant: campaignId || 'direct',
        price: amount / 100,
        quantity: 1
      }],
      campaign_id: campaignId,
      session_id: sessionId
    });
    
    // Facebook Pixel Purchase Event
    this.sendToFacebookPixel('Purchase', {
      content_ids: [planId],
      content_type: 'product',
      value: amount / 100,
      currency: 'USD',
      order_id: paymentId
    });
    
    // Send to server-side analytics endpoint
    this.sendToServerAnalytics(event);
  }
  
  // Campaign performance tracking
  trackCampaignInteraction(
    campaignId: string,
    action: string,
    planId?: string,
    customData?: Record<string, unknown>
  ): void {
    const event = this.createEvent('campaign_interaction', planId || '', 'promotional', 0, campaignId, undefined, {
      action,
      ...customData
    });
    this.trackEvent(event);
    
    // Google Analytics Custom Event
    this.sendToGoogleAnalytics('campaign_interaction', {
      campaign_id: campaignId,
      action,
      plan_id: planId,
      custom_parameter: JSON.stringify(customData)
    });
  }
  
  // Form submission tracking
  trackFormSubmission(
    formType: 'lead_capture' | 'configuration',
    planId?: string,
    campaignId?: string
  ): void {
    const event = this.createEvent('form_submitted', planId || '', 'standard', 0, campaignId, undefined, {
      form_type: formType
    });
    this.trackEvent(event);
    
    // Google Analytics Form Submission
    this.sendToGoogleAnalytics('form_submit', {
      form_type: formType,
      plan_id: planId,
      campaign_id: campaignId
    });
    
    // Facebook Pixel Lead Event
    this.sendToFacebookPixel('Lead', {
      content_category: formType,
      content_name: `${formType}_form`,
      custom_data: {
        plan_id: planId,
        campaign_id: campaignId
      }
    });
  }
  
  // Page view tracking with enhanced data
  trackPageView(page: string, planId?: string, campaignId?: string): void {
    const event = this.createEvent('page_view', planId || '', 'standard', 0, campaignId, undefined, {
      page
    });
    this.trackEvent(event);
    
    // Google Analytics Page View
    this.sendToGoogleAnalytics('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page: page,
      plan_id: planId,
      campaign_id: campaignId
    });
  }
  
  private createEvent(
    eventType: string,
    planId: string,
    planType: 'standard' | 'promotional' | 'premium',
    amount: number,
    campaignId?: string,
    sessionId?: string,
    customData?: Record<string, unknown>
  ): EnhancedAnalyticsEvent {
    return {
      event: eventType,
      planId,
      planType,
      amount,
      currency: 'USD',
      campaignId,
      sessionId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      customData
    };
  }
  
  private trackEvent(event: EnhancedAnalyticsEvent): void {
    this.events.push(event);
    
    // Keep only last 100 events to prevent memory issues
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
    
    if (this.config.debugMode) {
      console.log('📊 Enhanced Analytics Event:', event);
    }
  }
  
  private sendToGoogleAnalytics(eventName: string, parameters: Record<string, unknown>): void {
    if (!this.config.enabled || !this.config.googleAnalyticsId) return;
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        send_to: this.config.googleAnalyticsId
      });
      
      if (this.config.debugMode) {
        console.log('📈 Google Analytics Event:', eventName, parameters);
      }
    }
  }
  
  private sendToFacebookPixel(eventName: string, parameters: Record<string, unknown>): void {
    if (!this.config.enabled || !this.config.facebookPixelId) return;
    
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
      
      if (this.config.debugMode) {
        console.log('📘 Facebook Pixel Event:', eventName, parameters);
      }
    }
  }
  
  private async sendToServerAnalytics(event: EnhancedAnalyticsEvent): Promise<void> {
    if (!this.config.enabled) return;
    
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      if (this.config.debugMode) {
        console.error('Failed to send server analytics:', error);
      }
    }
  }
  
  private getPlanDisplayName(planId: string): string {
    const names = {
      'basic': 'AI Chatbot Basic',
      'premium': 'AI Chatbot Premium (Legacy)',
      'standard_monthly': 'AI Chatbot Standard',
      'first_month_special': 'First Month Special',
      'today_only_special': 'Today Only Special',
      'premium_plan': 'AI Chatbot Premium'
    };
    return names[planId as keyof typeof names] || planId;
  }
  
  private getCouponCode(planId: string, campaignId?: string): string | undefined {
    if (planId === 'first_month_special') return 'FIRST50';
    if (planId === 'today_only_special') return 'TODAY100';
    if (campaignId) return campaignId.toUpperCase();
    return undefined;
  }
  
  // Analytics summary and reporting
  getAnalyticsSummary(): Record<string, unknown> {
    const summary = {
      totalEvents: this.events.length,
      eventBreakdown: this.getEventBreakdown(),
      planPerformance: this.getPlanPerformance(),
      campaignPerformance: this.getCampaignPerformance(),
      conversionFunnel: this.getConversionFunnel(),
      recentEvents: this.events.slice(-10)
    };
    
    return summary;
  }
  
  private getEventBreakdown(): Record<string, number> {
    const breakdown: Record<string, number> = {};
    this.events.forEach(event => {
      breakdown[event.event] = (breakdown[event.event] || 0) + 1;
    });
    return breakdown;
  }
  
  private getPlanPerformance(): Record<string, Record<string, number>> {
    const performance: Record<string, Record<string, number>> = {};
    this.events.forEach(event => {
      if (event.planId) {
        if (!performance[event.planId]) {
          performance[event.planId] = {
            views: 0,
            selections: 0,
            checkouts: 0,
            purchases: 0,
            revenue: 0
          };
        }
        
        switch (event.event) {
          case 'plan_selected':
            performance[event.planId].selections++;
            break;
          case 'checkout_initiated':
            performance[event.planId].checkouts++;
            break;
          case 'purchase_completed':
            performance[event.planId].purchases++;
            performance[event.planId].revenue += event.amount;
            break;
        }
      }
    });
    return performance;
  }
  
  private getCampaignPerformance(): Record<string, Record<string, number>> {
    const performance: Record<string, Record<string, number>> = {};
    this.events.forEach(event => {
      if (event.campaignId) {
        if (!performance[event.campaignId]) {
          performance[event.campaignId] = {
            interactions: 0,
            conversions: 0,
            revenue: 0
          };
        }
        
        performance[event.campaignId].interactions++;
        if (event.event === 'purchase_completed') {
          performance[event.campaignId].conversions++;
          performance[event.campaignId].revenue += event.amount;
        }
      }
    });
    return performance;
  }
  
  private getConversionFunnel(): Record<string, number> {
    return {
      planSelections: this.events.filter(e => e.event === 'plan_selected').length,
      checkoutInitiated: this.events.filter(e => e.event === 'checkout_initiated').length,
      purchaseCompleted: this.events.filter(e => e.event === 'purchase_completed').length,
      formSubmissions: this.events.filter(e => e.event === 'form_submitted').length
    };
  }
}

// Global analytics instance
export const enhancedAnalytics = EnhancedAnalyticsTracker.getInstance();

// Type declarations for window objects
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
  }
}