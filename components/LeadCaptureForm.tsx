import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface LeadFormData {
  name: string;
  email: string;
  businessName: string;
}

const LeadCaptureForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LeadFormData>();

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Save lead data to database via API
      const leadResponse = await axios.post('/api/lead-capture', {
        ...data,
        timestamp: new Date().toISOString(),
        source: 'Website Form'
      });

      if (leadResponse.data.success) {
        // Store lead ID for later reference
        sessionStorage.setItem('leadId', leadResponse.data.leadId);

        setSubmitMessage('🎉 Thanks! We\'ll be in touch soon.');
        reset();

        // Redirect to payment after a short delay
        setTimeout(() => {
          window.location.href = '#pricing';
        }, 2000);
      } else {
        setSubmitMessage('❌ Failed to save your information. Please try again.');
      }

    } catch (error) {
      console.error('Lead capture error:', error);
      setSubmitMessage('❌ Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-lg mx-auto animate-fade-in">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        💬 Get Started Today
      </h3>
      <p className="text-gray-600 text-center mb-6">
        Tell us about your business and we&apos;ll show you how our AI chatbot can help!
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Name is required' })}
            className="form-input"
            placeholder="John Smith"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
            placeholder="john@company.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
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

        {/* Submit Button */}
        <div className="pt-2">
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
              '💬 Get My Free Quote'
            )}
          </button>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`text-center p-3 rounded-lg text-sm ${submitMessage.includes('Thanks')
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}>
            {submitMessage}
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        No spam, ever. We respect your privacy.
      </p>
    </div>
  );
};

export default LeadCaptureForm;
