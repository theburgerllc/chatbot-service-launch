import type { NextApiRequest, NextApiResponse } from 'next';
import { OnboardingFormData, ApiResponse, EmailTemplateData } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    const formData: OnboardingFormData = req.body;

    // Validate required fields
    const requiredFields = [
      'businessName',
      'websiteUrl',
      'email',
      'phoneNumber',
      'businessHours',
      'faq1',
      'faq2',
      'faq3',
      'brandColor'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof OnboardingFormData]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate URL format
    try {
      new URL(formData.websiteUrl);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid website URL format'
      });
    }

    // Validate HEX color format
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    if (!hexColorRegex.test(formData.brandColor)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand color format. Use HEX format (e.g., #FF5733)'
      });
    }

    // Log the submission (in production, you'd save to database)
    console.log('📝 New Chatbot Request Received:');
    console.log('Business Name:', formData.businessName);
    console.log('Website:', formData.websiteUrl);
    console.log('Email:', formData.email);
    console.log('Phone:', formData.phoneNumber);
    console.log('Business Hours:', formData.businessHours);
    console.log('FAQs:', [formData.faq1, formData.faq2, formData.faq3]);
    console.log('Brand Color:', formData.brandColor);
    console.log('Timestamp:', new Date().toISOString());

    // Prepare data for external integrations
    const emailData: EmailTemplateData = {
      businessName: formData.businessName,
      email: formData.email,
      websiteUrl: formData.websiteUrl,
      phoneNumber: formData.phoneNumber,
      businessHours: formData.businessHours,
      faqs: [formData.faq1, formData.faq2, formData.faq3],
      brandColor: formData.brandColor
    };

    // TODO: Integrate with Airtable
    // Example Airtable integration (uncomment and configure when ready):
    /*
    const airtableResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Business Name': formData.businessName,
          'Website URL': formData.websiteUrl,
          'Email': formData.email,
          'Phone Number': formData.phoneNumber,
          'Business Hours': formData.businessHours,
          'FAQ 1': formData.faq1,
          'FAQ 2': formData.faq2,
          'FAQ 3': formData.faq3,
          'Brand Color': formData.brandColor,
          'Status': 'New',
          'Created': new Date().toISOString(),
        },
      }),
    });

    if (!airtableResponse.ok) {
      throw new Error('Failed to save to Airtable');
    }
    */

    // TODO: Send notification email using EmailJS or similar service
    // Example EmailJS integration (configure when ready):
    /*
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: emailData,
      }),
    });
    */

    // Simulate processing delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully! We\'ll be in touch within 24 hours.',
      data: {
        submissionId: `CB-${Date.now()}`,
        businessName: formData.businessName,
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Form submission error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}
