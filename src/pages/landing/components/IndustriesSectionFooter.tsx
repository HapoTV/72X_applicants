import React from 'react';

const IndustriesSectionFooter: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 text-center">
      <h3 className="text-2xl font-bold text-white mb-4">Don't see your industry?</h3>
      <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
        Our platform is highly customizable to meet the unique needs of any business. Contact us to discuss a tailored solution for your industry.
      </p>
      <button
        className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
        onClick={() => {
          const to = 'admin@hapogroup.co.za';
          const subject = 'Custom solution request';
          window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}`;
        }}
      >
        Get a Custom Solution
      </button>
    </div>
  );
};

export default IndustriesSectionFooter;