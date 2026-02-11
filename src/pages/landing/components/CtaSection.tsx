import React from 'react';

interface CtaSectionProps {
  onGetStarted: () => void;
  onScheduleDemo: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ onGetStarted, onScheduleDemo }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Grow Your Business?</h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Join thousands of South African entrepreneurs using 72X to scale their businesses
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-colors"
          >
            Get started
          </button>
          <button
            onClick={onScheduleDemo}
            className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Schedule demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
