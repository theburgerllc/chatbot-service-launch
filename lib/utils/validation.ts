export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

export function validateBusinessName(name: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!name) {
    errors.push('Business name is required');
  } else if (name.length < 2) {
    errors.push('Business name must be at least 2 characters');
  } else if (name.length > 100) {
    errors.push('Business name must be less than 100 characters');
  }
  
  if (name && !/^[a-zA-Z0-9\s\-\.&']+$/.test(name)) {
    warnings.push('Business name contains special characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateWebsiteUrl(url: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!url) {
    errors.push('Website URL is required');
  } else {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('URL must use http or https protocol');
      }
      if (!urlObj.hostname.includes('.')) {
        errors.push('Please enter a valid domain name');
      }
    } catch {
      errors.push('Please enter a valid URL (e.g., https://yourwebsite.com)');
    }
  }
  
  if (url && !url.startsWith('https://')) {
    warnings.push('Consider using HTTPS for better security');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!phone) {
    errors.push('Phone number is required');
  } else {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    } else if (digitsOnly.length > 15) {
      errors.push('Phone number cannot exceed 15 digits');
    }
    
    // Common US phone number patterns
    const usPhonePattern = /^(\+1\s?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (!usPhonePattern.test(phone) && digitsOnly.length === 10) {
      warnings.push('Phone number format may not be recognized');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateBrandColor(color: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!color) {
    errors.push('Brand color is required');
  } else {
    // Validate HEX color format
    const hexPattern = /^#[0-9A-F]{6}$/i;
    if (!hexPattern.test(color)) {
      errors.push('Please enter a valid HEX color (e.g., #FF5733)');
    } else {
      // Check for very light or very dark colors
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      if (brightness < 50) {
        warnings.push('Very dark colors may not be visible on dark backgrounds');
      } else if (brightness > 200) {
        warnings.push('Very light colors may not be visible on light backgrounds');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateBusinessHours(hours: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!hours) {
    errors.push('Business hours are required');
  } else if (hours.length < 5) {
    errors.push('Please provide more detailed business hours');
  } else if (hours.length > 200) {
    errors.push('Business hours description is too long');
  }
  
  // Check for common time formats
  const timePatterns = [
    /\d{1,2}:\d{2}/,  // 9:00, 10:30
    /\d{1,2}(am|pm)/i, // 9am, 10pm
    /\d{1,2}\s?(am|pm)/i // 9 am, 10 pm
  ];
  
  const hasTimeFormat = timePatterns.some(pattern => pattern.test(hours));
  if (!hasTimeFormat) {
    warnings.push('Consider including specific times (e.g., 9AM-5PM)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateSubscriptionPlan(planId: string): ValidationResult {
  const errors: string[] = [];
  const validPlans = [
    'basic',
    'premium', 
    'standard_monthly',
    'first_month_special',
    'today_only_special',
    'premium_plan'
  ];
  
  if (!planId) {
    errors.push('Subscription plan selection is required');
  } else if (!validPlans.includes(planId)) {
    errors.push('Invalid subscription plan selected');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

export function validateFormData(data: Record<string, unknown>): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  
  // Validate each field
  const emailResult = validateEmail(String(data.email || ''));
  const businessNameResult = validateBusinessName(String(data.businessName || ''));
  const websiteResult = validateWebsiteUrl(String(data.websiteUrl || ''));
  const phoneResult = validatePhoneNumber(String(data.phoneNumber || ''));
  const colorResult = validateBrandColor(String(data.brandColor || ''));
  const hoursResult = validateBusinessHours(String(data.businessHours || ''));
  const planResult = validateSubscriptionPlan(String(data.subscriptionPlan || ''));
  
  // Collect all errors and warnings
  [emailResult, businessNameResult, websiteResult, phoneResult, 
   colorResult, hoursResult, planResult].forEach(result => {
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });
  
  // Validate FAQ fields
  ['faq1', 'faq2', 'faq3'].forEach((faqField, index) => {
    const faqValue = String(data[faqField] || '');
    if (!faqValue) {
      allErrors.push(`FAQ #${index + 1} is required`);
    } else if (faqValue.length < 10) {
      allErrors.push(`FAQ #${index + 1} should be more detailed`);
    } else if (faqValue.length > 500) {
      allErrors.push(`FAQ #${index + 1} is too long (max 500 characters)`);
    }
  });
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}