import React from 'react';
import { Brain } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const AIAnalystUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="AI Business Analyst"
      featureIcon={Brain}
      packageType="premium"
      description="Harness the power of artificial intelligence to analyze your business and get intelligent recommendations. Our AI analyst provides insights, identifies opportunities, and helps you make smarter business decisions."
      benefits={[
        'AI-powered business analysis and insights',
        'Intelligent recommendations for growth',
        'Market trend analysis and predictions',
        'Automated competitor research',
        'Risk assessment and opportunity identification',
        'Natural language queries - just ask questions',
      ]}
    />
  );
};

export default AIAnalystUpgrade;
