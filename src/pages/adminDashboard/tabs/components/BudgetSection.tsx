// src/pages/adminDashboard/tabs/components/BudgetSection.tsx
import React from 'react';
import type { AdUploadDTO } from '../../../../interfaces/AdData';
import { DollarSign } from 'lucide-react';

interface BudgetSectionProps {
  formData: Partial<AdUploadDTO>;
  uploading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BudgetSection: React.FC<BudgetSectionProps> = ({
  formData,
  uploading,
  onInputChange
}) => {
  const calculateEstimates = () => {
    const budget = formData.budget || 0;
    const cpc = formData.costPerClick || 0.5;
    const cpm = formData.costPerImpression || 0.01;
    
    const estimatedClicks = cpc > 0 ? Math.floor(budget / cpc) : 0;
    const estimatedImpressions = cpm > 0 ? Math.floor(budget / cpm) : 0;
    
    return { estimatedClicks, estimatedImpressions };
  };

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <DollarSign size={20} />
        Budget & Pricing
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Budget *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ZAR
            </span>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={onInputChange}
              min="0"
              step="0.01"
              className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${uploading ? 'opacity-50' : ''}`}
              placeholder="0.00"
              required
              disabled={uploading}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost Per Click (CPC)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ZAR
            </span>
            <input
              type="number"
              name="costPerClick"
              value={formData.costPerClick}
              onChange={onInputChange}
              min="0"
              step="0.01"
              className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${uploading ? 'opacity-50' : ''}`}
              placeholder="0.50"
              disabled={uploading}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost Per Impression (CPM)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ZAR
            </span>
            <input
              type="number"
              name="costPerImpression"
              value={formData.costPerImpression}
              onChange={onInputChange}
              min="0"
              step="0.001"
              className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${uploading ? 'opacity-50' : ''}`}
              placeholder="0.01"
              disabled={uploading}
            />
          </div>
        </div>
      </div>
      
      {/* Estimates */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h5 className="text-sm font-semibold text-blue-800 mb-2">Estimated Results</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-blue-600">Estimated Clicks</p>
            <p className="text-lg font-semibold text-blue-800">
              {calculateEstimates().estimatedClicks.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-600">Estimated Impressions</p>
            <p className="text-lg font-semibold text-blue-800">
              {calculateEstimates().estimatedImpressions.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSection;