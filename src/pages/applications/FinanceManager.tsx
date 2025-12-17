import React from 'react';
import { useNavigate } from 'react-router-dom';

const FinanceManager: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ← Back to Main Application
      </button>
      
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Finance Manager</h1>
        <p className="text-gray-600">Financial Management System</p>
      </div>
    </div>
  );
};

export default FinanceManager;
