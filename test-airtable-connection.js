// Test Airtable Connection
// Run with: node test-airtable-connection.js

require('dotenv').config({ path: '.env.local' });

async function testAirtableConnection() {
  console.log('🧪 Testing Airtable Connection...');
  console.log('=====================================');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? 'Set ✅' : 'Missing ❌');
  console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID || 'Missing ❌');
  console.log('AIRTABLE_TABLE_NAME:', process.env.AIRTABLE_TABLE_NAME || 'Missing ❌');
  console.log('');

  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.log('❌ Missing required environment variables');
    return;
  }

  // Test Leads table
  console.log('🧪 Testing Leads table...');
  try {
    const leadsResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Leads`,
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
    }
  } catch (error) {
    console.log('❌ Leads table error:', error.message);
  }

  // Test Chatbot_Requests table
  console.log('🧪 Testing Chatbot_Requests table...');
  try {
    const requestsResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Chatbot_Requests`,
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
    }
  } catch (error) {
    console.log('❌ Chatbot_Requests table error:', error.message);
  }

  console.log('');
  console.log('🎯 Next Steps:');
  console.log('1. If tables are missing, create them in Airtable');
  console.log('2. If permissions error, update API token permissions');
  console.log('3. Update Vercel environment variables');
  console.log('4. Redeploy your application');
}

testAirtableConnection();
