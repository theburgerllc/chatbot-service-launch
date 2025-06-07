import { useState, useEffect, useCallback } from 'react';
import { EnhancedSubscriptionPlan } from '@/types';
import { ENHANCED_SUBSCRIPTION_PLANS, getPlanById, getCheckoutUrlForPlan } from '@/lib/plan-compatibility';
import { CampaignManager } from '@/lib/campaign-manager';

export interface UsePricingReturn {
  plans: EnhancedSubscriptionPlan[];
  selectedPlan: EnhancedSubscriptionPlan | null;
  isLoading: boolean;
  selectPlan: (planId: string) => void;
  getCheckoutUrl: () => string;
  clearSelectedPlan: () => void;
}

export function usePricing(): UsePricingReturn {
  const [plans] = useState<EnhancedSubscriptionPlan[]>(ENHANCED_SUBSCRIPTION_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<EnhancedSubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const campaignManager = new CampaignManager();

  // Load selected plan from session storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlanId = sessionStorage.getItem('selectedPlan');
      if (storedPlanId) {
        const plan = getPlanById(storedPlanId);
        if (plan) {
          setSelectedPlan(plan);
        }
      }
    }
  }, []);

  const selectPlan = useCallback((planId: string) => {
    setIsLoading(true);
    
    const plan = getPlanById(planId);
    if (plan) {
      setSelectedPlan(plan);
      
      // Store in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedPlan', planId);
        sessionStorage.setItem('planType', plan.planType);
        sessionStorage.setItem('savings', (plan.savingsAmount || 0).toString());
      }

      // Track campaign interaction if it's a promotional plan
      if (plan.planType === 'promotional') {
        campaignManager.trackCampaignInteraction(planId, 'plan_selected');
      }
    }
    
    setIsLoading(false);
  }, [campaignManager]);

  const getCheckoutUrl = useCallback((): string => {
    if (!selectedPlan) return '';
    return getCheckoutUrlForPlan(selectedPlan.id);
  }, [selectedPlan]);

  const clearSelectedPlan = useCallback(() => {
    setSelectedPlan(null);
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('selectedPlan');
      sessionStorage.removeItem('planType');
      sessionStorage.removeItem('savings');
    }
  }, []);

  return {
    plans,
    selectedPlan,
    isLoading,
    selectPlan,
    getCheckoutUrl,
    clearSelectedPlan
  };
}