import React from 'react';
import { plans } from '../pricingHelpers';
import PricingPlanCard from './PricingPlanCard';

interface PricingPlansSectionProps {
  upgradesDisabled: boolean;
}

const PricingPlansSection: React.FC<PricingPlansSectionProps> = ({ upgradesDisabled }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <PricingPlanCard
          key={plan.name}
          plan={plan}
          upgradesDisabled={upgradesDisabled}
        />
      ))}
    </div>
  );
};

export default PricingPlansSection;
