import React from 'react';
import { useNavigate } from 'react-router-dom';

const CRM: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ← Back to Main Application
      </button>
      
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">CRM</h1>
        <p className="text-gray-500">CRM application coming soon...</p>
      </div>
    </div>
  );
};

export default CRM;
