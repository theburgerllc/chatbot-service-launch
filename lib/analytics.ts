interface AnalyticsEvent {
  event: string;
  planId: string;
  planType: string;
  amount: number;
  campaignId?: string;
  timestamp: string;
}

export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private events: AnalyticsEvent[] = [];
  
  static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  // Track plan selection
  trackPlanSelected(planId: string, planType: string, amount: number, campaignId?: string) {
    this.trackEvent('plan_selected', planId, planType, amount, campaignId);
    this.sendToGoogleAnalytics('select_plan', {
      plan_id: planId,
      plan_type: planType,
      value: amount / 100,
      currency: 'USD',
      campaign_id: campaignId
    });
  }

  // Track payment initiation
  trackPaymentStarted(planId: string, planType: string, amount: number, campaignId?: string) {
    this.trackEvent('payment_started', planId, planType, amount, campaignId);
    this.sendToGoogleAnalytics('begin_checkout', {
      plan_id: planId,
      plan_type: planType,
      value: amount / 100,
      currency: 'USD',
      campaign_id: campaignId
    });
  }

  // Track payment completion
  trackPaymentCompleted(planId: string, planType: string, amount: number, campaignId?: string) {
    this.trackEvent('payment_completed', planId, planType, amount, campaignId);
    this.sendToGoogleAnalytics('purchase', {
      transaction_id: `${planId}_${Date.now()}`,
      plan_id: planId,
      plan_type: planType,
      value: amount / 100,
      currency: 'USD',
      campaign_id: campaignId
    });
    
    // Send to Facebook Pixel if configured
    this.sendToFacebookPixel('Purchase', {
      content_ids: [planId],
      content_type: 'product',
      value: amount / 100,
      currency: 'USD'
    });
  }

  // Track campaign performance
  trackCampaignView(campaignId: string, planId: string) {
    this.trackEvent('campaign_viewed', planId, 'promotional', 0, campaignId);
    this.sendToGoogleAnalytics('view_promotion', {
      promotion_id: campaignId,
      promotion_name: `Campaign ${campaignId}`,
      plan_id: planId
    });
  }

  private trackEvent(event: string, planId: string, planType: string, amount: number, campaignId?: string) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      planId,
      planType,
      amount,
      campaignId,
      timestamp: new Date().toISOString()
    };
    
    this.events.push(analyticsEvent);
    
    // Keep only last 100 events to prevent memory issues
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
    
    console.log('📊 Analytics Event:', analyticsEvent);
  }

  private sendToGoogleAnalytics(eventName: string, parameters: Record<string, string | number | undefined>) {
    if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
      window.gtag('event', eventName, parameters);
    }
  }

  private sendToFacebookPixel(eventName: string, parameters: Record<string, string | number | string[]>) {
    if (typeof window !== 'undefined' && window.fbq && process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
      window.fbq('track', eventName, parameters);
    }
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const summary = {
      totalEvents: this.events.length,
      planSelections: this.events.filter(e => e.event === 'plan_selected').length,
      paymentsStarted: this.events.filter(e => e.event === 'payment_started').length,
      paymentsCompleted: this.events.filter(e => e.event === 'payment_completed').length,
      campaignViews: this.events.filter(e => e.event === 'campaign_viewed').length,
      planBreakdown: this.getPlanBreakdown(),
      recentEvents: this.events.slice(-10)
    };
    
    return summary;
  }

  private getPlanBreakdown() {
    const breakdown: Record<string, number> = {};
    this.events.forEach(event => {
      if (event.event === 'plan_selected') {
        breakdown[event.planId] = (breakdown[event.planId] || 0) + 1;
      }
    });
    return breakdown;
  }
}

// Global analytics instance
export const analytics = AnalyticsTracker.getInstance();

// Type declarations for window objects
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
  }
}