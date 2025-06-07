import { useCallback } from 'react';
import { analytics } from '@/lib/analytics';

export interface UseAnalyticsReturn {
  trackPlanSelected: (planId: string, planType: string, amount: number, campaignId?: string) => void;
  trackPaymentStarted: (planId: string, planType: string, amount: number, campaignId?: string) => void;
  trackPaymentCompleted: (planId: string, planType: string, amount: number, campaignId?: string) => void;
  trackCampaignView: (campaignId: string, planId: string) => void;
  getAnalyticsSummary: () => any;
}

export function useAnalytics(): UseAnalyticsReturn {
  const trackPlanSelected = useCallback((planId: string, planType: string, amount: number, campaignId?: string) => {
    analytics.trackPlanSelected(planId, planType, amount, campaignId);
  }, []);

  const trackPaymentStarted = useCallback((planId: string, planType: string, amount: number, campaignId?: string) => {
    analytics.trackPaymentStarted(planId, planType, amount, campaignId);
  }, []);

  const trackPaymentCompleted = useCallback((planId: string, planType: string, amount: number, campaignId?: string) => {
    analytics.trackPaymentCompleted(planId, planType, amount, campaignId);
  }, []);

  const trackCampaignView = useCallback((campaignId: string, planId: string) => {
    analytics.trackCampaignView(campaignId, planId);
  }, []);

  const getAnalyticsSummary = useCallback(() => {
    return analytics.getAnalyticsSummary();
  }, []);

  return {
    trackPlanSelected,
    trackPaymentStarted,
    trackPaymentCompleted,
    trackCampaignView,
    getAnalyticsSummary
  };
}