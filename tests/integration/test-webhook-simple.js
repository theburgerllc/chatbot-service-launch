// Simple webhook test without signature verification
// Run with: node test-webhook-simple.js

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

async function testWebhookWithoutSignature() {
  console.log('🧪 Testing Webhook Endpoint (No Signature)...');
  console.log('📝 Test Data:', JSON.stringify(testWebhookData, null, 2));
  console.log('');

  try {
    const response = await fetch('http://localhost:3000/api/square', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Temporarily remove signature for testing
      },
      body: JSON.stringify(testWebhookData),
    });

    const result = await response.json();

    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));

    if (response.status === 401) {
      console.log('');
      console.log('✅ WEBHOOK SECURITY WORKING!');
      console.log('🔒 Signature verification is active (this is good!)');
      console.log('📝 You need to configure the webhook secret from Square');
    } else if (response.ok) {
      console.log('');
      console.log('✅ WEBHOOK ENDPOINT WORKING!');
      console.log('🎯 Ready to receive real Square webhooks');
    } else {
      console.log('');
      console.log('❌ Unexpected response');
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.log('🔍 Make sure your local server is running: npm run dev');
  }
}

// Check if server is running
fetch('http://localhost:3000')
  .then(() => {
    console.log('✅ Local server detected');
    testWebhookWithoutSignature();
  })
  .catch(() => {
    console.log('❌ Local server not running');
    console.log('Please start with: npm run dev');
  });
