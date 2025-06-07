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
async function updatePaymentStatus(paymentId: string, status: string, customerEmail?: string, sessionId?: string) {
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
            const existingFields = records.records[0].fields;

            // Enhanced payment status update
            const updateFields: Record<string, string | number | null> = {
              'Payment Status': status,
              'Payment ID': paymentId,
              'Payment Date': new Date().toISOString(),
              'Status': status === 'COMPLETED' ? 'Paid - Awaiting Setup' : 'Payment Failed'
            };

            // Add session-specific data if available
            if (sessionId) {
              // Get session data if available (for enhanced tracking)
              // Note: In a real implementation, you'd need access to paymentSessions here
              // For now, we'll add placeholder logic
              updateFields['Session ID'] = sessionId;
            }

            // Calculate actual savings if this was a promotional plan
            const currentPlan = existingFields['Subscription Plan'] || 'standard_monthly';
            if (currentPlan.includes('special')) {
              const originalPrice = existingFields['Original Price'] || 297;
              const paidPrice = existingFields['Plan Price'] || 297;
              updateFields['Actual Savings'] = originalPrice - paidPrice;
            }

            await fetch(
              `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}/${recordId}`,
              {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  fields: updateFields
                })
              }
            );
            
            console.log(`✅ Payment status updated for ${customerEmail}: ${status}`);
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

        // Extract customer email and session ID
        const customerEmail = payment.buyer_email_address || payment.receipt_email;
        const sessionId = payment.reference_id || payment.note || extractSessionFromUrl(payment.receipt_url);

        // Enhanced payment status update
        await updatePaymentStatus(payment.id, payment.status, customerEmail, sessionId);
        // Update payment session if session ID is available
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
            
            console.log(`✅ Session ${sessionId} marked as completed`);
          } catch (error) {
            console.error('❌ Failed to update payment session:', error);
          }
        }

        // Log enhanced payment details
        console.log('💰 Enhanced Payment Details:');
        console.log('  - Customer Email:', customerEmail);
        console.log('  - Session ID:', sessionId);
        console.log('  - Amount (cents):', payment.amount_money?.amount);
        console.log('  - Currency:', payment.amount_money?.currency);
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

// ADD helper function to extract session ID from URLs:
function extractSessionFromUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('session_id');
  } catch {
    return null;
  }
}
