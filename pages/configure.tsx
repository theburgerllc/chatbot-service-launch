import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Form from '@/components/Form';

const ConfigurePage: React.FC = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user came from successful payment
    // In a real app, you'd verify payment status via API
    const paymentSuccess = router.query.payment_success === 'true';
    const sessionId = router.query.session_id;
    
    if (paymentSuccess && sessionId) {
      setIsAuthorized(true);
    } else {
      // Check if there's a valid session in localStorage (for returning users)
      const savedSession = localStorage.getItem('chatbot_config_session');
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          // Check if session is still valid (within 24 hours)
          const sessionTime = new Date(session.timestamp);
          const now = new Date();
          const hoursDiff = (now.getTime() - sessionTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            setIsAuthorized(true);
          }
        } catch (error) {
          console.error('Invalid session data');
        }
      }
    }
    
    setIsLoading(false);
  }, [router.query]);

  // Save session when user is authorized
  useEffect(() => {
    if (isAuthorized && router.query.session_id) {
      const sessionData = {
        sessionId: router.query.session_id,
        timestamp: new Date().toISOString(),
        paymentVerified: true
      };
      localStorage.setItem('chatbot_config_session', JSON.stringify(sessionData));
    }
  }, [isAuthorized, router.query.session_id]);

  if (isLoading) {
    return (
      <Layout 
        title="Loading... | AI Chatbot Configuration"
        description="Configuring your AI chatbot"
      >
        <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!isAuthorized) {
    return (
      <Layout 
        title="Payment Required | AI Chatbot Configuration"
        description="Complete your payment to configure your AI chatbot"
      >
        <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-fade-in">
              {/* Lock Icon */}
              <div className="mb-8">
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                🔒 Payment Required
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                You need to complete your payment before configuring your chatbot.
              </p>

              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Ready to get started?
                </h2>
                <p className="text-gray-600 mb-6">
                  Complete your $297/month subscription to access the chatbot configuration form.
                </p>
                
                <a
                  href="/"
                  className="btn-primary inline-block mb-4"
                >
                  ← Go Back to Payment
                </a>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Questions? We're here to help!</h3>
                <div className="space-y-2 text-gray-600">
                  <p>📧 Email: <a href="mailto:support@chatbotlaunch.com" className="text-primary-600 hover:underline">support@chatbotlaunch.com</a></p>
                  <p>📞 Phone: <a href="tel:+1234567890" className="text-primary-600 hover:underline">+1 (234) 567-8900</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Configure Your AI Chatbot | AI Chatbot Service"
      description="Configure your AI chatbot with your business information and preferences"
    >
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎉 Payment Successful!
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-600 mb-4">
              Now Let's Configure Your AI Chatbot
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the form below with your business details and we'll have your AI chatbot ready in 24 hours!
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Payment Complete</span>
              </div>
              
              <div className="w-16 h-1 bg-primary-200"></div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <span className="ml-2 text-sm font-medium text-primary-600">Configure Chatbot</span>
              </div>
              
              <div className="w-16 h-1 bg-gray-200"></div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">3</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Go Live</span>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <Form />
        </div>
      </section>
    </Layout>
  );
};

export default ConfigurePage;
