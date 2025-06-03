import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { ApiResponse } from '@/types';

// Helper to determine environment
const getSquareConfig = () => {
  const isProduction = process.env.SQUARE_ENVIRONMENT === 'production';

  return {
    webhookSecret: isProduction
      ? process.env.SQUARE_WEBHOOK_SECRET
      : process.env.SQUARE_WEBHOOK_SECRET_SANDBOX,
    applicationId: isProduction
      ? process.env.SQUARE_APPLICATION_ID
      : process.env.SQUARE_APPLICATION_ID_SANDBOX,
    accessToken: isProduction
      ? process.env.SQUARE_ACCESS_TOKEN
      : process.env.SQUARE_ACCESS_TOKEN_SANDBOX,
    environment: process.env.SQUARE_ENVIRONMENT || 'sandbox'
  };
};

// Square signature verification function
function verifySquareSignature(signature: string, body: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64');

  return signature === expectedSignature;
}

// Update payment status in database
async function updatePaymentStatus(paymentId: string, status: string, customerEmail?: string) {
  if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
    try {
      // First, find the customer record by email if provided
      if (customerEmail) {
        const searchResponse = await fetch(
          `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}?filterByFormula={Email}='${customerEmail}'`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
            }
          }
        );

        if (searchResponse.ok) {
          const records = await searchResponse.json();
          if (records.records && records.records.length > 0) {
            const recordId = records.records[0].id;

            // Update the record with payment status
            await fetch(
              `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}/${recordId}`,
              {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  fields: {
                    'Payment Status': status,
                    'Payment ID': paymentId,
                    'Payment Date': new Date().toISOString(),
                    'Status': status === 'COMPLETED' ? 'Paid - Awaiting Setup' : 'Payment Failed'
                  }
                })
              }
            );
          }
        }
      }
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST for webhooks.'
    });
  }

  try {
    const config = getSquareConfig();
    const webhookData = req.body;

    // Verify webhook signature
    if (config.webhookSecret) {
      const signature = req.headers['x-square-signature'] as string;
      const body = JSON.stringify(req.body);

      if (!signature) {
        console.error('❌ Missing webhook signature header');
        return res.status(401).json({
          success: false,
          message: 'Missing webhook signature'
        });
      }

      const isValidSignature = verifySquareSignature(signature, body, config.webhookSecret);

      if (!isValidSignature) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({
          success: false,
          message: 'Invalid webhook signature'
        });
      }

      console.log('✅ Webhook signature verified');
    }


    // Log webhook details
    console.log('🔔 Square Webhook Received:');
    console.log('Environment:', config.environment.toUpperCase());
    console.log('Event Type:', webhookData.type);
    console.log('Event ID:', webhookData.event_id);

    // Handle different webhook event types
    switch (webhookData.type) {
      case 'payment.created':
      case 'payment.updated':
        const payment = webhookData.data.object.payment;
        console.log('💰 Payment Event:', payment.id);
        console.log('💰 Amount:', payment.amount_money);
        console.log('💰 Status:', payment.status);

        // Extract customer email from payment data if available
        const customerEmail = payment.buyer_email_address || payment.receipt_email;

        // Update payment status in database
        await updatePaymentStatus(payment.id, payment.status, customerEmail);

        // Update payment session if session ID is available
        const sessionId = payment.reference_id || payment.note;
        if (sessionId && payment.status === 'COMPLETED') {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/verify-payment`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId,
                status: 'completed',
                paymentId: payment.id
              })
            });
          } catch (error) {
            console.error('Failed to update payment session:', error);
          }
        }
        break;

      case 'subscription.created':
      case 'subscription.updated':
        const subscription = webhookData.data.object.subscription;
        console.log('📅 Subscription Event:', subscription.id);
        console.log('📅 Status:', subscription.status);

        // Handle subscription logic
        if (subscription.status === 'ACTIVE') {
          // Update customer status to active subscriber
          const subscriberEmail = subscription.customer_id; // You'll need to look this up
          await updatePaymentStatus(subscription.id, 'SUBSCRIPTION_ACTIVE', subscriberEmail);
        }
        break;

      default:
        console.log(`⚠️ Unhandled webhook event type: ${webhookData.type}`);
    }

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
