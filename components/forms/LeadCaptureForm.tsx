import React, { useState } from 'react';

interface LeadCaptureFormProps {
  title?: string;
  subtitle?: string;
}

interface LeadFormData {
  businessName: string;
  email: string;
  phoneNumber: string;
  monthlyWebsiteVisitors: string;
  currentChallenges: string;
  interestedTier: 'starter' | 'professional' | 'business' | 'enterprise';
}

export default function LeadCaptureForm({ 
  title = "Get Your Enterprise AI Chatbot", 
  subtitle = "Join 50,000+ businesses using AI to automate customer engagement" 
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    businessName: '',
    email: '',
    phoneNumber: '',
    monthlyWebsiteVisitors: '',
    currentChallenges: '',
    interestedTier: 'professional'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'Enterprise Lead Form',
          timestamp: new Date().toISOString(),
          pageUrl: window.location.href
        })
      });

      if (response.ok) {
        setSubmitted(true);
        
        // Store lead ID for session management
        const responseData = await response.json();
        if (responseData.leadId) {
          sessionStorage.setItem('leadId', responseData.leadId);
        }
        
        // Redirect to appropriate checkout based on tier selection
        const checkoutUrls: Record<string, string> = {
          starter: process.env.NEXT_PUBLIC_CHECKOUT_URL_STARTER || '',
          professional: process.env.NEXT_PUBLIC_CHECKOUT_URL_PROFESSIONAL || '',
          business: process.env.NEXT_PUBLIC_CHECKOUT_URL_BUSINESS || '',
          enterprise: process.env.NEXT_PUBLIC_CHECKOUT_URL_ENTERPRISE || ''
        };
        
        setTimeout(() => {
          const checkoutUrl = checkoutUrls[formData.interestedTier];
          if (checkoutUrl) {
            window.open(checkoutUrl, '_blank');
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Lead capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="lead-form-success">
        <h3>Thank You for Your Interest!</h3>
        <p>We're redirecting you to secure checkout for your selected plan.</p>
        <div className="success-benefits">
          <p><strong>What happens next:</strong></p>
          <ul>
            <li>✅ Secure payment processing</li>
            <li>✅ Immediate access to your chatbot setup</li>
            <li>✅ 24-hour deployment guarantee</li>
            <li>✅ Dedicated onboarding support</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-capture-form">
      <div className="form-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="lead-form">
        <div className="form-group">
          <label htmlFor="businessName">Business Name *</label>
          <input
            type="text"
            id="businessName"
            value={formData.businessName}
            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            placeholder="Your Business Name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Business Email *</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="your.email@business.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number *</label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            placeholder="(555) 123-4567"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="monthlyVisitors">Monthly Website Visitors</label>
          <select
            id="monthlyVisitors"
            value={formData.monthlyWebsiteVisitors}
            onChange={(e) => setFormData({...formData, monthlyWebsiteVisitors: e.target.value})}
          >
            <option value="">Select Range</option>
            <option value="under-1000">Under 1,000</option>
            <option value="1000-5000">1,000 - 5,000</option>
            <option value="5000-25000">5,000 - 25,000</option>
            <option value="25000-100000">25,000 - 100,000</option>
            <option value="over-100000">Over 100,000</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="interestedTier">Which Solution Interests You? *</label>
          <select
            id="interestedTier"
            value={formData.interestedTier}
            onChange={(e) => setFormData({...formData, interestedTier: e.target.value as any})}
            required
          >
            <option value="starter">AI Starter ($297/month)</option>
            <option value="professional">Business Pro ($497/month) - Most Popular</option>
            <option value="business">Enterprise Ready ($797/month)</option>
            <option value="enterprise">Market Leader ($1,297/month)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="currentChallenges">Current Customer Service Challenges</label>
          <textarea
            id="currentChallenges"
            value={formData.currentChallenges}
            onChange={(e) => setFormData({...formData, currentChallenges: e.target.value})}
            placeholder="What customer service challenges are you facing? (Optional)"
            rows={3}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Get Your AI Chatbot →'}
        </button>

        <div className="form-guarantee">
          <p><strong>🔒 Secure & Risk-Free</strong></p>
          <p>30-day money-back guarantee • No setup fees until you're satisfied</p>
        </div>
      </form>
    </div>
  );
}