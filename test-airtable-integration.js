// Comprehensive Test Script for Airtable Integration
// Tests both lead capture and full configuration endpoints
// Run with: node test-airtable-integration.js

// Test data for lead capture
const leadTestData = {
  name: "John Smith",
  email: "john@testbusiness.com", 
  businessName: "Test Business LLC"
};

// Test data for full configuration
const configTestData = {
  businessName: "Test Business LLC",
  websiteUrl: "https://testbusiness.com",
  email: "john@testbusiness.com",
  phoneNumber: "+1-555-123-4567",
  businessHours: "Monday-Friday 9AM-6PM EST", 
  faq1: "What services do you offer?",
  faq2: "What are your pricing options?",
  faq3: "How do I get started?",
  brandColor: "#FF6B35"
};

async function testLeadCapture() {
  console.log('\n🧪 Testing Lead Capture API (/api/lead-capture)...');
  console.log('================================================');
  
  try {
    const response = await fetch('http://localhost:3000/api/lead-capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadTestData),
    });

    const result = await response.json();
    
    console.log(`📊 Response Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Lead Capture Test: SUCCESS');
      console.log('📝 Response Data:', {
        success: result.success,
        leadId: result.leadId,
        message: result.message
      });
      console.log('🔗 Check Airtable Leads table: https://airtable.com/appjakbk23EIfJbL9/Leads');
    } else {
      console.log('❌ Lead Capture Test: FAILED');
      console.log('📝 Error Details:', result);
    }
  } catch (error) {
    console.error('❌ Lead Capture Test Error:', error.message);
  }
}

async function testConfigurationSubmit() {
  console.log('\n🧪 Testing Configuration Submit API (/api/submit)...');
  console.log('===================================================');
  
  try {
    const response = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(configTestData),
    });

    const result = await response.json();
    
    console.log(`📊 Response Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Configuration Submit Test: SUCCESS');
      console.log('📝 Response Data:', {
        success: result.success,
        submissionId: result.data?.submissionId,
        businessName: result.data?.businessName,
        estimatedDelivery: result.data?.estimatedDelivery,
        message: result.message
      });
      console.log('🔗 Check Airtable Chatbot_Requests table: https://airtable.com/appjakbk23EIfJbL9/Chatbot_Requests');
    } else {
      console.log('❌ Configuration Submit Test: FAILED');
      console.log('📝 Error Details:', result);
    }
  } catch (error) {
    console.error('❌ Configuration Submit Test Error:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Airtable Integration Tests');
  console.log('====================================================');
  console.log('📋 Test Data Overview:');
  console.log('Lead Data:', leadTestData);
  console.log('Config Data:', configTestData);
  
  // Test lead capture endpoint
  await testLeadCapture();
  
  // Wait a moment between tests
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test configuration submit endpoint
  await testConfigurationSubmit();
  
  console.log('\n🎯 Test Summary');
  console.log('===============');
  console.log('✅ If both tests show SUCCESS, your Airtable integration is working correctly');
  console.log('❌ If any test shows FAILED, check the error details and fix the issues');
  console.log('\n📋 Field Mapping Verification:');
  console.log('Lead Capture → Leads table:');
  console.log('  - name → Name');
  console.log('  - email → Email');
  console.log('  - businessName → Business Name');
  console.log('  - Auto-generated: Lead ID, Source, Status, Lead Score, Created');
  console.log('\nConfiguration → Chatbot_Requests table:');
  console.log('  - businessName → Name & Business');
  console.log('  - phoneNumber → Phone (not Phone Number)');
  console.log('  - brandColor → Brand Colors (not Brand Color)');
  console.log('  - Auto-generated: Status, Source, Account Health, Submission ID, Created, Estimated Delivery');
}

// Check if server is running and start tests
async function checkServerAndRun() {
  try {
    await fetch('http://localhost:3000');
    console.log('✅ Server is running, starting tests...\n');
    await runAllTests();
  } catch (error) {
    console.log('❌ Server is not running. Please start with: npm run dev');
    console.log('   Then run this test script again.');
  }
}

checkServerAndRun();
