import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if user completed the full configuration flow
    const configured = router.query.configured === 'true';
    setIsConfigured(configured);
  }, [router.query]);

  // If user completed configuration (paid + configured), show full success
  if (isConfigured) {
    return (
      <Layout
        title="Success! Your Chatbot is Being Built | AI Chatbot Service"
        description="Thank you for your payment and configuration! We're building your AI chatbot now and you'll hear from us within 24 hours."
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
                We&apos;re building your chatbot now. You&apos;ll hear from us within 24 hours.
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
                <h3 className="font-semibold text-gray-900 mb-3">Questions? We&apos;re here to help!</h3>
                <div className="space-y-2 text-gray-600">
                  <p>📧 Email: <a href="mailto:burger@theburgerllc.com" className="text-primary-600 hover:underline">burger@theburgerllc.com</a></p>
                  <p>📞 Phone: <a href="tel:+13329994484" className="text-primary-600 hover:underline">+1 (332) 999-4484</a></p>
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
  }

  // If user just submitted form without payment, show payment reminder
  return (
    <Layout
      title="Almost There! Complete Your Payment | AI Chatbot Service"
      description="Complete your payment to start building your AI chatbot"
    >
      <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-fade-in">
            {/* Warning Icon */}
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
            </div>

            {/* Main Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ⚠️ Almost There!
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              We received your information, but you need to complete payment to start building your chatbot.
            </p>

            {/* Payment CTA */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Complete Your Payment Now
              </h2>
              <p className="text-gray-600 mb-6">
                Your chatbot configuration is saved. Complete your $297/month subscription to start the build process.
              </p>

              <Link
                href="/"
                className="btn-primary inline-block text-xl px-8 py-4 mb-4"
              >
                💳 Complete Payment Now
              </Link>

              <p className="text-sm text-gray-500">
                Secure payment via Square • Cancel anytime • 30-day money-back guarantee
              </p>
            </div>

            {/* What You Get */}
            <div className="bg-gray-50 rounded-xl p-8 mb-8 text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                What happens after payment?
              </h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Immediate access to configure your chatbot</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>AI training with your business information</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Live chatbot in 24 hours</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Questions? We&apos;re here to help!</h3>
              <div className="space-y-2 text-gray-600">
                <p>📧 Email: <a href="mailto:burger@theburgerllc.com" className="text-primary-600 hover:underline">burger@theburgerllc.com</a></p>
                <p>📞 Phone: <a href="tel:+13329994484" className="text-primary-600 hover:underline">+1 (332) 999-4484</a></p>
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
