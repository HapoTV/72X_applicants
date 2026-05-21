import React from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { logoUrl } from '../pricingHelpers';

interface PricingHeaderProps {
  navigate: NavigateFunction;
}

const PricingHeader: React.FC<PricingHeaderProps> = ({ navigate }) => {
  return (
    <header className="bg-[#F5F7FA] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <img
              src={logoUrl}
              alt="72X Logo"
              className="h-14 md:h-16 w-auto"
            />
            
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                Features
              </button>
              <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                Industries
              </button>
              <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                Apps
              </button>
              <button onClick={() => navigate('/pricing')} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                Pricing
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/request-demo')}
              className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
            >
              Request demo
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-black bg-[#60A5FA] hover:bg-[#3B82F6] px-6 py-2.5 rounded-lg font-semibold text-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PricingHeader;
