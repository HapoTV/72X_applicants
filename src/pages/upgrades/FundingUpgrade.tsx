import React from 'react';
import { DollarSign } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const FundingUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="Funding Finder"
      featureIcon={DollarSign}
      packageType="essential"
      description="Discover funding opportunities perfectly matched to your business. Access grants, loans, investors, and other funding sources. Get step-by-step guidance on application processes and increase your chances of securing capital."
      benefits={[
        'Personalized funding recommendations based on your business',
        'Access to grants, loans, and investor networks',
        'Application assistance and document templates',
        'Track funding applications in one place',
        'Get notified of new funding opportunities',
        'Expert tips to improve your funding success rate',
      ]}
    />
  );
};

export default FundingUpgrade;
