import React from 'react';
import { Video } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const ExpertsUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="Expert Q&A Sessions"
      featureIcon={Video}
      packageType="premium"
      description="Get direct access to industry experts through live Q&A sessions. Ask questions, get expert advice, and learn from professionals who have successfully navigated the challenges you're facing."
      benefits={[
        'Live video sessions with industry experts',
        'Ask questions and get personalized answers',
        'Access to recorded sessions library',
        'Monthly expert workshops and masterclasses',
        'Network with other business owners',
        'Priority booking for popular sessions',
      ]}
    />
  );
};

export default ExpertsUpgrade;
