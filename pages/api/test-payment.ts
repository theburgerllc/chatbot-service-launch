import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (req.method === 'POST') {
    const { customerId, amount } = req.body;
    
    // Check environment variables
    const envCheck = {
      SQUARE_ENVIRONMENT: process.env.SQUARE_ENVIRONMENT || 'missing',
      SQUARE_CHECKOUT_URL: process.env.SQUARE_CHECKOUT_URL ? 'set' : 'missing',
      SQUARE_CHECKOUT_URL_SANDBOX: process.env.SQUARE_CHECKOUT_URL_SANDBOX ? 'set' : 'missing',
    };
    
    // Get Square checkout URL based on environment
    const isProduction = process.env.SQUARE_ENVIRONMENT === 'production';
    const checkoutUrl = isProduction
      ? process.env.SQUARE_CHECKOUT_URL
      : (process.env.SQUARE_CHECKOUT_URL_SANDBOX || "https://square.link/u/duE0KIaE");
    
    const sessionId = `test-${Date.now()}`;
    
    return res.status(200).json({
      success: true,
      message: 'Test payment endpoint working',
      data: {
        customerId,
        amount,
        sessionId,
        checkoutUrl: `${checkoutUrl}?session_id=${sessionId}`,
        environment: envCheck,
        isProduction,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Test payment endpoint is working',
      method: 'GET',
      timestamp: new Date().toISOString()
    });
  }
  
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}
