import React from 'react';
import { Map } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

const RoadmapUpgrade: React.FC = () => {
  return (
    <UpgradePage
      featureName="Roadmap Generator"
      featureIcon={Map}
      packageType="premium"
      description="Create a comprehensive, AI-powered business roadmap tailored to your goals. Get step-by-step guidance on how to achieve your business objectives with actionable milestones and timelines."
      benefits={[
        'AI-generated personalized business roadmaps',
        'Clear milestones and actionable steps',
        'Timeline planning and progress tracking',
        'Adjust roadmap as your business evolves',
        'Industry-specific best practices included',
        'Export and share your roadmap with stakeholders',
      ]}
    />
  );
};

export default RoadmapUpgrade;
