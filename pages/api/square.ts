import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow POST requests for webhooks
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST for webhooks.'
    });
  }

  try {
    // Verify Square webhook signature (uncomment when webhook is configured)
    if (process.env.SQUARE_WEBHOOK_SECRET) {
      const signature = req.headers['x-square-signature'] as string;
      const body = JSON.stringify(req.body);
      const isValidSignature = verifySquareSignature(signature, body, process.env.SQUARE_WEBHOOK_SECRET);

      if (!isValidSignature) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({
          success: false,
          message: 'Invalid webhook signature'
        });
      }
    } else {
      console.log('⚠️ Webhook signature verification disabled (no secret configured)');
    }

    const webhookData = req.body;

    // Log the webhook event
    const environment = process.env.SQUARE_ENVIRONMENT || 'unknown';
    console.log('🔔 Square Webhook Received:');
    console.log('Environment:', environment.toUpperCase());
    console.log('Event Type:', webhookData.type);
    console.log('Event ID:', webhookData.event_id);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Data:', JSON.stringify(webhookData, null, 2));

    // Handle different webhook event types
    switch (webhookData.type) {
      case 'payment.created':
        await handlePaymentCreated(webhookData.data);
        break;

      case 'payment.updated':
        await handlePaymentUpdated(webhookData.data);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(webhookData.data);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(webhookData.data);
        break;

      case 'subscription.canceled':
        await handleSubscriptionCanceled(webhookData.data);
        break;

      default:
        console.log(`⚠️ Unhandled webhook event type: ${webhookData.type}`);
    }

    // Return success response to Square
    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('❌ Square webhook error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error processing webhook'
    });
  }
}

// Helper functions for handling different webhook events

async function handlePaymentCreated(paymentData: any) {
  const payment = paymentData.object.payment;
  console.log('💰 Payment Created:', payment.id);
  console.log('💰 Amount:', payment.amount_money);
  console.log('💰 Status:', payment.status);

  // Update Airtable record if payment is successful
  if (payment.status === 'COMPLETED' && process.env.AIRTABLE_API_KEY) {
    try {
      // Find customer record by email or create new one
      // This would require additional customer data from Square
      console.log('📝 Updating customer status in Airtable...');

      // TODO: Implement Airtable update logic
      // - Find customer record by payment reference
      // - Update status to "Payment Received"
      // - Trigger chatbot creation workflow

    } catch (error) {
      console.error('❌ Failed to update Airtable:', error);
    }
  }
}

async function handlePaymentUpdated(paymentData: any) {
  console.log('💰 Payment Updated:', paymentData.object.payment.id);

  // TODO: Process payment update
  // - Handle payment status changes
  // - Update customer records
}

async function handleSubscriptionCreated(subscriptionData: any) {
  const subscription = subscriptionData.object.subscription;
  console.log('📅 Subscription Created:', subscription.id);
  console.log('📅 Plan:', subscription.plan_id);
  console.log('📅 Status:', subscription.status);

  // Process new subscription
  if (subscription.status === 'ACTIVE') {
    console.log('🎉 New active subscription! Starting chatbot creation process...');

    // TODO: Implement subscription activation logic
    // - Update Airtable record status to "Subscription Active"
    // - Send welcome email
    // - Trigger chatbot creation workflow
    // - Set up customer onboarding sequence
  }
}

async function handleSubscriptionUpdated(subscriptionData: any) {
  console.log('📅 Subscription Updated:', subscriptionData.object.subscription.id);

  // TODO: Process subscription update
  // - Handle plan changes
  // - Update billing information
  // - Modify service level
}

async function handleSubscriptionCanceled(subscriptionData: any) {
  console.log('📅 Subscription Canceled:', subscriptionData.object.subscription.id);

  // TODO: Process subscription cancellation
  // - Deactivate customer account
  // - Send cancellation confirmation
  // - Schedule data retention/deletion
  // - Update customer status
}

// Square signature verification function
function verifySquareSignature(signature: string, body: string, secret: string): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64');

  return signature === expectedSignature;
}
