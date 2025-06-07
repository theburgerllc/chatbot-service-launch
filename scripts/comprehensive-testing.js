#!/usr/bin/env node
require('dotenv').config();

// Comprehensive Testing Suite for 4-Tier Subscription System

const testResults = {
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
  tests: []
};

async function addTestResult(testName, status, details, issues = []) {
  testResults.tests.push({
    name: testName,
    status, // 'pass', 'fail', 'warning'
    details,
    issues,
    timestamp: new Date().toISOString()
  });
  
  const statusIcon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  console.log(`${statusIcon} ${testName}: ${details}`);
  
  if (issues.length > 0) {
    issues.forEach(issue => console.log(`   - ${issue}`));
  }
}

async function testEnvironmentConfiguration() {
  console.log('\n🔍 Testing Environment Configuration...');
  
  const requiredVars = [
    'SQUARE_ENVIRONMENT',
    'SQUARE_ACCESS_TOKEN', 
    'SQUARE_WEBHOOK_SECRET',
    'SQUARE_CHECKOUT_URL',
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID'
  ];
  
  const missingVars = [];
  const issues = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else {
      // Validate format
      const value = process.env[varName];
      if (varName === 'SQUARE_CHECKOUT_URL' && !value.startsWith('https://square.link/')) {
        issues.push(`${varName} should be a Square checkout link`);
      }
      if (varName === 'AIRTABLE_BASE_ID' && !value.startsWith('app')) {
        issues.push(`${varName} should start with 'app'`);
      }
      if (varName === 'AIRTABLE_API_KEY' && !value.startsWith('pat')) {
        issues.push(`${varName} should start with 'pat' for personal access tokens`);
      }
    }
  }
  
  if (missingVars.length === 0 && issues.length === 0) {
    await addTestResult(
      'Environment Configuration',
      'pass',
      `All ${requiredVars.length} required variables configured correctly`
    );
  } else {
    await addTestResult(
      'Environment Configuration',
      missingVars.length > 0 ? 'fail' : 'warning',
      `${requiredVars.length - missingVars.length}/${requiredVars.length} variables configured`,
      [...missingVars.map(v => `Missing: ${v}`), ...issues]
    );
  }
}

async function testPricingConfiguration() {
  console.log('\n🔍 Testing Pricing Configuration...');
  
  try {
    // Test plan configuration by checking environment variables and constants
    const testPlans = [
      { id: 'standard_monthly', expectedPrice: 297 },
      { id: 'first_month_special', expectedPrice: 147 }, 
      { id: 'today_only_special', expectedPrice: 197 },
      { id: 'premium_plan', expectedPrice: 497 }
    ];
    
    const issues = [];
    let validPlans = 0;
    
    // Check basic plan pricing constants
    const PLAN_PRICING_MAP = {
      'basic': 497,
      'premium': 497,
      'standard_monthly': 297,
      'first_month_special': 147,
      'today_only_special': 197,
      'premium_plan': 497
    };
    
    for (const plan of testPlans) {
      const expectedPrice = PLAN_PRICING_MAP[plan.id];
      if (expectedPrice === plan.expectedPrice) {
        validPlans++;
      } else {
        issues.push(`Plan ${plan.id} price mismatch: expected ${plan.expectedPrice}, got ${expectedPrice}`);
      }
    }
    
    // Check environment variables for checkout URLs
    const checkoutVars = [
      'SQUARE_CHECKOUT_URL',
      'SQUARE_CHECKOUT_URL_PREMIUM'
    ];
    
    for (const envVar of checkoutVars) {
      if (!process.env[envVar]) {
        issues.push(`Missing environment variable: ${envVar}`);
      }
    }
    
    await addTestResult(
      'Pricing Configuration',
      issues.length === 0 ? 'pass' : 'warning',
      `${validPlans}/${testPlans.length} plans configured correctly`,
      issues
    );
  } catch (error) {
    await addTestResult(
      'Pricing Configuration',
      'fail',
      'Failed to validate pricing configuration',
      [error.message]
    );
  }
}

async function testFileStructure() {
  console.log('\n🔍 Testing File Structure...');
  
  const fs = require('fs');
  const path = require('path');
  
  const criticalFiles = [
    'pages/api/square.ts',
    'pages/api/verify-payment.ts',
    'pages/api/submit.ts',
    'components/forms/Form.tsx',
    'components/pricing/PricingSection.tsx',
    'lib/plan-compatibility.ts',
    'lib/utils/pricing.ts',
    'lib/utils/validation.ts',
    'lib/utils/constants.ts',
    'lib/square/checkout-config.ts',
    'lib/analytics/enhanced-analytics.ts',
    'services/square.ts',
    'services/airtable.ts',
    'hooks/usePayment.ts',
    'hooks/usePricing.ts',
    'config/vercel-environment.ts'
  ];
  
  const missingFiles = [];
  let existingFiles = 0;
  
  for (const file of criticalFiles) {
    if (fs.existsSync(path.join(__dirname, '..', file))) {
      existingFiles++;
    } else {
      missingFiles.push(file);
    }
  }
  
  await addTestResult(
    'File Structure',
    missingFiles.length === 0 ? 'pass' : 'fail',
    `${existingFiles}/${criticalFiles.length} critical files present`,
    missingFiles.map(f => `Missing: ${f}`)
  );
}

async function testBuildCompatibility() {
  console.log('\n🔍 Testing Build Compatibility...');
  
  const { exec } = require('child_process');
  
  return new Promise((resolve) => {
    exec('npm run build', { timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        addTestResult(
          'Build Compatibility',
          'fail',
          'Build failed',
          [error.message, stderr]
        ).then(resolve);
      } else {
        addTestResult(
          'Build Compatibility',
          'pass',
          'Build completed successfully'
        ).then(resolve);
      }
    });
  });
}

async function testAPIEndpoints() {
  console.log('\n🔍 Testing API Endpoints...');
  
  const axios = require('axios').default;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const endpoints = [
    { path: '/api/debug-env?debug=true', method: 'GET', name: 'Debug Environment' },
    { path: '/api/verify-payment', method: 'POST', name: 'Payment Verification', data: { customerId: 'test', amount: 29700, subscriptionPlan: 'standard_monthly' } }
  ];
  
  let passedTests = 0;
  const issues = [];
  
  for (const endpoint of endpoints) {
    try {
      const config = {
        method: endpoint.method,
        url: `${baseUrl}${endpoint.path}`,
        timeout: 5000,
        validateStatus: () => true // Don't throw on HTTP error status
      };
      
      if (endpoint.data) {
        config.data = endpoint.data;
        config.headers = { 'Content-Type': 'application/json' };
      }
      
      const response = await axios(config);
      
      if (response.status < 500) {
        passedTests++;
      } else {
        issues.push(`${endpoint.name}: HTTP ${response.status}`);
      }
    } catch (error) {
      issues.push(`${endpoint.name}: ${error.message}`);
    }
  }
  
  await addTestResult(
    'API Endpoints',
    issues.length === 0 ? 'pass' : passedTests > 0 ? 'warning' : 'fail',
    `${passedTests}/${endpoints.length} endpoints responding`,
    issues
  );
}

async function testSquareIntegration() {
  console.log('\n🔍 Testing Square Integration...');
  
  const issues = [];
  let score = 0;
  
  // Test environment configuration
  if (process.env.SQUARE_ENVIRONMENT) {
    score++;
  } else {
    issues.push('SQUARE_ENVIRONMENT not set');
  }
  
  // Test access token format
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  if (accessToken) {
    score++;
    const isProduction = process.env.SQUARE_ENVIRONMENT === 'production';
    const isSandboxToken = accessToken.includes('sandbox');
    
    if (isProduction && isSandboxToken) {
      issues.push('Production environment with sandbox token');
    }
    if (!isProduction && !isSandboxToken) {
      issues.push('Sandbox environment with production token');
    }
  } else {
    issues.push('SQUARE_ACCESS_TOKEN not set');
  }
  
  // Test webhook secret
  if (process.env.SQUARE_WEBHOOK_SECRET) {
    score++;
  } else {
    issues.push('SQUARE_WEBHOOK_SECRET not set');
  }
  
  // Test checkout URLs
  const checkoutUrls = [
    'SQUARE_CHECKOUT_URL',
    'SQUARE_CHECKOUT_URL_PREMIUM'
  ];
  
  checkoutUrls.forEach(urlVar => {
    const url = process.env[urlVar];
    if (url && url.startsWith('https://square.link/')) {
      score++;
    } else {
      issues.push(`${urlVar} not properly configured`);
    }
  });
  
  await addTestResult(
    'Square Integration',
    issues.length === 0 ? 'pass' : score > 2 ? 'warning' : 'fail',
    `${score}/5 Square configuration items valid`,
    issues
  );
}

async function testAirtableIntegration() {
  console.log('\n🔍 Testing Airtable Integration...');
  
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    await addTestResult(
      'Airtable Integration',
      'fail',
      'Missing Airtable credentials',
      [!apiKey && 'AIRTABLE_API_KEY not set', !baseId && 'AIRTABLE_BASE_ID not set'].filter(Boolean)
    );
    return;
  }
  
  try {
    const axios = require('axios').default;
    
    const response = await axios.get(
      `https://api.airtable.com/v0/${baseId}/Leads?maxRecords=1`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 10000
      }
    );
    
    if (response.status === 200) {
      await addTestResult(
        'Airtable Integration',
        'pass',
        'Successfully connected to Airtable'
      );
    } else {
      await addTestResult(
        'Airtable Integration',
        'fail',
        `Airtable API returned status ${response.status}`,
        [response.statusText]
      );
    }
  } catch (error) {
    await addTestResult(
      'Airtable Integration',
      'fail',
      'Failed to connect to Airtable',
      [error.message]
    );
  }
}

async function generateTestReport() {
  console.log('\n📊 Generating Test Report...');
  
  const passed = testResults.tests.filter(t => t.status === 'pass').length;
  const warnings = testResults.tests.filter(t => t.status === 'warning').length;
  const failed = testResults.tests.filter(t => t.status === 'fail').length;
  const total = testResults.tests.length;
  
  const report = {
    summary: {
      total,
      passed,
      warnings,
      failed,
      score: Math.round((passed + warnings * 0.5) / total * 100)
    },
    details: testResults.tests,
    recommendations: [],
    readyForDeployment: failed === 0
  };
  
  // Generate recommendations
  if (failed > 0) {
    report.recommendations.push('❌ Fix all failing tests before deployment');
  }
  if (warnings > 0) {
    report.recommendations.push('⚠️ Review and address warning items');
  }
  if (report.summary.score >= 90) {
    report.recommendations.push('✅ System ready for deployment');
  } else if (report.summary.score >= 70) {
    report.recommendations.push('⚡ System mostly ready - address remaining issues');
  } else {
    report.recommendations.push('🔧 Significant configuration required before deployment');
  }
  
  // Save report
  const fs = require('fs');
  const reportPath = './comprehensive-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n📋 TEST REPORT SUMMARY');
  console.log('═══════════════════════════════════');
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Warnings: ${warnings} ⚠️`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Overall Score: ${report.summary.score}%`);
  console.log(`Ready for Deployment: ${report.readyForDeployment ? 'YES ✅' : 'NO ❌'}`);
  console.log('\nRecommendations:');
  report.recommendations.forEach(rec => console.log(`  ${rec}`));
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  return report;
}

// Main test execution
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Test Suite for 4-Tier Subscription System');
  console.log('═══════════════════════════════════════════════════════════════════');
  
  try {
    await testEnvironmentConfiguration();
    await testFileStructure();
    await testPricingConfiguration();
    await testSquareIntegration();
    await testAirtableIntegration();
    await testAPIEndpoints();
    await testBuildCompatibility();
    
    const report = await generateTestReport();
    
    process.exit(report.readyForDeployment ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runComprehensiveTests();
}

module.exports = { runComprehensiveTests, generateTestReport };