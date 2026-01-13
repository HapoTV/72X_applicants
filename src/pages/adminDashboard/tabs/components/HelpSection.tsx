// src/pages/adminDashboard/tabs/components/HelpSection.tsx
import React from 'react';

const HelpSection: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h4>
      <ul className="space-y-2 text-sm text-blue-700">
        <li>• Ensure your banner image/video is under 5MB</li>
        <li>• Use clear, high-quality images for better engagement</li>
        <li>• Target specific industries for more relevant ads</li>
        <li>• Monitor CTR (Click-Through Rate) to optimize performance</li>
        <li>• Pause underperforming ads to save budget</li>
      </ul>
    </div>
  );
};

export default HelpSection;