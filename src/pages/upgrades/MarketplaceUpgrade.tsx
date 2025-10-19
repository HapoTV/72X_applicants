import React from 'react';
import { ShoppingBag } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const MarketplaceUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="Marketplace"
      featureIcon={ShoppingBag}
      packageType="essential"
      description="Access our comprehensive marketplace where you can discover and purchase business tools, services, and resources tailored to help your business grow. Connect with verified vendors and find solutions that fit your specific needs."
      benefits={[
        'Browse thousands of business tools and services',
        'Connect with verified vendors and service providers',
        'Read reviews and ratings from other business owners',
        'Get exclusive discounts on premium business solutions',
        'Access curated recommendations based on your business needs',
        'Secure payment processing and buyer protection',
      ]}
    />
  );
};

export default MarketplaceUpgrade;
