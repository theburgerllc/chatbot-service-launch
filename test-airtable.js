// Test script for Airtable integration
// Run with: node test-airtable.js

const testData = {
  businessName: "Test Business",
  websiteUrl: "https://test.com",
  email: "test@test.com",
  phoneNumber: "+1234567890",
  businessHours: "9AM-5PM EST",
  faq1: "What services do you offer?",
  faq2: "What are your pricing options?",
  faq3: "How do I get started?",
  brandColor: "#FF5733"
};

async function testAirtableIntegration() {
  try {
    console.log('🧪 Testing Airtable integration...');
    
    const response = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Test successful!');
      console.log('Response:', result);
    } else {
      console.log('❌ Test failed!');
      console.log('Error:', result);
    }
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Check if server is running
fetch('http://localhost:3000')
  .then(() => {
    console.log('✅ Server is running, starting test...');
    testAirtableIntegration();
  })
  .catch(() => {
    console.log('❌ Server is not running. Please start with: npm run dev');
  });
