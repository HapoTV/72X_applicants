import React from 'react';

const AdvertisingBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100">
      <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
      Advertising Space Available
    </div>
  );
};

export default AdvertisingBadge;