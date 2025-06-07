// Comprehensive Airtable Integration Test Suite
// Tests connection, schema, lead capture, and configuration endpoints
// Run with: node tests/integration/airtable-comprehensive-test.js

require('dotenv').config({ path: '.env.local' });

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

async function testEnvironmentVariables() {
  console.log('📋 Environment Variables Check:');
  console.log('=====================================');
  console.log('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? 'Set ✅' : 'Missing ❌');
  console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID || 'Missing ❌');
  console.log('');

  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.log('❌ Missing required environment variables');
    return false;
  }
  return true;
}

async function testDirectAirtableConnection() {
  console.log('🔍 Direct Airtable API Connection Test:');
  console.log('=====================================');
  
  try {
    // Test Leads table
    const leadsResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Leads?maxRecords=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (leadsResponse.ok) {
      console.log('✅ Leads table: Connection successful');
    } else {
      const error = await leadsResponse.text();
      console.log('❌ Leads table error:', error);
      return false;
    }

    // Test Chatbot_Requests table
    const requestsResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Chatbot_Requests?maxRecords=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (requestsResponse.ok) {
      console.log('✅ Chatbot_Requests table: Connection successful');
    } else {
      const error = await requestsResponse.text();
      console.log('❌ Chatbot_Requests table error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Direct connection error:', error.message);
    return false;
  }
}

async function testLeadCaptureAPI() {
  console.log('\n🧪 Testing Lead Capture API (/api/lead-capture):');
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
      return true;
    } else {
      console.log('❌ Lead Capture Test: FAILED');
      console.log('📝 Error Details:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Lead Capture Test Error:', error.message);
    return false;
  }
}

async function testConfigurationAPI() {
  console.log('\n🧪 Testing Configuration Submit API (/api/submit):');
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
      return true;
    } else {
      console.log('❌ Configuration Submit Test: FAILED');
      console.log('📝 Error Details:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Configuration Submit Test Error:', error.message);
    return false;
  }
}

async function checkServerStatus() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function runComprehensiveTests() {
  console.log('🚀 Comprehensive Airtable Integration Test Suite');
  console.log('===============================================');
  
  const results = {
    envVars: false,
    directConnection: false,
    leadCapture: false,
    configuration: false,
    serverRunning: false
  };
  
  // Check environment variables
  results.envVars = await testEnvironmentVariables();
  if (!results.envVars) {
    console.log('\n❌ Environment variables check failed. Cannot proceed with tests.');
    return;
  }
  
  // Check if server is running
  results.serverRunning = await checkServerStatus();
  if (!results.serverRunning) {
    console.log('\n❌ Server is not running. Please start with: npm run dev');
    console.log('   Running direct connection test only...\n');
    
    // Run direct connection test only
    results.directConnection = await testDirectAirtableConnection();
  } else {
    console.log('✅ Server is running, proceeding with all tests...\n');
    
    // Run direct connection test
    results.directConnection = await testDirectAirtableConnection();
    
    if (results.directConnection) {
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test API endpoints
      results.leadCapture = await testLeadCaptureAPI();
      await new Promise(resolve => setTimeout(resolve, 1000));
      results.configuration = await testConfigurationAPI();
    }
  }
  
  // Summary
  console.log('\n🎯 Test Results Summary');
  console.log('=======================');
  console.log('Environment Variables:', results.envVars ? '✅ PASS' : '❌ FAIL');
  console.log('Server Status:', results.serverRunning ? '✅ RUNNING' : '❌ NOT RUNNING');
  console.log('Direct Connection:', results.directConnection ? '✅ PASS' : '❌ FAIL');
  console.log('Lead Capture API:', results.leadCapture ? '✅ PASS' : '❌ FAIL');
  console.log('Configuration API:', results.configuration ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = results.envVars && results.directConnection && 
                   (results.serverRunning ? (results.leadCapture && results.configuration) : true);
  
  console.log('\nOverall Status:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  if (!allPassed) {
    console.log('\n🔧 Troubleshooting Steps:');
    if (!results.envVars) console.log('- Check .env.local file for AIRTABLE_API_KEY and AIRTABLE_BASE_ID');
    if (!results.directConnection) console.log('- Verify Airtable API credentials and table permissions');
    if (!results.serverRunning) console.log('- Start development server: npm run dev');
    if (!results.leadCapture) console.log('- Check /api/lead-capture endpoint implementation');
    if (!results.configuration) console.log('- Check /api/submit endpoint implementation');
  }
}

runComprehensiveTests();