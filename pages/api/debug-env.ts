import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow in development or with specific query parameter
  if (process.env.NODE_ENV === 'production' && req.query.debug !== 'true') {
    return res.status(404).json({ error: 'Not found' });
  }

  const envCheck = {
    NODE_ENV: process.env.NODE_ENV || 'missing',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'missing',
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY ? 'set' : 'missing',
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID || 'missing',
    AIRTABLE_TABLE_NAME: process.env.AIRTABLE_TABLE_NAME || 'missing',
    SQUARE_WEBHOOK_SECRET: process.env.SQUARE_WEBHOOK_SECRET ? 'set' : 'missing',
    SQUARE_APPLICATION_ID: process.env.SQUARE_APPLICATION_ID ? 'set' : 'missing',
    SQUARE_ACCESS_TOKEN: process.env.SQUARE_ACCESS_TOKEN ? 'set' : 'missing',
    SQUARE_CHECKOUT_URL: process.env.SQUARE_CHECKOUT_URL ? 'set' : 'missing',
    SQUARE_CHECKOUT_URL_PREMIUM: process.env.SQUARE_CHECKOUT_URL_PREMIUM ? 'set' : 'missing',
    SQUARE_CHECKOUT_URL_SANDBOX: process.env.SQUARE_CHECKOUT_URL_SANDBOX ? 'set' : 'missing',
    SQUARE_ENVIRONMENT: process.env.SQUARE_ENVIRONMENT || 'missing',
    SQUARE_API_VERSION: process.env.SQUARE_API_VERSION || 'missing',
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID ? 'set' : 'missing',
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID ? 'set' : 'missing',
    EMAILJS_USER_ID: process.env.EMAILJS_USER_ID ? 'set' : 'missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'missing',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'missing',
  };

  return res.status(200).json({
    message: 'Environment variables check',
    timestamp: new Date().toISOString(),
    environment: envCheck,
    totalVariables: Object.keys(envCheck).length,
    missingVariables: Object.entries(envCheck).filter(([, value]) => value === 'missing').map(([key]) => key)
  });
}
