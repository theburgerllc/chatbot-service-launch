export default async function handler(req, res) {
  // Set CORS headers with XSS protection
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Only POST requests are accepted.' 
    });
  }

  try {
    // Validate environment variables
    const { 
      AIRTABLE_PERSONAL_ACCESS_TOKEN, 
      AIRTABLE_BASE_ID, 
      AIRTABLE_TABLE_NAME 
    } = process.env;

    if (!AIRTABLE_PERSONAL_ACCESS_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
      console.error('Missing Airtable environment variables');
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error. Please contact support.' 
      });
    }

    // Parse and validate request body
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and message are required fields.' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid email address.' 
      });
    }

    // Prepare Airtable record data
    const recordData = {
      fields: {
        Name: name.trim(),
        Email: email.trim().toLowerCase(),
        Company: company?.trim() || '',
        Message: message.trim(),
        'Submitted At': new Date().toISOString(),
        Source: 'Website Contact Form'
      }
    };

    // Send data to Airtable
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recordData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Airtable API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to save your message. Please try again or contact us directly.' 
      });
    }

    const airtableRecord = await response.json();
    console.log('Contact form submission saved to Airtable:', airtableRecord.id);

    return res.status(200).json({ 
      success: true, 
      message: 'Thank you for your message! We\'ll get back to you soon.',
      recordId: airtableRecord.id 
    });

  } catch (error) {
    console.error('Contact form API error:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: 'An unexpected error occurred. Please try again later.' 
    });
  }
}