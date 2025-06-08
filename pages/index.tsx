import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import LeadCaptureForm from '@/components/forms/LeadCaptureForm';
import PricingSection from '@/components/pricing/PricingSection';
import { analytics } from '@/lib/analytics';
import axios from 'axios';

// Note: Square checkout URLs are now handled dynamically in the API based on subscription plan

const HomePage: React.FC = () => {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const handleStartSubscription = async (plan: string = 'professional') => {
    setIsCreatingCheckout(true);

    try {
      const leadId = sessionStorage.getItem('leadId');

      // Use compatibility layer for pricing
      const { getPlanPrice, getPlanType } = await import('@/lib/plan-compatibility');
      const planPrice = getPlanPrice(plan);
      const amount = planPrice * 100; // Convert to cents

      // Enhanced session creation with campaign tracking
      const campaignId = new URLSearchParams(window.location.search).get('utm_campaign') || 
                        sessionStorage.getItem('campaignId') || 
                        null;

      // Track plan selection
      analytics.trackPlanSelected(plan, getPlanType(plan), amount, campaignId || undefined);

      const response = await axios.post('/api/verify-payment', {
        customerId: leadId || 'direct-checkout',
        amount: amount,
        subscriptionPlan: plan,
        campaignId: campaignId
      });

      if (response.data.success && response.data.checkoutUrl) {
        // Track payment initiation
        analytics.trackPaymentStarted(plan, getPlanType(plan), amount, campaignId || undefined);

        // Store enhanced session data
        sessionStorage.setItem('selectedPlan', plan);
        sessionStorage.setItem('planPrice', planPrice.toString());
        sessionStorage.setItem('planType', response.data.planType || 'standard');
        
        if (response.data.originalPrice) {
          sessionStorage.setItem('originalPrice', response.data.originalPrice.toString());
          sessionStorage.setItem('savings', (response.data.originalPrice - planPrice).toString());
        }

        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  // Track campaign views from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('utm_campaign');
    const planId = urlParams.get('plan') || 'standard_monthly';
    
    if (campaignId) {
      sessionStorage.setItem('campaignId', campaignId);
      analytics.trackCampaignView(campaignId, planId);
    }
  }, []);

  return (
    <Layout
      title="Get a 24/7 AI Assistant That Converts Visitors into Paying Clients"
      description="Launch your AI chatbot in under 24 hours. Fully automated. No coding required."
    >
      <Head>
        <title>Enterprise AI Chatbots | 24-Hour Deployment | Powered by Fortune 500 Technology</title>
        <meta name="description" content="Deploy enterprise-grade AI chatbots in 24 hours. Powered by the same technology used by 50,000+ global brands. Multi-channel automation with 99.99% uptime guarantee." />
        <meta name="keywords" content="enterprise AI chatbots, automated customer service, ChatGPT integration, omnichannel chatbots, business automation, WhatsApp chatbots, Facebook messenger bots" />
        
        <meta property="og:title" content="Enterprise AI Chatbots | 24-Hour Deployment" />
        <meta property="og:description" content="Deploy enterprise-grade AI chatbots in 24 hours. Powered by technology trusted by 50,000+ global brands." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aichatbotsolutions.io" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Enterprise AI Chatbots | 24-Hour Deployment" />
        <meta name="twitter:description" content="Deploy enterprise-grade AI chatbots in 24 hours. Powered by technology trusted by 50,000+ global brands." />
        
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://aichatbotsolutions.io" />
      </Head>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-headline">
              Enterprise AI Chatbots That Work While You Sleep
            </h1>
            <p className="hero-subheadline">
              Powered by award-winning technology trusted by 50,000+ global brands
            </p>
            <p className="hero-description">
              Deploy intelligent chatbots across all channels in 24 hours. No coding required. 
              Enterprise-grade reliability with unlimited scalability.
            </p>
            
            <div className="trust-indicators">
              <div className="trust-item">
                <span className="checkmark">✅</span>
                <span>80+ Native Integrations Including ChatGPT</span>
              </div>
              <div className="trust-item">
                <span className="checkmark">✅</span>
                <span>Omnichannel Deployment (Website, WhatsApp, Facebook, Instagram)</span>
              </div>
              <div className="trust-item">
                <span className="checkmark">✅</span>
                <span>Enterprise-Grade Security & 99.99% Uptime SLA</span>
              </div>
              <div className="trust-item">
                <span className="checkmark">✅</span>
                <span>24-Hour Guaranteed Deployment</span>
              </div>
            </div>

            <div className="credibility-badge">
              <span className="badge-text">Powered by BotPenguin - The Platform Behind 50,000+ Global Brands</span>
            </div>

            <div className="hero-cta">
              <button 
                className="primary-cta"
                onClick={() => handleStartSubscription('professional')}
                disabled={isCreatingCheckout}
              >
                {isCreatingCheckout ? 'Processing...' : 'Start Your Enterprise AI Journey'}
              </button>
              <button className="secondary-cta">View Live Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="credibility-section">
        <div className="container">
          <div className="credibility-header">
            <h2>Powered by Enterprise Technology</h2>
            <p>Join thousands of businesses using the same platform that powers Fortune 500 companies</p>
          </div>
          
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-number">50,000+</div>
              <div className="metric-label">Global Brands Trust Our Platform</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">80+</div>
              <div className="metric-label">Native Integrations Including ChatGPT</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">99.99%</div>
              <div className="metric-label">Uptime SLA Guarantee</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">24 Hours</div>
              <div className="metric-label">Guaranteed Deployment Time</div>
            </div>
          </div>

          <div className="platform-features">
            <h3>Enterprise-Grade Capabilities</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h4>ChatGPT Integration</h4>
                <p>Latest AI technology with custom training on your business data</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h4>Omnichannel Deployment</h4>
                <p>Website, WhatsApp, Facebook, Instagram, Telegram - all in one platform</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h4>Enterprise Security</h4>
                <p>Bank-level encryption, GDPR compliance, and SOC 2 certified infrastructure</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Advanced Analytics</h4>
                <p>Real-time insights, conversion tracking, and performance optimization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-proposition-section">
        <div className="container">
          <div className="value-header">
            <h2>Why Choose Our AI Chatbot Platform?</h2>
            <p>Enterprise technology made simple. Deploy in 24 hours, scale infinitely.</p>
          </div>

          <div className="value-grid">
            <div className="value-item">
              <div className="value-icon">⚡</div>
              <h3>Lightning Fast Deployment</h3>
              <p>Go live in 24 hours with our automated deployment system. No technical knowledge required.</p>
              <ul>
                <li>Automated setup process</li>
                <li>Pre-built industry templates</li>
                <li>Instant testing and validation</li>
              </ul>
            </div>

            <div className="value-item">
              <div className="value-icon">🚀</div>
              <h3>Unlimited Scalability</h3>
              <p>Powered by the same infrastructure used by Fortune 500 companies. Scale to millions of conversations.</p>
              <ul>
                <li>Auto-scaling infrastructure</li>
                <li>99.99% uptime guarantee</li>
                <li>Global content delivery network</li>
              </ul>
            </div>

            <div className="value-item">
              <div className="value-icon">🎯</div>
              <h3>Increase Conversions</h3>
              <p>Convert more visitors into customers with AI-powered lead qualification and instant responses.</p>
              <ul>
                <li>24/7 lead capture</li>
                <li>Intelligent conversation routing</li>
                <li>Automated appointment booking</li>
              </ul>
            </div>

            <div className="value-item">
              <div className="value-icon">🔧</div>
              <h3>No-Code Customization</h3>
              <p>Easy drag-and-drop builder with advanced AI capabilities. No developers needed.</p>
              <ul>
                <li>Visual flow builder</li>
                <li>Custom AI training</li>
                <li>Brand customization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Tier Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="pricing-header">
            <h2>Choose Your AI Automation Level</h2>
            <p>Enterprise-grade technology with transparent pricing. No hidden fees.</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>AI Starter</h3>
                <div className="price">
                  <span className="price-amount">$297</span>
                  <span className="price-period">/month</span>
                </div>
                <div className="setup-fee">$297 setup fee</div>
                <p className="tier-description">Perfect for small businesses starting their AI journey</p>
              </div>

              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Website Chatbot Integration</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">ChatGPT-Powered Conversations</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">5,000 Messages Per Month</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Basic Analytics Dashboard</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Email Support</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Mobile-Responsive Design</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">FAQ Automation</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Lead Capture Integration</span>
                </div>
              </div>

              <div className="pricing-cta">
                <button 
                  className="cta-button secondary"
                  onClick={() => handleStartSubscription('starter')}
                  disabled={isCreatingCheckout}
                >
                  {isCreatingCheckout ? 'Processing...' : 'Start Your AI Journey'}
                </button>
              </div>
            </div>

            <div className="pricing-card popular">
              <div className="pricing-badge">Most Popular</div>
              
              <div className="pricing-header">
                <h3>Business Pro</h3>
                <div className="price">
                  <span className="price-amount">$497</span>
                  <span className="price-period">/month</span>
                </div>
                <div className="setup-fee">$397 setup fee</div>
                <p className="tier-description">Multi-channel automation for growing businesses</p>
              </div>

              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Everything in AI Starter</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Multi-Channel Deployment</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Website + WhatsApp + Facebook</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">15,000 Messages Per Month</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Advanced AI Training</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Priority Support</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Custom Branding</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Advanced Analytics</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Appointment Booking</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">CRM Integration</span>
                </div>
              </div>

              <div className="pricing-cta">
                <button 
                  className="cta-button primary"
                  onClick={() => handleStartSubscription('professional')}
                  disabled={isCreatingCheckout}
                >
                  {isCreatingCheckout ? 'Processing...' : 'Scale Your Business'}
                </button>
              </div>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise Ready</h3>
                <div className="price">
                  <span className="price-amount">$797</span>
                  <span className="price-period">/month</span>
                </div>
                <div className="setup-fee">$497 setup fee</div>
                <p className="tier-description">Complete automation suite for established businesses</p>
              </div>

              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Everything in Business Pro</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">All Communication Channels (5+)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Unlimited Messages</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Advanced Integrations (Zapier, API)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Dedicated Account Manager</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Custom Workflow Builder</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">API Access</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">White-Label Options</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Advanced Security</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Custom Reporting</span>
                </div>
              </div>

              <div className="pricing-cta">
                <button 
                  className="cta-button secondary"
                  onClick={() => handleStartSubscription('business')}
                  disabled={isCreatingCheckout}
                >
                  {isCreatingCheckout ? 'Processing...' : 'Dominate Your Market'}
                </button>
              </div>
            </div>

            <div className="pricing-card">
              <div className="pricing-badge">Premium</div>
              
              <div className="pricing-header">
                <h3>Market Leader</h3>
                <div className="price">
                  <span className="price-amount">$1,297</span>
                  <span className="price-period">/month</span>
                </div>
                <div className="setup-fee">$797 setup fee</div>
                <p className="tier-description">Complete white-label solution for market leaders</p>
              </div>

              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Everything in Enterprise Ready</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Complete White-Label Solution</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Unlimited Everything</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Custom Development</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">24/7 Dedicated Support</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Multi-Location Setup</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Enterprise SLA Guarantee</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Custom Integrations</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Dedicated Infrastructure</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span className="feature-text">Compliance & Security Audits</span>
                </div>
              </div>

              <div className="pricing-cta">
                <button 
                  className="cta-button secondary"
                  onClick={() => handleStartSubscription('enterprise')}
                  disabled={isCreatingCheckout}
                >
                  {isCreatingCheckout ? 'Processing...' : 'Lead Your Industry'}
                </button>
              </div>
            </div>
          </div>

          <div className="pricing-guarantee">
            <div className="guarantee-content">
              <h4>30-Day Money-Back Guarantee</h4>
              <p>Not satisfied? Get a full refund within 30 days. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadCaptureForm 
            title="Get Your Enterprise AI Chatbot"
            subtitle="Join 50,000+ businesses using AI to automate customer engagement"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our enterprise chatbot platform</p>
          </div>
          
          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-question">
                <h3>How quickly can our chatbot be deployed?</h3>
              </div>
              <div className="faq-answer">
                <p>Your enterprise-grade chatbot will be fully deployed and operational within 24 hours of payment confirmation. Our automated deployment system handles all technical setup, testing, and integration.</p>
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <h3>What makes this different from custom chatbot development?</h3>
              </div>
              <div className="faq-answer">
                <p>We use the same proven technology platform that powers 50,000+ global brands, eliminating months of development time and technical risks. You get enterprise-grade reliability immediately.</p>
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <h3>Can the chatbot integrate with our existing business systems?</h3>
              </div>
              <div className="faq-answer">
                <p>Yes! Our platform includes 80+ native integrations including CRM systems, payment processors, calendars, and more. Custom integrations are available for enterprise clients.</p>
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <h3>What channels does the chatbot work on?</h3>
              </div>
              <div className="faq-answer">
                <p>Depending on your plan, your chatbot can operate on your website, WhatsApp, Facebook Messenger, Instagram, Telegram, and more. All conversations are managed from one unified dashboard.</p>
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <h3>Is there ongoing support and maintenance?</h3>
              </div>
              <div className="faq-answer">
                <p>Absolutely. All plans include ongoing support, automatic updates, security patches, and performance monitoring. Enterprise clients receive dedicated account management.</p>
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <h3>What happens if we're not satisfied?</h3>
              </div>
              <div className="faq-answer">
                <p>We offer a 30-day money-back guarantee. If you're not completely satisfied with your chatbot's performance, we'll provide a full refund, no questions asked.</p>
              </div>
            </div>
          </div>
          
          <div className="faq-cta">
            <h3>Still have questions?</h3>
            <p>Schedule a 15-minute demo to see how our platform can transform your customer engagement</p>
            <button className="demo-cta-button">Schedule Free Demo</button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="enterprise-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>AI Chatbot Solutions</h4>
              <p>Enterprise-grade AI automation powered by technology trusted by 50,000+ global brands.</p>
              <div className="footer-badges">
                <span className="footer-badge">🔒 SOC 2 Certified</span>
                <span className="footer-badge">🌟 99.99% Uptime</span>
                <span className="footer-badge">⚡ 24hr Deployment</span>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Solutions</h4>
              <ul>
                <li><a href="#pricing">AI Starter ($297/month)</a></li>
                <li><a href="#pricing">Business Pro ($497/month)</a></li>
                <li><a href="#pricing">Enterprise Ready ($797/month)</a></li>
                <li><a href="#pricing">Market Leader ($1,297/month)</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Enterprise Features</h4>
              <ul>
                <li>ChatGPT Integration</li>
                <li>Multi-Channel Deployment</li>
                <li>80+ Native Integrations</li>
                <li>Advanced Analytics</li>
                <li>White-Label Options</li>
                <li>Enterprise Security</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>24/7 Enterprise Support</li>
                <li>Implementation Assistance</li>
                <li>Training & Onboarding</li>
                <li>Technical Documentation</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-legal">
              <p>&copy; 2025 AI Chatbot Solutions. All rights reserved.</p>
              <div className="footer-links">
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
                <a href="/security">Security</a>
              </div>
            </div>
            
            <div className="footer-powered">
              <p>Powered by BotPenguin - Trusted by 50,000+ Global Brands</p>
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default HomePage;
