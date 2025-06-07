// Test script for live Airtable integration
// This will test your deployed app with Airtable integration

const testData = {
  businessName: "Live Test Business",
  websiteUrl: "https://livetestbusiness.com",
  email: "owner@livetestbusiness.com",
  phoneNumber: "+1-555-123-4567",
  businessHours: "Monday-Friday 9AM-6PM EST",
  faq1: "What AI chatbot services do you provide?",
  faq2: "How much does it cost to get started?",
  faq3: "How long does setup take?",
  brandColor: "#FF6B35"
};

async function testLiveIntegration() {
  console.log('🧪 Testing Live Airtable Integration...');
  console.log('📝 Test Data:', JSON.stringify(testData, null, 2));
  console.log('');
  
  try {
    const response = await fetch('https://chatbot-service-launch.vercel.app/api/submit', {
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
      console.log('✅ SUCCESS! Integration is working!');
      console.log('🎯 Submission ID:', result.data.submissionId);
      console.log('📅 Estimated Delivery:', result.data.estimatedDelivery);
      console.log('');
      console.log('🔍 Next Steps:');
      console.log('1. Check your Airtable base for the new record');
      console.log('2. Verify all fields are populated correctly');
      console.log('3. Test the form on your live website');
    } else {
      console.log('');
      console.log('❌ Test failed!');
      console.log('🔍 Check your environment variables in Vercel dashboard');
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.log('🔍 Make sure your app is deployed and accessible');
  }
}

// Run the test
testLiveIntegration();
