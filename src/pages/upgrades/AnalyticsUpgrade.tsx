import React from 'react';
import { BarChart3 } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const AnalyticsUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="Advanced Analytics"
      featureIcon={BarChart3}
      packageType="premium"
      description="Unlock powerful analytics and insights about your business performance. Visualize your data with interactive charts, identify trends, and make data-driven decisions to accelerate your growth."
      benefits={[
        'Real-time business performance dashboards',
        'Advanced data visualization and reporting',
        'Predictive analytics and trend forecasting',
        'Custom reports tailored to your needs',
        'Competitive benchmarking and industry comparisons',
        'Export reports in multiple formats',
      ]}
    />
  );
};

export default AnalyticsUpgrade;
