// Test script for Square Sandbox integration
// Run with: node test-sandbox-integration.js

const testData = {
  businessName: "Sandbox Test Business",
  websiteUrl: "https://sandboxtest.com",
  email: "test@sandboxtest.com",
  phoneNumber: "+1-555-TEST-123",
  businessHours: "Monday-Friday 9AM-5PM EST (SANDBOX TEST)",
  faq1: "How does your AI chatbot work in sandbox?",
  faq2: "What is the sandbox testing process?",
  faq3: "How do I test payments safely?",
  brandColor: "#FF6B35"
};

async function testSandboxIntegration() {
  console.log('🧪 Testing SANDBOX Square Integration...');
  console.log('📝 Test Data:', JSON.stringify(testData, null, 2));
  console.log('');
  
  try {
    // Test local development server
    const response = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('');
      console.log('✅ SANDBOX FORM SUBMISSION SUCCESS!');
      console.log('🎯 Submission ID:', result.data.submissionId);
      console.log('📅 Estimated Delivery:', result.data.estimatedDelivery);
      console.log('');
      console.log('🔍 Next Steps:');
      console.log('1. Check your Airtable base for the new record');
      console.log('2. Test the payment flow with Square test cards');
      console.log('3. Monitor webhook logs for payment events');
      console.log('');
      console.log('💳 Test Card Details:');
      console.log('Card: 4111 1111 1111 1111');
      console.log('Exp: 12/25');
      console.log('CVV: 123');
      console.log('ZIP: 12345');
    } else {
      console.log('');
      console.log('❌ Test failed!');
      console.log('🔍 Check your local server and environment variables');
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.log('🔍 Make sure your local server is running: npm run dev');
  }
}

// Test webhook endpoint
async function testWebhookEndpoint() {
  console.log('');
  console.log('🔗 Testing Webhook Endpoint...');
  
  const testWebhookData = {
    type: 'payment.created',
    event_id: 'test-event-' + Date.now(),
    data: {
      object: {
        payment: {
          id: 'test-payment-' + Date.now(),
          amount_money: {
            amount: 29700, // $297.00 in cents
            currency: 'USD'
          },
          status: 'COMPLETED'
        }
      }
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/square', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testWebhookData),
    });

    const result = await response.json();
    
    console.log('📊 Webhook Response Status:', response.status);
    console.log('📋 Webhook Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ WEBHOOK ENDPOINT WORKING!');
    } else {
      console.log('❌ Webhook test failed!');
    }
  } catch (error) {
    console.error('❌ Webhook test error:', error.message);
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 Starting Sandbox Integration Tests...');
  console.log('=' .repeat(50));
  
  await testSandboxIntegration();
  await testWebhookEndpoint();
  
  console.log('');
  console.log('=' .repeat(50));
  console.log('🎯 Sandbox Testing Complete!');
  console.log('');
  console.log('📋 Manual Steps Remaining:');
  console.log('1. Get sandbox credentials from Square Developer Dashboard');
  console.log('2. Create sandbox checkout link');
  console.log('3. Configure sandbox webhook in Square');
  console.log('4. Test complete payment flow');
}

// Check if server is running first
fetch('http://localhost:3000')
  .then(() => {
    console.log('✅ Local server detected, starting tests...');
    runAllTests();
  })
  .catch(() => {
    console.log('❌ Local server not running.');
    console.log('Please start with: npm run dev');
    console.log('Then run this test again.');
  });
