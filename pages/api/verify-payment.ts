import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

interface PaymentSession {
  paymentId: string;
  customerId: string;
  amount: number;
  subscriptionPlan: 'basic' | 'premium';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  expiresAt: string;
}

// In production, use a proper database or cache
const paymentSessions = new Map<string, PaymentSession>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (req.method === 'POST') {
    // Create payment session
    const { customerId, amount, subscriptionPlan = 'basic' } = req.body;

    if (!customerId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerId and amount'
      });
    }

    const sessionId = crypto.randomBytes(32).toString('hex');
    const session: PaymentSession = {
      paymentId: sessionId,
      customerId,
      amount,
      subscriptionPlan,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    paymentSessions.set(sessionId, session);

    // Get Square checkout URL based on environment and subscription plan
    const isProduction = process.env.SQUARE_ENVIRONMENT === 'production';
    let checkoutUrl: string;

    if (isProduction) {
      checkoutUrl = subscriptionPlan === 'premium'
        ? process.env.SQUARE_CHECKOUT_URL_PREMIUM || process.env.SQUARE_CHECKOUT_URL || ''
        : process.env.SQUARE_CHECKOUT_URL || '';
    } else {
      checkoutUrl = process.env.SQUARE_CHECKOUT_URL_SANDBOX || "https://square.link/u/duE0KIaE";
    }

    return res.status(200).json({
      success: true,
      sessionId,
      subscriptionPlan,
      checkoutUrl: `${checkoutUrl}?session_id=${sessionId}`
    });
  }

  if (req.method === 'GET') {
    // Verify payment session
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid session ID'
      });
    }

    const session = paymentSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      paymentSessions.delete(sessionId);
      return res.status(410).json({
        success: false,
        message: 'Session expired'
      });
    }

    return res.status(200).json({
      success: true,
      session: {
        status: session.status,
        customerId: session.customerId,
        amount: session.amount,
        createdAt: session.createdAt
      }
    });
  }

  if (req.method === 'PATCH') {
    // Update payment session status (called by webhook)
    const { sessionId, status, paymentId } = req.body;

    if (!sessionId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: sessionId and status'
      });
    }

    const session = paymentSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Update session status
    session.status = status;
    if (paymentId) {
      session.paymentId = paymentId;
    }

    paymentSessions.set(sessionId, session);

    return res.status(200).json({
      success: true,
      message: 'Session updated successfully'
    });
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}
