// Direct Airtable API Test
// Tests the exact credentials from .env.local
// Run with: node test-direct-airtable.js

const API_KEY = 'patcfUDZbPS5Zytoi.ed25ec77c1f77bded38c6b049b720448545083005f4469c13a2a48d569b9b7b8';
const BASE_ID = 'appjakbk23EIfJbL9';

async function testDirectConnection() {
  console.log('🧪 Testing Direct Airtable Connection');
  console.log('=====================================');
  console.log('API Key:', API_KEY.substring(0, 20) + '...');
  console.log('Base ID:', BASE_ID);
  console.log('');

  // Test 1: List bases to verify API key
  console.log('🔍 Step 1: Testing API key by listing bases...');
  try {
    const basesResponse = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (basesResponse.ok) {
      const basesData = await basesResponse.json();
      console.log('✅ API Key is valid');
      console.log('📋 Available bases:');
      basesData.bases.forEach(base => {
        console.log(`  - ${base.name} (${base.id})`);
        if (base.id === BASE_ID) {
          console.log('    ✅ Target base found!');
        }
      });
    } else {
      const error = await basesResponse.text();
      console.log('❌ API Key test failed:', error);
      return;
    }
  } catch (error) {
    console.log('❌ API Key test error:', error.message);
    return;
  }

  console.log('');

  // Test 2: Get base schema
  console.log('🔍 Step 2: Getting base schema...');
  try {
    const schemaResponse = await fetch(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (schemaResponse.ok) {
      const schemaData = await schemaResponse.json();
      console.log('✅ Base schema retrieved');
      console.log('📋 Available tables:');
      schemaData.tables.forEach(table => {
        console.log(`  - ${table.name} (${table.id})`);
        if (table.name === 'Leads' || table.name === 'Chatbot_Requests') {
          console.log('    ✅ Target table found!');
          console.log('    📋 Fields:');
          table.fields.forEach(field => {
            console.log(`      - ${field.name} (${field.type})`);
          });
        }
      });
    } else {
      const error = await schemaResponse.text();
      console.log('❌ Schema test failed:', error);
    }
  } catch (error) {
    console.log('❌ Schema test error:', error.message);
  }

  console.log('');

  // Test 3: Try to read from Leads table
  console.log('🔍 Step 3: Testing Leads table access...');
  try {
    const leadsResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Leads?maxRecords=1`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (leadsResponse.ok) {
      console.log('✅ Leads table: Read access successful');
    } else {
      const error = await leadsResponse.text();
      console.log('❌ Leads table error:', error);
    }
  } catch (error) {
    console.log('❌ Leads table error:', error.message);
  }

  // Test 4: Try to read from Chatbot_Requests table
  console.log('🔍 Step 4: Testing Chatbot_Requests table access...');
  try {
    const requestsResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Chatbot_Requests?maxRecords=1`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (requestsResponse.ok) {
      console.log('✅ Chatbot_Requests table: Read access successful');
    } else {
      const error = await requestsResponse.text();
      console.log('❌ Chatbot_Requests table error:', error);
    }
  } catch (error) {
    console.log('❌ Chatbot_Requests table error:', error.message);
  }

  console.log('');
  console.log('🎯 Summary');
  console.log('==========');
  console.log('If all tests pass, the Airtable integration should work correctly.');
  console.log('If any tests fail, check the error messages for specific issues.');
}

testDirectConnection();
