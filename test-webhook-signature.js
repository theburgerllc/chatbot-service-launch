// Test webhook with proper Square signature
// Run with: node test-webhook-signature.js

const crypto = require('crypto');

const testWebhookData = {
  type: 'payment.created',
  event_id: 'sandbox-test-event-' + Date.now(),
  data: {
    object: {
      payment: {
        id: 'sandbox-payment-' + Date.now(),
        amount_money: {
          amount: 49700, // $497.00 in cents
          currency: 'USD'
        },
        status: 'COMPLETED',
        source_type: 'CARD',
        card_details: {
          card: {
            card_brand: 'VISA',
            last_4: '1111'
          }
        },
        created_at: new Date().toISOString()
      }
    }
  }
};

function generateSquareSignature(body, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64');
}

async function testWebhookWithSignature() {
  console.log('🧪 Testing Webhook with Proper Square Signature...');

  const webhookSecret = 'AyQY3lSEd--B4QuTKQmVAQ';
  const body = JSON.stringify(testWebhookData);
  const signature = generateSquareSignature(body, webhookSecret);

  console.log('📝 Test Data:', JSON.stringify(testWebhookData, null, 2));
  console.log('🔐 Generated Signature:', signature);
  console.log('');

  try {
    // Test local server first
    console.log('Testing local server (http://localhost:3000)...');
    const localResponse = await fetch('http://localhost:3000/api/square', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-square-signature': signature
      },
      body: body,
    });

    const localResult = await localResponse.json();

    console.log('📊 Local Response Status:', localResponse.status);
    console.log('📋 Local Response:', JSON.stringify(localResult, null, 2));

    if (localResponse.ok) {
      console.log('✅ LOCAL WEBHOOK SUCCESS!');
    } else {
      console.log('❌ Local webhook failed');
    }

    console.log('');
    console.log('-'.repeat(50));
    console.log('');

    // Test Vercel deployment
    console.log('Testing Vercel deployment (https://chatbot-service-launch.vercel.app)...');
    const vercelResponse = await fetch('https://chatbot-service-launch.vercel.app/api/square', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-square-signature': signature
      },
      body: body,
    });

    const vercelResult = await vercelResponse.json();

    console.log('📊 Vercel Response Status:', vercelResponse.status);
    console.log('📋 Vercel Response:', JSON.stringify(vercelResult, null, 2));

    if (vercelResponse.ok) {
      console.log('✅ VERCEL WEBHOOK SUCCESS!');
      console.log('🎉 Your webhook is ready for Square integration!');
    } else {
      console.log('❌ Vercel webhook failed');
      console.log('💡 Make sure you added the environment variables to Vercel');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

async function testCompleteFlow() {
  console.log('🚀 Starting Complete Webhook Test...');
  console.log('='.repeat(60));

  await testWebhookWithSignature();

  console.log('');
  console.log('='.repeat(60));
  console.log('🎯 Test Complete!');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. Add environment variables to Vercel dashboard');
  console.log('2. Test payment flow with Square test card');
  console.log('3. Monitor webhook events in Vercel function logs');
  console.log('');
  console.log('💳 Test Card: 4111 1111 1111 1111');
  console.log('📅 Exp: 12/25, CVV: 123, ZIP: 12345');
}

// Run the test
testCompleteFlow();
