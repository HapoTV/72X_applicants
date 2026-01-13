// src/pages/adminDashboard/tabs/components/DebugInfo.tsx
import React from 'react';

const DebugInfo: React.FC = () => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-sm">
      <div className="font-semibold mb-1">Debug Info:</div>
      <div>User ID: {localStorage.getItem('userId') || 'Not found'}</div>
    </div>
  );
};

export default DebugInfo;