import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, email, businessName, timestamp, source } = req.body;

    // Validate required fields
    if (!name || !email || !businessName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, businessName'
      });
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const leadId = `LEAD-${Date.now()}`;

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
              fields: {
                'Lead ID': leadId,
                'Name': name,
                'Email': email,
                'Business Name': businessName,
                'Source': source || 'homepage_lead_capture',
                'Created': timestamp || new Date().toISOString(),
                'Status': 'New Lead',
                'Lead Score': 'Hot' // Since they're actively interested
              }
            })
          }
        );

        if (!airtableResponse.ok) {
          const errorText = await airtableResponse.text();
          console.error('Airtable error:', errorText);
          // Don't fail the request if Airtable fails
        } else {
          console.log('✅ Lead saved to Airtable:', leadId);
        }
      } catch (airtableError) {
        console.error('Airtable integration error:', airtableError);
        // Don't fail the request if Airtable fails
      }
    }

    // Log the lead capture
    console.log('📝 New Lead Captured:');
    console.log('Lead ID:', leadId);
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Business:', businessName);
    console.log('Source:', source);
    console.log('Timestamp:', timestamp || new Date().toISOString());

    return res.status(200).json({
      success: true,
      leadId,
      message: 'Lead captured successfully'
    });

  } catch (error) {
    console.error('❌ Lead capture error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
