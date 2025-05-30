import React from 'react';
import Layout from '@/components/Layout';
import Form from '@/components/Form';

const HomePage: React.FC = () => {
  return (
    <Layout
      title="Get a 24/7 AI Assistant That Converts Visitors into Paying Clients"
      description="Launch your AI chatbot in under 24 hours. Fully automated. No coding required. Converts leads 24/7, books appointments automatically, and captures every customer inquiry."
    >
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get a <span className="text-primary-600">24/7 AI Assistant</span> That Converts Visitors into{' '}
              <span className="text-primary-600">Paying Clients</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Launch your AI chatbot in under 24 hours. Fully automated. No coding required.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-slide-up">
            <div className="flex items-center justify-center space-x-3 text-lg font-semibold text-gray-700">
              <span className="text-2xl">✅</span>
              <span>Converts leads 24/7</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-lg font-semibold text-gray-700">
              <span className="text-2xl">✅</span>
              <span>Books appointments automatically</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-lg font-semibold text-gray-700">
              <span className="text-2xl">✅</span>
              <span>Captures every customer inquiry</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-16 animate-bounce-slow">
            <a
              href="https://square.link/u/YOUR-ACTUAL-LINK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block btn-primary text-xl px-12 py-4"
            >
              🚀 Start Your Subscription Now
            </a>
            <p className="text-sm text-gray-500 mt-4">
              No setup fees • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our AI Chatbot?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI chatbots are designed to understand your business and provide personalized responses to your customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3">Smart AI Technology</h3>
              <p className="text-gray-600">
                Advanced natural language processing that understands context and provides human-like responses.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast Setup</h3>
              <p className="text-gray-600">
                Get your chatbot live in under 24 hours. No technical knowledge required.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3">Increase Conversions</h3>
              <p className="text-gray-600">
                Convert more visitors into customers with instant responses and smart lead qualification.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-3">Auto Booking</h3>
              <p className="text-gray-600">
                Automatically schedule appointments and sync with your calendar system.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-3">Custom Branding</h3>
              <p className="text-gray-600">
                Match your brand colors and voice for a seamless customer experience.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Analytics & Insights</h3>
              <p className="text-gray-600">
                Track performance and get insights into customer behavior and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              One plan, everything included. No hidden fees.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="card text-center border-2 border-primary-500">
              <div className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-4">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                $297<span className="text-lg text-gray-600">/month</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  24/7 AI chatbot
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Unlimited conversations
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Auto appointment booking
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Custom branding
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Analytics dashboard
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Email support
                </li>
              </ul>
              <a
                href="https://square.link/u/YOUR-ACTUAL-LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the form below and we'll have your AI chatbot ready in 24 hours!
            </p>
          </div>

          <Form />
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
