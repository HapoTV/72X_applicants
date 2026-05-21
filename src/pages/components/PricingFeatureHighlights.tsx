import React from 'react';
import { featureHighlights } from '../pricingHelpers';

const PricingFeatureHighlights: React.FC = () => {
  return (
    <section className="mt-20 bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Everything you need to scale</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureHighlights.map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingFeatureHighlights;
