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
    // TODO: Verify Square webhook signature
    // const signature = req.headers['x-square-signature'] as string;
    // const body = JSON.stringify(req.body);
    // const isValidSignature = verifySquareSignature(signature, body, process.env.SQUARE_WEBHOOK_SECRET);
    
    // if (!isValidSignature) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Invalid webhook signature'
    //   });
    // }

    const webhookData = req.body;
    
    // Log the webhook event
    console.log('🔔 Square Webhook Received:');
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
  console.log('💰 Payment Created:', paymentData.object.payment.id);
  
  // TODO: Process new payment
  // - Update customer status
  // - Send confirmation email
  // - Trigger chatbot creation process
  // - Update Airtable/database records
}

async function handlePaymentUpdated(paymentData: any) {
  console.log('💰 Payment Updated:', paymentData.object.payment.id);
  
  // TODO: Process payment update
  // - Handle payment status changes
  // - Update customer records
}

async function handleSubscriptionCreated(subscriptionData: any) {
  console.log('📅 Subscription Created:', subscriptionData.object.subscription.id);
  
  // TODO: Process new subscription
  // - Activate customer account
  // - Send welcome email
  // - Start chatbot creation process
  // - Set up recurring billing notifications
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

// TODO: Implement Square signature verification
// function verifySquareSignature(signature: string, body: string, secret: string): boolean {
//   const crypto = require('crypto');
//   const expectedSignature = crypto
//     .createHmac('sha256', secret)
//     .update(body)
//     .digest('base64');
//   
//   return signature === expectedSignature;
// }
