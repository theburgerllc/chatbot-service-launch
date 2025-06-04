import type { NextApiRequest, NextApiResponse } from 'next';
import { OnboardingFormData, ApiResponse, EmailTemplateData } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    const formData: OnboardingFormData = req.body;

    // Sanitize input data
    Object.keys(formData).forEach(key => {
      if (typeof formData[key as keyof OnboardingFormData] === 'string') {
        formData[key as keyof OnboardingFormData] = (formData[key as keyof OnboardingFormData] as string).trim();
      }
    });

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

    // Log the submission for monitoring
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 New Chatbot Request Received:');
      console.log('Business Name:', formData.businessName);
      console.log('Website:', formData.websiteUrl);
      console.log('Email:', formData.email);
      console.log('Phone:', formData.phoneNumber);
      console.log('Business Hours:', formData.businessHours);
      console.log('FAQs:', [formData.faq1, formData.faq2, formData.faq3]);
      console.log('Brand Color:', formData.brandColor);
      console.log('Timestamp:', new Date().toISOString());
    }

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

    // Generate submission ID
    const submissionId = `CB-${Date.now()}`;
    const estimatedDelivery = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Integrate with Airtable
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      try {
        const airtableResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              'Name': formData.businessName,
              'Business': formData.businessName,
              'Website URL': formData.websiteUrl,
              'Email': formData.email,
              'Phone': formData.phoneNumber,
              'Business Hours': formData.businessHours,
              'FAQ 1': formData.faq1,
              'FAQ 2': formData.faq2,
              'FAQ 3': formData.faq3,
              'Brand Colors': formData.brandColor,
              'Status': 'Setup Pending',
              'Created': new Date().toISOString(),
              'Submission ID': submissionId,
              'Estimated Delivery': estimatedDelivery,
              'Source': 'Website Form',
              'Account Health': 'Pending Setup',
            },
          }),
        });

        if (!airtableResponse.ok) {
          const errorText = await airtableResponse.text();
          console.error('❌ Airtable API Error:', {
            status: airtableResponse.status,
            statusText: airtableResponse.statusText,
            error: errorText,
            submissionId: submissionId,
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: process.env.AIRTABLE_TABLE_NAME
          });
          // Don't throw error - log and continue to prevent form submission failure
          console.warn('⚠️ Continuing without Airtable save due to API error');
        }

        const airtableData = await airtableResponse.json();
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Successfully saved to Airtable:', {
            recordId: airtableData.id,
            submissionId: submissionId,
            businessName: formData.businessName
          });
        }
      } catch (airtableError) {
        console.error('❌ Airtable integration error:', airtableError);
        // Don't fail the entire request if Airtable fails
        // You might want to save to a backup system or queue for retry
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Airtable credentials not configured, skipping integration');
    }

    // Send notification email using EmailJS
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_USER_ID) {
      try {
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

        if (emailResponse.ok && process.env.NODE_ENV === 'development') {
          console.log('✅ Email notification sent successfully');
        } else if (!emailResponse.ok) {
          console.error('❌ Failed to send email notification');
        }
      } catch (emailError) {
        console.error('❌ Email service error:', emailError);
      }
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully! We\'ll be in touch within 24 hours.',
      data: {
        submissionId,
        businessName: formData.businessName,
        estimatedDelivery
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
