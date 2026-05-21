import React from 'react';
import { getPlanDescription, gradientBlue } from '../pricingHelpers';
import type { PricingPlan } from '../pricingHelpers';

interface PricingPlanCardProps {
  plan: PricingPlan;
  upgradesDisabled: boolean;
}

const PricingPlanCard: React.FC<PricingPlanCardProps> = ({ plan, upgradesDisabled }) => {
  const isComingSoon = upgradesDisabled && plan.name !== 'Start-up';

  return (
    <div
      className={`bg-white rounded-xl p-8 relative ${
        plan.highlight ? 'shadow-lg border-2' : 'border border-gray-200 hover:border-blue-300 transition-colors'
      }`}
      style={plan.highlight ? { borderColor: '#2258A6' } : {}}
    >
      {plan.highlight && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-white px-4 py-1 rounded-full text-sm font-semibold" style={{ background: gradientBlue }}>
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
      <p className="text-gray-600 mb-6">{getPlanDescription(plan.name, plan.highlight)}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
        <span className="text-gray-600">{plan.period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-600">{f}</span>
          </li>
        ))}
      </ul>
      {plan.ctaType === 'get-started' && (
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-colors">
          Get Started
        </button>
      )}
      {plan.ctaType === 'trial' && (
        <button
          disabled={isComingSoon}
          className={`w-full text-white py-3 rounded-lg font-semibold transition-colors hover:opacity-90 ${isComingSoon ? 'opacity-60 cursor-not-allowed' : ''}`}
          style={{ background: gradientBlue }}
        >
          Start Free Trial
        </button>
      )}
      {plan.ctaType === 'contact' && (
        <button
          disabled={isComingSoon}
          className={`w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-colors ${isComingSoon ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          Contact Sales
        </button>
      )}
    </div>
  );
};

export default PricingPlanCard;
