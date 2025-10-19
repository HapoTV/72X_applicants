import React from 'react';
import { Upload } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const DataInputUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="Data Input"
      featureIcon={Upload}
      packageType="essential"
      description="Easily upload and manage your business data to unlock powerful insights and personalized recommendations. Import data from various sources and let our AI analyze it to help you make better business decisions."
      benefits={[
        'Upload financial statements and business documents',
        'Import data from multiple sources and formats',
        'Automated data processing and analysis',
        'Secure cloud storage for your business data',
        'Get AI-powered insights from your data',
        'Track key metrics and performance indicators',
      ]}
    />
  );
};

export default DataInputUpgrade;
