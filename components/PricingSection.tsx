import React from 'react';
import { SubscriptionPlan } from '../types';

interface PricingSectionProps {
  onSelectPlan: (plan: 'basic' | 'premium') => void;
  isLoading?: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan, isLoading = false }) => {
  const plans: SubscriptionPlan[] = [
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
        'Basic Customization',
        'Email Support'
      ],
      checkoutUrl: process.env.SQUARE_CHECKOUT_URL || '',
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
      checkoutUrl: process.env.SQUARE_CHECKOUT_URL_PREMIUM || '',
      popular: true
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your AI Chatbot Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your business needs. Both plans include our core AI chatbot technology
            with 24/7 customer support and lead generation capabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                }`}
            >
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
                      <svg
                        className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectPlan(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
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
                    `Start ${plan.name} - $${plan.price}/month`
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
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
