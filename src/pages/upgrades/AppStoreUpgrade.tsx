import React from 'react';
import { Wrench } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const AppStoreUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="App Store"
      featureIcon={Wrench}
      packageType="essential"
      description="Access a curated collection of business applications and tools designed to streamline your operations. From accounting software to project management tools, find everything you need to run your business efficiently."
      benefits={[
        'Exclusive business apps and productivity tools',
        'Integrated solutions that work seamlessly together',
        'Special pricing for SeventyTwoX members',
        'Expert reviews and recommendations',
        'Easy installation and setup support',
        'Regular updates and new app additions',
      ]}
    />
  );
};

export default AppStoreUpgrade;
