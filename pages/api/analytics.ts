import type { NextApiRequest, NextApiResponse } from 'next';
import { analytics } from '../../lib/analytics';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (req.method === 'GET') {
    // Return analytics summary (for admin/debugging)
    if (req.query.secret !== process.env.ANALYTICS_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const summary = analytics.getAnalyticsSummary();
    return res.status(200).json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    // Track custom events from frontend
    const { event, planId, planType, amount, campaignId } = req.body;

    if (!event || !planId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: event, planId'
      });
    }

    try {
      switch (event) {
        case 'plan_selected':
          analytics.trackPlanSelected(planId, planType, amount, campaignId);
          break;
        case 'payment_started':
          analytics.trackPaymentStarted(planId, planType, amount, campaignId);
          break;
        case 'payment_completed':
          analytics.trackPaymentCompleted(planId, planType, amount, campaignId);
          break;
        case 'campaign_viewed':
          analytics.trackCampaignView(campaignId, planId);
          break;
        default:
          return res.status(400).json({
            success: false,
            message: `Unknown event type: ${event}`
          });
      }

      return res.status(200).json({
        success: true,
        message: 'Event tracked successfully'
      });
    } catch (error) {
      console.error('Analytics error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to track event'
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}