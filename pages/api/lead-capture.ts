import type { NextApiRequest, NextApiResponse } from 'next';

interface EnhancedLeadData {
  businessName: string;
  email: string;
  phoneNumber: string;
  monthlyWebsiteVisitors: string;
  currentChallenges: string;
  interestedTier: 'starter' | 'professional' | 'business' | 'enterprise';
  source: string;
  timestamp: string;
  pageUrl: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const leadData: EnhancedLeadData = req.body;
    
    // Validate required fields
    if (!leadData.businessName || !leadData.email || !leadData.phoneNumber || !leadData.interestedTier) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: businessName, email, phoneNumber, interestedTier'
      });
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(leadData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Generate unique lead ID
    const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate lead score based on tier interest and website traffic
    const leadScore = calculateLeadScore(leadData);
    
    // Prepare enhanced data for Airtable
    const airtableData = {
      'Lead ID': leadId,
      'Business Name': leadData.businessName,
      'Email': leadData.email,
      'Phone': leadData.phoneNumber,
      'Monthly Website Visitors': leadData.monthlyWebsiteVisitors || 'Not specified',
      'Current Challenges': leadData.currentChallenges || 'Not specified',
      'Interested Tier': leadData.interestedTier,
      'Expected Monthly Value': getTierValue(leadData.interestedTier),
      'Lead Score': leadScore,
      'Source': leadData.source || 'Enterprise Lead Form',
      'Status': 'New Lead',
      'Created At': leadData.timestamp || new Date().toISOString(),
      'Page URL': leadData.pageUrl || '',
      'Follow Up Priority': getFollowUpPriority(leadData.interestedTier),
      'Estimated Close Date': getEstimatedCloseDate(),
      'Notes': `Interested in ${leadData.interestedTier} tier. Traffic: ${leadData.monthlyWebsiteVisitors || 'Not specified'}`
    };

    // Save to Airtable if configured
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      try {
        const airtableResponse = await fetch(
          `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Leads`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fields: airtableData
            })
          }
        );

        if (!airtableResponse.ok) {
          const errorText = await airtableResponse.text();
          console.error('Airtable error:', errorText);
          // Don't fail the request if Airtable fails
        } else if (process.env.NODE_ENV === 'development') {
          console.log('✅ Enhanced lead saved to Airtable:', leadId);
        }
      } catch (airtableError) {
        console.error('Airtable integration error:', airtableError);
        // Don't fail the request if Airtable fails
      }
    }

    // Send notification email for high-value leads
    if (leadScore === 'Hot' || leadData.interestedTier === 'enterprise' || leadData.interestedTier === 'business') {
      try {
        await sendHighValueLeadNotification(leadData, leadId, leadScore);
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
        // Don't fail the request if notification fails
      }
    }

    // Log the lead capture for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Enhanced Lead Captured:');
      console.log('Lead ID:', leadId);
      console.log('Business:', leadData.businessName);
      console.log('Email:', leadData.email);
      console.log('Phone:', leadData.phoneNumber);
      console.log('Tier Interest:', leadData.interestedTier);
      console.log('Monthly Value:', getTierValue(leadData.interestedTier));
      console.log('Lead Score:', leadScore);
      console.log('Website Traffic:', leadData.monthlyWebsiteVisitors);
      console.log('Source:', leadData.source);
    }

    // Prepare response with next steps
    const responseData = {
      success: true,
      leadId: leadId,
      message: 'Lead captured successfully',
      nextSteps: {
        redirectTo: getCheckoutUrl(leadData.interestedTier),
        followUpTime: '24 hours',
        accountManager: leadScore === 'Hot' ? 'Dedicated manager assigned' : 'Standard support',
        expectedValue: getTierValue(leadData.interestedTier)
      }
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ Enhanced lead capture error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to capture lead. Please try again or contact support directly.'
    });
  }
}

function calculateLeadScore(leadData: EnhancedLeadData): string {
  let score = 0;
  
  // Tier interest scoring
  const tierScores = {
    'starter': 1,
    'professional': 2,
    'business': 3,
    'enterprise': 4
  };
  score += tierScores[leadData.interestedTier];
  
  // Website traffic scoring
  const trafficScores = {
    'under-1000': 1,
    '1000-5000': 2,
    '5000-25000': 3,
    '25000-100000': 4,
    'over-100000': 5
  };
  score += trafficScores[leadData.monthlyWebsiteVisitors] || 0;
  
  // Challenges mentioned (indicates pain point)
  if (leadData.currentChallenges && leadData.currentChallenges.length > 50) {
    score += 1;
  }
  
  // Return lead temperature
  if (score >= 7) return 'Hot';
  if (score >= 5) return 'Warm';
  return 'Cold';
}

function getTierValue(tier: string): number {
  const values = {
    'starter': 297,
    'professional': 497,
    'business': 797,
    'enterprise': 1297
  };
  return values[tier] || 297;
}

function getFollowUpPriority(tier: string): string {
  const priorities = {
    'starter': 'Standard',
    'professional': 'High',
    'business': 'Urgent',
    'enterprise': 'Immediate'
  };
  return priorities[tier] || 'Standard';
}

function getEstimatedCloseDate(): string {
  const closeDate = new Date();
  closeDate.setDate(closeDate.getDate() + 7); // 7 days from now
  return closeDate.toISOString().split('T')[0];
}

function getCheckoutUrl(tier: string): string {
  const urls = {
    'starter': process.env.NEXT_PUBLIC_CHECKOUT_URL_STARTER,
    'professional': process.env.NEXT_PUBLIC_CHECKOUT_URL_PROFESSIONAL,
    'business': process.env.NEXT_PUBLIC_CHECKOUT_URL_BUSINESS,
    'enterprise': process.env.NEXT_PUBLIC_CHECKOUT_URL_ENTERPRISE
  };
  return urls[tier] || urls['professional'] || '';
}

async function sendHighValueLeadNotification(leadData: EnhancedLeadData, leadId: string, leadScore: string) {
  // This would integrate with your email service (SendGrid, AWS SES, etc.)
  // For now, just log the high-value lead
  console.log('🔥 HIGH-VALUE LEAD ALERT:');
  console.log(`Lead ID: ${leadId}`);
  console.log(`Business: ${leadData.businessName}`);
  console.log(`Email: ${leadData.email}`);
  console.log(`Phone: ${leadData.phoneNumber}`);
  console.log(`Tier Interest: ${leadData.interestedTier} ($${getTierValue(leadData.interestedTier)}/month)`);
  console.log(`Lead Score: ${leadScore}`);
  console.log(`Traffic: ${leadData.monthlyWebsiteVisitors}`);
  console.log(`Priority: ${getFollowUpPriority(leadData.interestedTier)}`);
  console.log('⚡ FOLLOW UP IMMEDIATELY!');
}