// Airtable Schema Enhancement for 4-Tier Subscription System

export interface AirtableFieldConfig {
  name: string;
  type: string;
  options?: Record<string, unknown>;
  description: string;
  required: boolean;
}

export const ENHANCED_AIRTABLE_SCHEMA: AirtableFieldConfig[] = [
  // Existing Core Fields (preserved)
  {
    name: 'Business Name',
    type: 'singleLineText',
    description: 'Customer business name',
    required: true
  },
  {
    name: 'Email',
    type: 'email',
    description: 'Customer email address',
    required: true
  },
  {
    name: 'Website URL',
    type: 'url',
    description: 'Customer website URL',
    required: true
  },
  {
    name: 'Phone Number',
    type: 'phoneNumber',
    description: 'Customer phone number',
    required: true
  },
  {
    name: 'Business Hours',
    type: 'multilineText',
    description: 'Customer business operating hours',
    required: true
  },
  
  // FAQ Fields
  {
    name: 'FAQ 1',
    type: 'multilineText',
    description: 'First frequently asked question',
    required: true
  },
  {
    name: 'FAQ 2',
    type: 'multilineText',
    description: 'Second frequently asked question',
    required: true
  },
  {
    name: 'FAQ 3',
    type: 'multilineText',
    description: 'Third frequently asked question',
    required: true
  },
  {
    name: 'Brand Color',
    type: 'singleLineText',
    description: 'Customer brand color in HEX format',
    required: true
  },
  
  // Enhanced Subscription and Pricing Fields
  {
    name: 'Subscription Plan',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'basic', color: 'blue' },
        { name: 'premium', color: 'purple' },
        { name: 'standard_monthly', color: 'green' },
        { name: 'first_month_special', color: 'orange' },
        { name: 'today_only_special', color: 'red' },
        { name: 'premium_plan', color: 'purple' }
      ]
    },
    description: 'Selected subscription plan including legacy and new plans',
    required: true
  },
  {
    name: 'Plan Type',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'standard', color: 'blue' },
        { name: 'promotional', color: 'orange' },
        { name: 'premium', color: 'purple' }
      ]
    },
    description: 'Category of the selected plan',
    required: false
  },
  {
    name: 'Plan Price',
    type: 'currency',
    options: {
      precision: 0,
      symbol: '$'
    },
    description: 'Monthly price paid by customer',
    required: false
  },
  {
    name: 'Original Price',
    type: 'currency',
    options: {
      precision: 0,
      symbol: '$'
    },
    description: 'Original price before any discounts (for promotional plans)',
    required: false
  },
  {
    name: 'Savings Amount',
    type: 'currency',
    options: {
      precision: 0,
      symbol: '$'
    },
    description: 'Dollar amount saved with promotional pricing',
    required: false
  },
  {
    name: 'Savings Percentage',
    type: 'percent',
    options: {
      precision: 0
    },
    description: 'Percentage discount for promotional plans',
    required: false
  },
  
  // Campaign Attribution Fields
  {
    name: 'Campaign ID',
    type: 'singleLineText',
    description: 'UTM campaign ID for attribution tracking',
    required: false
  },
  {
    name: 'Campaign Type',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'first_month_promo', color: 'orange' },
        { name: 'today_only_promo', color: 'red' },
        { name: 'weekend_special', color: 'yellow' },
        { name: 'organic', color: 'green' },
        { name: 'direct', color: 'blue' }
      ]
    },
    description: 'Type of campaign that generated this lead',
    required: false
  },
  {
    name: 'Traffic Source',
    type: 'singleLineText',
    description: 'UTM source for traffic attribution',
    required: false
  },
  {
    name: 'Traffic Medium',
    type: 'singleLineText',
    description: 'UTM medium for traffic attribution',
    required: false
  },
  
  // Payment and Status Fields
  {
    name: 'Payment Status',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'PENDING', color: 'yellow' },
        { name: 'COMPLETED', color: 'green' },
        { name: 'FAILED', color: 'red' },
        { name: 'CANCELLED', color: 'gray' }
      ]
    },
    description: 'Current payment status from Square',
    required: false
  },
  {
    name: 'Payment ID',
    type: 'singleLineText',
    description: 'Square payment transaction ID',
    required: false
  },
  {
    name: 'Session ID',
    type: 'singleLineText',
    description: 'Payment session identifier',
    required: false
  },
  {
    name: 'Payment Date',
    type: 'dateTime',
    description: 'Timestamp when payment was completed',
    required: false
  },
  
  // Customer Journey Fields
  {
    name: 'Status',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'New Lead', color: 'blue' },
        { name: 'Payment Pending', color: 'yellow' },
        { name: 'Paid - Awaiting Setup', color: 'orange' },
        { name: 'In Progress', color: 'purple' },
        { name: 'Completed', color: 'green' },
        { name: 'Cancelled', color: 'red' },
        { name: 'Refunded', color: 'gray' }
      ]
    },
    description: 'Current status in the customer journey',
    required: true
  },
  {
    name: 'Created At',
    type: 'dateTime',
    description: 'Timestamp when lead was first created',
    required: true
  },
  {
    name: 'Updated At',
    type: 'dateTime',
    description: 'Timestamp when record was last updated',
    required: false
  },
  
  // Analytics and Performance Fields
  {
    name: 'Conversion Value',
    type: 'currency',
    options: {
      precision: 2,
      symbol: '$'
    },
    description: 'Total value from this customer (for analytics)',
    required: false
  },
  {
    name: 'Lead Source',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'Website Form', color: 'blue' },
        { name: 'Direct Checkout', color: 'green' },
        { name: 'Referral', color: 'purple' },
        { name: 'Advertisement', color: 'orange' },
        { name: 'Social Media', color: 'red' }
      ]
    },
    description: 'How the lead was generated',
    required: false
  },
  {
    name: 'Chatbot Launch Date',
    type: 'date',
    description: 'Expected or actual chatbot launch date',
    required: false
  },
  {
    name: 'Notes',
    type: 'multilineText',
    description: 'Additional notes about the customer or implementation',
    required: false
  }
];

export function generateAirtableSchemaScript(): string {
  const script = `
// Airtable Schema Enhancement Script
// Run this in Airtable Scripting App to add new fields for 4-tier subscription system

let table = base.getTable('Leads'); // Adjust table name if different

console.log('🚀 Starting Airtable schema enhancement...');

// Define new fields to add
const newFields = [
  {
    name: 'Plan Type',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'standard', color: 'blue' },
        { name: 'promotional', color: 'orange' },
        { name: 'premium', color: 'purple' }
      ]
    }
  },
  {
    name: 'Plan Price',
    type: 'currency',
    options: {
      precision: 0,
      symbol: '$'
    }
  },
  {
    name: 'Original Price',
    type: 'currency',
    options: {
      precision: 0,
      symbol: '$'
    }
  },
  {
    name: 'Savings Amount',
    type: 'currency',
    options: {
      precision: 0,
      symbol: '$'
    }
  },
  {
    name: 'Savings Percentage',
    type: 'percent',
    options: {
      precision: 0
    }
  },
  {
    name: 'Campaign ID',
    type: 'singleLineText'
  },
  {
    name: 'Campaign Type',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'first_month_promo', color: 'orange' },
        { name: 'today_only_promo', color: 'red' },
        { name: 'weekend_special', color: 'yellow' },
        { name: 'organic', color: 'green' },
        { name: 'direct', color: 'blue' }
      ]
    }
  },
  {
    name: 'Traffic Source',
    type: 'singleLineText'
  },
  {
    name: 'Traffic Medium',
    type: 'singleLineText'
  },
  {
    name: 'Session ID',
    type: 'singleLineText'
  },
  {
    name: 'Conversion Value',
    type: 'currency',
    options: {
      precision: 2,
      symbol: '$'
    }
  }
];

// Add new fields
async function addFields() {
  for (let field of newFields) {
    try {
      console.log(\`Adding field: \${field.name}\`);
      await table.createFieldAsync(field.name, field.type, field.options);
      console.log(\`✅ Added: \${field.name}\`);
    } catch (error) {
      console.log(\`⚠️ Field \${field.name} may already exist or error: \${error.message}\`);
    }
  }
}

// Update existing Subscription Plan field choices
async function updateSubscriptionPlanField() {
  try {
    const subscriptionPlanField = table.getField('Subscription Plan');
    if (subscriptionPlanField.type === 'singleSelect') {
      console.log('Updating Subscription Plan field choices...');
      await subscriptionPlanField.updateOptionsAsync({
        choices: [
          { name: 'basic', color: 'blue' },
          { name: 'premium', color: 'purple' },
          { name: 'standard_monthly', color: 'green' },
          { name: 'first_month_special', color: 'orange' },
          { name: 'today_only_special', color: 'red' },
          { name: 'premium_plan', color: 'purple' }
        ]
      });
      console.log('✅ Updated Subscription Plan field');
    }
  } catch (error) {
    console.log(\`⚠️ Could not update Subscription Plan field: \${error.message}\`);
  }
}

// Run the enhancement
await addFields();
await updateSubscriptionPlanField();

console.log('🎉 Airtable schema enhancement completed!');
console.log('📊 New fields support 4-tier pricing system and enhanced analytics');
`;

  return script;
}

export function validateAirtableConfiguration(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check required environment variables
  if (!process.env.AIRTABLE_API_KEY) {
    issues.push('AIRTABLE_API_KEY environment variable is not set');
  }
  
  if (!process.env.AIRTABLE_BASE_ID) {
    issues.push('AIRTABLE_BASE_ID environment variable is not set');
  }
  
  if (!process.env.AIRTABLE_TABLE_NAME) {
    issues.push('AIRTABLE_TABLE_NAME environment variable is not set');
  }
  
  // Validate API key format
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (apiKey && !apiKey.startsWith('pat')) {
    issues.push('AIRTABLE_API_KEY should start with "pat" for personal access tokens');
  }
  
  // Validate base ID format
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (baseId && !baseId.startsWith('app')) {
    issues.push('AIRTABLE_BASE_ID should start with "app"');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

export function getAirtableFieldMappingGuide(): string {
  return `
Airtable Field Mapping Guide for Enhanced Schema:

SUBSCRIPTION FIELDS:
- Subscription Plan: Maps to planId from form submission
- Plan Type: Derived from planId (standard/promotional/premium)
- Plan Price: Actual price paid by customer (in dollars)
- Original Price: Full price before discounts (for promotions)
- Savings Amount: Dollar amount saved (Original Price - Plan Price)
- Savings Percentage: Percentage discount applied

CAMPAIGN ATTRIBUTION:
- Campaign ID: UTM campaign parameter from URL
- Campaign Type: Derived from campaign ID or plan type
- Traffic Source: UTM source parameter
- Traffic Medium: UTM medium parameter

PAYMENT TRACKING:
- Payment Status: Square webhook payment status
- Payment ID: Square transaction identifier
- Session ID: Internal payment session identifier
- Payment Date: Timestamp of completed payment

CUSTOMER JOURNEY:
- Status: Current stage in onboarding process
- Created At: Initial lead capture timestamp
- Updated At: Last modification timestamp
- Conversion Value: Total customer value for analytics

ANALYTICS ENHANCEMENT:
- Lead Source: How the customer found the service
- Chatbot Launch Date: Planned or actual go-live date
- Notes: Free-form notes for special requirements

This enhanced schema supports:
✅ 4-tier subscription pricing system
✅ Promotional campaign tracking
✅ Advanced payment processing
✅ Customer journey optimization
✅ Revenue and conversion analytics
`;
}