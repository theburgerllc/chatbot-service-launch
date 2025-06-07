import React from 'react';
import { SubscriptionPlan, EnhancedSubscriptionPlan } from '@/types';
import { getSquareCheckoutUrl, getCampaignConfig } from '@/lib/plan-compatibility';
import { analytics } from '@/lib/analytics';

interface PricingSectionProps {
  onSelectPlan: (plan: string) => void;
  isLoading?: boolean;
  variant?: 'homepage' | 'promotional' | 'upsell' | 'legacy';
}

const PricingSection: React.FC<PricingSectionProps> = ({ 
  onSelectPlan, 
  isLoading = false,
  variant = 'homepage'
}) => {
  const campaignConfig = getCampaignConfig();
  
  // Legacy mode for backward compatibility
  if (variant === 'legacy' || process.env.NEXT_PUBLIC_ENABLE_NEW_PRICING !== 'true') {
    const legacyPlans: SubscriptionPlan[] = [
      {
        id: 'basic',
        name: 'AI Chatbot Basic',
        price: 497,
        frequency: 'month',
        description: 'Perfect for small to medium businesses',
        features: [
          '24/7 AI Customer Support',
          'Lead Capture & Qualification',
          'Basic Analytics Dashboard',
          'Email Integration',
          'Standard Response Time',
          'Email Support'
        ],
        checkoutUrl: getSquareCheckoutUrl('basic'),
        popular: false
      },
      {
        id: 'premium',
        name: 'AI Chatbot Premium', 
        price: 497,
        frequency: 'month',
        description: 'AI Chatbot Premium - Weekly Optimization',
        features: [
          'Everything in Basic Plan',
          '🚀 Weekly AI Optimization',
          '⚡ Priority Support (24h response)',
          '🧠 Advanced AI Features',
          '📊 Advanced Analytics & Insights',
          '🎨 Custom Branding & Design',
          '🔗 Advanced Integrations',
          '📞 Phone Support',
          '🎯 Conversion Optimization'
        ],
        checkoutUrl: getSquareCheckoutUrl('premium'),
        popular: true
      }
    ];

    return (
      <section id="pricing" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your AI Chatbot Plan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect plan for your business needs. Both plans include our core AI chatbot technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {legacyPlans.map((plan) => (
              <div key={plan.id} className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      🌟 Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-xl text-gray-500 ml-2">/{plan.frequency}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700' : 'bg-gray-900 text-white hover:bg-gray-800'} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:scale-105'}`}
                  >
                    {isLoading ? 'Processing...' : `Select ${plan.name} - $${plan.price}/month`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Enhanced pricing system with confirmed pricing: Standard $297, Premium $497
  const baseEnhancedPlans: EnhancedSubscriptionPlan[] = [
    {
      id: 'standard_monthly',
      name: 'AI Chatbot Standard',
      price: 297,
      frequency: 'month',
      description: 'Perfect for growing businesses',
      planType: 'standard',
      legacyPlanId: 'basic',
      features: [
        '24/7 AI Customer Support',
        'Lead Capture & Qualification',
        'Monthly Optimization Reports',
        'Email Integration', 
        'Basic Analytics Dashboard',
        'Email Support',
        'Standard Response Time'
      ],
      checkoutUrl: getSquareCheckoutUrl('standard_monthly'),
      popular: variant === 'homepage'
    },
    {
      id: 'premium_plan',
      name: 'AI Chatbot Premium',
      price: 497,
      frequency: 'month',
      description: 'Maximum performance with weekly optimization', 
      planType: 'premium',
      legacyPlanId: 'premium',
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
      ],
      checkoutUrl: getSquareCheckoutUrl('premium_plan'),
      popular: variant === 'upsell'
    }
  ];

  const getPromotionalPlans = (): EnhancedSubscriptionPlan[] => {
    const promotionalPlans: EnhancedSubscriptionPlan[] = [];
    
    if (campaignConfig.firstMonthPromo) {
      promotionalPlans.push({
        id: 'first_month_special',
        name: 'First Month Special',
        price: 147,
        originalPrice: 297,
        frequency: 'month',
        description: 'First month 50% OFF, then $297/month',
        planType: 'promotional',
        badge: '50% OFF First Month',
        savingsAmount: 150,
        savingsPercentage: 50,
        urgency: 'Limited time offer',
        features: [
          'Everything in Standard Plan',
          '💰 50% off first month ($147 vs $297)',
          '🎯 Priority onboarding support',
          '⏰ Extended 30-day trial period',
          '🎁 Free setup consultation',
          '📊 Bonus analytics training'
        ],
        checkoutUrl: getSquareCheckoutUrl('first_month_special'),
        popular: true
      });
    }

    if (campaignConfig.todayOnlyPromo) {
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      
      promotionalPlans.push({
        id: 'today_only_special',
        name: 'Today Only Special',
        price: 197,
        originalPrice: 297,
        frequency: 'month',
        description: 'Today only - $100 off standard monthly price',
        planType: 'promotional',
        badge: 'TODAY ONLY',
        savingsAmount: 100,
        savingsPercentage: 34,
        urgency: `Expires ${todayEnd.toLocaleTimeString()}`,
        features: [
          'Everything in Standard Plan',
          '⚡ $100 off every month ($197 vs $297)',
          '🚀 Immediate setup priority',
          '💎 Exclusive today-only pricing',
          '🎁 Free brand customization',
          '📞 Direct phone support'
        ],
        checkoutUrl: getSquareCheckoutUrl('today_only_special'),
        popular: true
      });
    }

    return promotionalPlans;
  };

  const getDisplayPlans = () => {
    const promotionalPlans = getPromotionalPlans();
    
    switch (variant) {
      case 'promotional':
        return [...promotionalPlans, ...baseEnhancedPlans];
      case 'upsell':
        return baseEnhancedPlans;
      case 'homepage':
      default:
        return promotionalPlans.length > 0 
          ? [...promotionalPlans, ...baseEnhancedPlans].slice(0, 3)
          : baseEnhancedPlans;
    }
  };

  const plans = getDisplayPlans();
  const hasPromotions = getPromotionalPlans().length > 0;

  return (
    <section id="pricing" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {hasPromotions ? '🔥 Special Limited-Time Offers' : 'Choose Your AI Chatbot Plan'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {hasPromotions ? 'Save big with our exclusive promotional pricing!' : 'Select the perfect plan for your business needs. Standard plan at $297/month, Premium at $497/month.'}
          </p>
        </div>

        <div className={`grid gap-8 max-w-6xl mx-auto ${plans.length === 2 ? 'md:grid-cols-2' : plans.length === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {plans.map((plan) => (
            <div key={plan.id} className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50 scale-105' : ''}`}>
              {plan.badge && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className={`px-6 py-2 rounded-full text-sm font-bold shadow-lg ${plan.planType === 'promotional' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white animate-pulse' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {plan.popular && !plan.badge && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    🌟 Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center mb-2">
                    {plan.originalPrice && (
                      <span className="text-2xl text-gray-400 line-through mr-3">${plan.originalPrice}</span>
                    )}
                    <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-xl text-gray-500 ml-2">/{plan.frequency}</span>
                  </div>
                  
                  {plan.savingsAmount && (
                    <p className="text-green-600 font-semibold">
                      Save ${plan.savingsAmount}/month ({plan.savingsPercentage}% OFF)
                    </p>
                  )}
                  
                  {plan.urgency && (
                    <p className="text-red-600 text-sm font-medium mt-2 animate-pulse">
                      ⏰ {plan.urgency}
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    // Track plan selection in analytics
                    analytics.trackPlanSelected(
                      plan.id, 
                      plan.planType, 
                      plan.price * 100,
                      getPromotionalPlans().length > 0 ? getPromotionalPlans()[0]?.id : undefined
                    );
                    onSelectPlan(plan.id);
                  }}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    plan.popular || plan.planType === 'promotional' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:scale-105'}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Select ${plan.name} - $${plan.price}/month`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            🔒 Secure payment processing • 📞 24/7 support • 🚀 Launch in under 24 hours
          </p>
          <p className="text-sm text-gray-500">
            All plans include a 30-day money-back guarantee. Cancel anytime.
          </p>
          {!hasPromotions && (
            <p className="text-sm text-blue-600 mt-2 font-medium">
              💡 Standard Plan: $297/month • Premium Plan: $497/month
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;