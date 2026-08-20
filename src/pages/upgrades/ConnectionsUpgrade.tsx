import React from 'react';
import { UserPlus } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const ConnectionsUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="Connections"
      featureIcon={UserPlus}
      packageType="essential"
      description="Build meaningful business relationships through connections. Find and connect with other founders, mentors, and partners. Expand your network, collaborate, and unlock new opportunities to grow your business."
      benefits={[
        'Connect with verified founders and entrepreneurs',
        'Build strategic partnerships and collaborations',
        'Direct messaging and relationship management',
        'Discover people by industry and interests',
        'Grow your network and visibility in the community',
        'Access opportunities through referrals and introductions',
      ]}
    />
  );
};

export default ConnectionsUpgrade;
