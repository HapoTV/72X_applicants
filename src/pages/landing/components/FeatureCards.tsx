import React from 'react';

const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
        <div className="text-sm font-bold text-gray-900 mb-1">Targeted audience</div>
        <div className="text-sm text-gray-700">Reach business owners actively looking for tools and services.</div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
        <div className="text-sm font-bold text-gray-900 mb-1">High visibility</div>
        <div className="text-sm text-gray-700">Your ad appears inside the platform dashboard and key areas.</div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
        <div className="text-sm font-bold text-gray-900 mb-1">Flexible campaigns</div>
        <div className="text-sm text-gray-700">Run image or video ads with budgets that suit your goals.</div>
      </div>
    </div>
  );
};

export default FeatureCards;