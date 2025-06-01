import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests for debugging
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get Square-related environment variables (without exposing sensitive values)
  const envDebug = {
    SQUARE_ENVIRONMENT: process.env.SQUARE_ENVIRONMENT || 'not set',
    SQUARE_API_VERSION: process.env.SQUARE_API_VERSION || 'not set',
    SQUARE_WEBHOOK_SECRET_SANDBOX: process.env.SQUARE_WEBHOOK_SECRET_SANDBOX ? 'set' : 'not set',
    SQUARE_APPLICATION_ID_SANDBOX: process.env.SQUARE_APPLICATION_ID_SANDBOX ? 'set' : 'not set',
    SQUARE_ACCESS_TOKEN_SANDBOX: process.env.SQUARE_ACCESS_TOKEN_SANDBOX ? 'set' : 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set',
    VERCEL_ENV: process.env.VERCEL_ENV || 'not set'
  };

  console.log('🔍 Environment Debug:', envDebug);

  return res.status(200).json({
    success: true,
    environment: envDebug,
    message: 'Environment variables debug info',
    timestamp: new Date().toISOString()
  });
}
