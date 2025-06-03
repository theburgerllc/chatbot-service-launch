import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '@/components/Layout';
import Form from '@/components/Form';

const ConfigurePage: React.FC = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const { session_id } = router.query;

      if (!session_id || typeof session_id !== 'string') {
        setIsLoading(false);
        return;
      }

      try {
        // Verify payment session with backend
        const response = await axios.get(`/api/verify-payment?sessionId=${session_id}`);

        if (response.data.success && response.data.session.status === 'completed') {
          setIsAuthorized(true);
          setCustomerData(response.data.session);

          // Store verified session
          sessionStorage.setItem('verified_session', JSON.stringify({
            sessionId: session_id,
            timestamp: new Date().toISOString(),
            verified: true
          }));
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [router.query]);

  if (isLoading) {
    return (
      <Layout title="Verifying Payment... | AI Chatbot Configuration">
        <section className="py-20 px-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your payment...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!isAuthorized) {
    return (
      <Layout title="Payment Required | AI Chatbot Configuration">
        <section className="py-20 px-4 min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                🔒 Payment Verification Required
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                We couldn't verify your payment. Please complete your subscription to continue.
              </p>

              <a href="/" className="btn-primary inline-block">
                ← Return to Homepage
              </a>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Authorized user can see the configuration form
  return (
    <Layout title="Configure Your AI Chatbot | AI Chatbot Service">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Payment Verified Successfully!
            </h1>
            <h2 className="text-2xl font-bold text-primary-600 mb-4">
              Now Let's Configure Your AI Chatbot
            </h2>
          </div>

          <Form />
        </div>
      </section>
    </Layout>
  );
};

export default ConfigurePage;
