import React from 'react';
import { BookOpen } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const ResourcesUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="Resources Library"
      featureIcon={BookOpen}
      packageType="premium"
      description="Access an extensive library of business resources including templates, guides, case studies, and expert articles. Everything you need to learn and implement best practices in your business."
      benefits={[
        'Comprehensive business templates and documents',
        'Expert guides and how-to articles',
        'Industry case studies and success stories',
        'Video tutorials and webinars',
        'Downloadable tools and worksheets',
        'Regular updates with new content',
      ]}
    />
  );
};

export default ResourcesUpgrade;
