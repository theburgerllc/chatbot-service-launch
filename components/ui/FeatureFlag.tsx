import React from 'react';

interface FeatureFlagProps {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ flag, children, fallback = null }) => {
  const isEnabled = process.env[`NEXT_PUBLIC_${flag.toUpperCase()}`] === 'true';
  
  return isEnabled ? <>{children}</> : <>{fallback}</>;
};

export default FeatureFlag;

// Usage examples:
// <FeatureFlag flag="ENABLE_NEW_PRICING">
//   <NewPricingComponent />
// </FeatureFlag>
//
// <FeatureFlag flag="ENABLE_FIRST_MONTH_PROMO" fallback={<StandardPricing />}>
//   <PromotionalPricing />
// </FeatureFlag>