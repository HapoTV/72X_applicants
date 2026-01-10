import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import UpgradePage from '../../components/UpgradePage';

type PackageType = 'startup' | 'essential' | 'premium';

const CRM: React.FC = () => {
  const navigate = useNavigate();
  const userPackage = (localStorage.getItem('userPackage') || 'startup') as PackageType;
  const hasAccess = userPackage === 'essential' || userPackage === 'premium';

  if (!hasAccess) {
    return (
      <UpgradePage
        featureName="CRM"
        featureIcon={Package}
        packageType="essential"
        description="Manage customer relationships, track leads, and streamline your sales process with our comprehensive CRM system."
        benefits={[
          "Customer relationship management",
          "Lead tracking and conversion",
          "Sales pipeline management",
          "Customer communication tools",
          "Advanced reporting and analytics",
          "Integration with other business tools"
        ]}
      />
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/dashboard')}
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
