import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

declare global {
  // eslint-disable-next-line no-var
  var sessionCleanupInterval: NodeJS.Timeout | undefined;
}

interface PaymentSession {
  paymentId: string;
  customerId: string;
  amount: number;
  subscriptionPlan: string; // Changed from specific union to string for flexibility
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  expiresAt: string;
  campaignId?: string; // NEW: Track campaign attribution
  planType?: string; // NEW: Track plan category
  originalPrice?: number; // NEW: Track original price for promos
}

// In production, use a proper database or cache like Redis
// This in-memory storage is only suitable for development/testing
const paymentSessions = new Map<string, PaymentSession>();

// Cleanup expired sessions every hour
if (typeof global.sessionCleanupInterval === 'undefined') {
  global.sessionCleanupInterval = setInterval(() => {
    const now = new Date();
    paymentSessions.forEach((session, sessionId) => {
      if (new Date(session.expiresAt) < now) {
        paymentSessions.delete(sessionId);
        console.log(`Cleaned up expired session: ${sessionId}`);
      }
    });
  }, 60 * 60 * 1000); // 1 hour
}

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
    const { customerId, amount, subscriptionPlan = 'standard_monthly', campaignId } = req.body;

    if (!customerId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerId and amount'
      });
    }

    // Import the compatibility functions
    const { getPlanPrice, getPlanType, getSquareCheckoutUrl } = await import('../../lib/plan-compatibility');

    const sessionId = crypto.randomBytes(32).toString('hex');
    
    // Enhanced session with plan validation
    const expectedAmount = getPlanPrice(subscriptionPlan) * 100; // Convert to cents
    if (Math.abs(amount - expectedAmount) > 100) { // Allow $1 variance for fees
      console.warn(`Amount mismatch for plan ${subscriptionPlan}: expected ${expectedAmount}, got ${amount}`);
    }

    const session: PaymentSession = {
      paymentId: sessionId,
      customerId,
      amount,
      subscriptionPlan,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      campaignId: campaignId || null,
      planType: getPlanType(subscriptionPlan),
      originalPrice: subscriptionPlan.includes('special') ? 297 : undefined // Track original price for promos
    };

    paymentSessions.set(sessionId, session);

    // Enhanced checkout URL logic with backward compatibility
    const isProduction = process.env.SQUARE_ENVIRONMENT === 'production';
    let checkoutUrl: string;

    if (isProduction) {
      checkoutUrl = getSquareCheckoutUrl(subscriptionPlan);
    } else {
      checkoutUrl = process.env.SQUARE_CHECKOUT_URL_SANDBOX || "https://square.link/u/duE0KIaE";
    }

    // Add campaign tracking parameters
    const urlParams = new URLSearchParams({
      session_id: sessionId,
      plan: subscriptionPlan,
      ...(campaignId && { campaign: campaignId })
    });

    return res.status(200).json({
      success: true,
      sessionId,
      subscriptionPlan,
      planType: session.planType,
      checkoutUrl: `${checkoutUrl}?${urlParams.toString()}`,
      amount: session.amount,
      originalPrice: session.originalPrice
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
        subscriptionPlan: session.subscriptionPlan,
        planType: session.planType,
        campaignId: session.campaignId,
        originalPrice: session.originalPrice,
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
