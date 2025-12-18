import React from 'react';
import { AppWindow, Package, Zap, Shield, TrendingUp } from 'lucide-react';
import UpgradePage from '../components/UpgradePage';

type PackageType = 'startup' | 'essential' | 'premium';

const AppStore: React.FC = () => {
  const userPackage = (localStorage.getItem('userPackage') || 'startup') as PackageType;
  const hasAccess = userPackage === 'essential' || userPackage === 'premium';

  if (!hasAccess) {
    return (
      <UpgradePage
        featureName="App Store"
        featureIcon={AppWindow}
        packageType="essential"
        description="Access our comprehensive App Store with powerful business applications to streamline your operations and boost productivity."
        benefits={[
          "Customer Relationship Management (CRM) system",
          "Finance Manager for tracking and managing finances",
          "AI-powered Tender Management with TenderlyAI",
          "Seamless integration with existing workflows",
          "Professional-grade business tools",
          "Regular updates and new feature releases"
        ]}
      />
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <AppWindow className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">App Store</h1>
        </div>
        
        <p className="text-gray-700 mb-8">
          Welcome to the App Store! Here you can access powerful business applications designed to help you manage and grow your business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CRM App Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">CRM</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage customer relationships, track leads, and streamline your sales process with our comprehensive CRM system.
            </p>
            <a 
              href="/applications/crm" 
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Open CRM</span>
              <TrendingUp className="w-4 h-4" />
            </a>
          </div>

          {/* Finance Manager App Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Finance Manager</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Track expenses, manage budgets, and monitor your financial performance with advanced reporting tools.
            </p>
            <a 
              href="/applications/finance-manager" 
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Open Finance Manager</span>
              <TrendingUp className="w-4 h-4" />
            </a>
          </div>

          {/* TenderlyAI App Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">TenderlyAI</h3>
            </div>
            <p className="text-gray-600 mb-4">
              AI-powered tender management system that helps you create, manage, and track tender applications efficiently.
            </p>
            <a 
              href="/applications/tenderlyai" 
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Open TenderlyAI</span>
              <TrendingUp className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700">
            Click the arrow button next to "App Store" in the sidebar to quickly navigate to any application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppStore;
