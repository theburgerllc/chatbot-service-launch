import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import { OnboardingFormData } from '@/types';

const Form: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('standard_monthly');
  const [selectedPlanType, setSelectedPlanType] = useState<string>('standard');
  const [selectedSavings, setSelectedSavings] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<OnboardingFormData>();

  // Get selected plan from session storage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = sessionStorage.getItem('selectedPlan') as string;
      const storedPlanType = sessionStorage.getItem('planType');
      const storedSavings = sessionStorage.getItem('savings');
      
      if (storedPlan) {
        setSelectedPlan(storedPlan);
      }
      
      // Store additional plan data for display
      if (storedPlanType) {
        setSelectedPlanType(storedPlanType);
      }
      if (storedSavings) {
        setSelectedSavings(parseInt(storedSavings));
      }
    }
  }, []);

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Include the selected subscription plan in the form data
      const formDataWithPlan = {
        ...data,
        subscriptionPlan: selectedPlan
      };

      const response = await axios.post('/api/submit', formDataWithPlan);

      if (response.data.success) {
        setSubmitMessage('🎉 Success! We\'ll be in touch within 24 hours.');
        reset();

        // Check if we're on the configure page (post-payment) or regular homepage
        const isConfigurePage = router.pathname === '/configure';

        // Redirect to appropriate success page after a short delay
        setTimeout(() => {
          if (isConfigurePage) {
            window.location.href = '/success?configured=true';
          } else {
            window.location.href = '/success';
          }
        }, 2000);
      } else {
        setSubmitMessage('❌ Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage('❌ Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🚀 Get Your AI Chatbot
      </h2>
      <p className="text-gray-600 text-center mb-4">
        Fill out this form and we&apos;ll have your chatbot ready in 24 hours!
      </p>

      {/* Selected Plan Indicator */}
      <div className={`text-center mb-8 p-4 rounded-lg ${
        selectedPlan.includes('special') || selectedPlanType === 'promotional'
          ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
          : selectedPlanType === 'premium'
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <p className="text-sm font-medium text-gray-700">
          Selected Plan: <span className={`font-bold ${
            selectedPlan.includes('special') ? 'text-red-600' : 
            selectedPlanType === 'premium' ? 'text-blue-600' : 'text-gray-900'
          }`}>
            {selectedPlan === 'premium_plan' ? '⭐ AI Chatbot Premium ($497/month)' :
             selectedPlan === 'standard_monthly' ? '🚀 AI Chatbot Standard ($297/month)' :
             selectedPlan === 'first_month_special' ? '💰 First Month Special ($147 first month, then $297)' :
             selectedPlan === 'today_only_special' ? '⚡ Today Only Special ($197/month)' :
             selectedPlan === 'premium' ? '⭐ AI Chatbot Premium ($497/month)' :
             selectedPlan === 'basic' ? '🚀 AI Chatbot Basic ($497/month)' :
             '🚀 AI Chatbot Standard ($297/month)'}
          </span>
        </p>
        {selectedSavings > 0 && (
          <p className="text-xs text-green-600 mt-1 font-semibold">
            💰 You&apos;re saving ${selectedSavings}/month with this plan!
          </p>
        )}
        {selectedPlan.includes('special') && (
          <p className="text-xs text-red-600 mt-1">
            🔥 Limited time promotional pricing
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            {...register('businessName', { required: 'Business name is required' })}
            className="form-input"
            placeholder="Your Business Name"
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
          )}
        </div>

        {/* Website URL */}
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL *
          </label>
          <input
            type="url"
            id="websiteUrl"
            {...register('websiteUrl', {
              required: 'Website URL is required',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Please enter a valid URL'
              }
            })}
            className="form-input"
            placeholder="https://yourwebsite.com"
          />
          {errors.websiteUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.websiteUrl.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            className="form-input"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            {...register('phoneNumber', { required: 'Phone number is required' })}
            className="form-input"
            placeholder="+1 (555) 123-4567"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Business Hours */}
        <div>
          <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700 mb-2">
            Business Hours *
          </label>
          <input
            type="text"
            id="businessHours"
            {...register('businessHours', { required: 'Business hours are required' })}
            className="form-input"
            placeholder="Mon-Fri 9AM-5PM EST"
          />
          {errors.businessHours && (
            <p className="mt-1 text-sm text-red-600">{errors.businessHours.message}</p>
          )}
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Top 3 Frequently Asked Questions</h3>

          <div>
            <label htmlFor="faq1" className="block text-sm font-medium text-gray-700 mb-2">
              FAQ #1 *
            </label>
            <textarea
              id="faq1"
              {...register('faq1', { required: 'First FAQ is required' })}
              className="form-textarea"
              rows={3}
              placeholder="What services do you offer?"
            />
            {errors.faq1 && (
              <p className="mt-1 text-sm text-red-600">{errors.faq1.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="faq2" className="block text-sm font-medium text-gray-700 mb-2">
              FAQ #2 *
            </label>
            <textarea
              id="faq2"
              {...register('faq2', { required: 'Second FAQ is required' })}
              className="form-textarea"
              rows={3}
              placeholder="What are your pricing options?"
            />
            {errors.faq2 && (
              <p className="mt-1 text-sm text-red-600">{errors.faq2.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="faq3" className="block text-sm font-medium text-gray-700 mb-2">
              FAQ #3 *
            </label>
            <textarea
              id="faq3"
              {...register('faq3', { required: 'Third FAQ is required' })}
              className="form-textarea"
              rows={3}
              placeholder="How do I get started?"
            />
            {errors.faq3 && (
              <p className="mt-1 text-sm text-red-600">{errors.faq3.message}</p>
            )}
          </div>
        </div>

        {/* Brand Color */}
        <div>
          <label htmlFor="brandColor" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Color (HEX) *
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id="brandColorPicker"
              {...register('brandColor', { required: 'Brand color is required' })}
              className="h-12 w-20 rounded border border-gray-300"
            />
            <input
              type="text"
              {...register('brandColor', {
                required: 'Brand color is required',
                pattern: {
                  value: /^#[0-9A-F]{6}$/i,
                  message: 'Please enter a valid HEX color (e.g., #FF5733)'
                }
              })}
              className="form-input flex-1"
              placeholder="#FF5733"
            />
          </div>
          {errors.brandColor && (
            <p className="mt-1 text-sm text-red-600">{errors.brandColor.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              '🚀 Launch My Chatbot'
            )}
          </button>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`text-center p-4 rounded-lg ${submitMessage.includes('Success')
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default Form;
