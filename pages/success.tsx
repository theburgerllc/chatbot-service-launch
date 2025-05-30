import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

const SuccessPage: React.FC = () => {
  return (
    <Layout 
      title="Success! Your Chatbot is Being Built | AI Chatbot Service"
      description="Thank you for signing up! We're building your AI chatbot now and you'll hear from us within 24 hours."
    >
      <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-fade-in">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            {/* Main Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🎉 Thanks for signing up!
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              We're building your chatbot now. You'll hear from us within 24 hours.
            </p>

            {/* What Happens Next */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-left">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                What happens next?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Review & Setup</h3>
                    <p className="text-gray-600">Our team reviews your information and begins building your custom chatbot.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Training</h3>
                    <p className="text-gray-600">We train your AI with your FAQs, business info, and brand voice.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Testing & Launch</h3>
                    <p className="text-gray-600">We test everything and send you the embed code for your website.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Go Live!</h3>
                    <p className="text-gray-600">Your chatbot starts converting visitors into customers 24/7.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Questions? We're here to help!</h3>
              <div className="space-y-2 text-gray-600">
                <p>📧 Email: <a href="mailto:support@chatbotlaunch.com" className="text-primary-600 hover:underline">support@chatbotlaunch.com</a></p>
                <p>📞 Phone: <a href="tel:+1234567890" className="text-primary-600 hover:underline">+1 (234) 567-8900</a></p>
              </div>
            </div>

            {/* Back to Home */}
            <Link href="/" className="btn-secondary inline-block">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SuccessPage;
