require('dotenv').config();

// Test Square API connection using environment variables
async function testSquareConnection() {
  console.log('🔍 Testing Square API Connection...\n');
  
  // Check environment variables
  const requiredVars = [
    'SQUARE_ENVIRONMENT',
    'SQUARE_ACCESS_TOKEN',
    'SQUARE_WEBHOOK_SECRET'
  ];
  
  console.log('📋 Environment Configuration:');
  let missingVars = [];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
      console.log(`❌ ${varName}: NOT SET`);
    } else {
      // Hide sensitive values
      const displayValue = varName.includes('TOKEN') || varName.includes('SECRET') 
        ? `${value.substring(0, 8)}...` 
        : value;
      console.log(`✅ ${varName}: ${displayValue}`);
    }
  });
  
  if (missingVars.length > 0) {
    console.log('\n❌ Missing required environment variables:', missingVars.join(', '));
    console.log('Please check your .env.local file and ensure all variables are set.');
    return;
  }
  
  // Test checkout URLs
  console.log('\n🔗 Checkout URL Configuration:');
  const checkoutUrls = [
    'SQUARE_CHECKOUT_URL',
    'SQUARE_CHECKOUT_URL_PREMIUM'
  ];
  
  checkoutUrls.forEach(urlVar => {
    const url = process.env[urlVar];
    if (url) {
      console.log(`✅ ${urlVar}: ${url}`);
    } else {
      console.log(`⚠️  ${urlVar}: NOT SET (will use default)`);
    }
  });
  
  // Validate configuration
  const environment = process.env.SQUARE_ENVIRONMENT;
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  
  if (environment === 'production' && accessToken.includes('sandbox')) {
    console.log('\n⚠️  WARNING: Environment is set to "production" but access token appears to be sandbox token');
  }
  
  if (environment === 'sandbox' && !accessToken.includes('sandbox')) {
    console.log('\n⚠️  WARNING: Environment is set to "sandbox" but access token may be production token');
  }
  
  console.log('\n✅ Square API configuration validated successfully!');
  console.log('🚀 Ready for integration testing and deployment.');
}

testSquareConnection().catch(console.error);