import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IndustriesSectionHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16">
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Transform Your Industry with 72X</h2>
          <p className="text-xl text-gray-700 max-w-3xl">
            Tailored solutions designed to address the unique challenges of South African businesses across all sectors
          </p>
        </div>
        <button
          onClick={() => { navigate('/'); setTimeout(() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' }), 120); }}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#60A5FA] hover:bg-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 whitespace-nowrap"
        >
          Jump to Apps
          <ArrowDown className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default IndustriesSectionHeader;