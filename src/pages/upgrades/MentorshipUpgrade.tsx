import React from 'react';
import { MessageCircle } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const MentorshipUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="Mentorship"
      featureIcon={MessageCircle}
      packageType="essential"
      description="Connect with experienced business mentors who can guide you through challenges, share insights, and help accelerate your business growth. Get personalized advice from industry experts who understand your journey."
      benefits={[
        'One-on-one mentorship sessions with industry experts',
        'Personalized guidance tailored to your business goals',
        'Access to a network of successful entrepreneurs',
        'Regular check-ins and progress tracking',
        'Industry-specific advice and best practices',
        'Accountability partner to keep you on track',
      ]}
    />
  );
};

export default MentorshipUpgrade;
