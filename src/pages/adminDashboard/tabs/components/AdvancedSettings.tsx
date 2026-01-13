// src/pages/adminDashboard/tabs/components/AdvancedSettings.tsx
import React from 'react';
import type { AdUploadDTO } from '../../../../interfaces/AdData';

interface AdvancedSettingsProps {
  formData: Partial<AdUploadDTO>;
  uploading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  formData,
  uploading,
  onInputChange
}) => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Advanced Settings</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority (1-10)
          </label>
          <input
            type="number"
            name="priority"
            value={formData.priority}
            onChange={onInputChange}
            min="1"
            max="10"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${uploading ? 'opacity-50' : ''}`}
            disabled={uploading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Impressions
          </label>
          <input
            type="number"
            name="maxImpressions"
            value={formData.maxImpressions}
            onChange={onInputChange}
            min="0"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${uploading ? 'opacity-50' : ''}`}
            placeholder="10000"
            disabled={uploading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Clicks
          </label>
          <input
            type="number"
            name="maxClicks"
            value={formData.maxClicks}
            onChange={onInputChange}
            min="0"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${uploading ? 'opacity-50' : ''}`}
            placeholder="1000"
            disabled={uploading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;