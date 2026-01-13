// src/pages/adminDashboard/tabs/components/TargetingOptions.tsx
import React from 'react';
import { AdTargetingType } from '../../../../interfaces/AdData';
import { Target, Users, Building, User, Package } from 'lucide-react';

interface UserData {
  userId: string;
  fullName: string;
  email: string;
  industry?: string;
  businessReference?: string;
  role: string;
  userPackage: string;
}

interface TargetingOptionsProps {
  targetingType: AdTargetingType;
  targetValue: string;
  userData: UserData | null;
  uploading: boolean;
  onTargetingChange: (type: AdTargetingType) => void;
  onTargetValueChange: (value: string) => void;
}

const TargetingOptions: React.FC<TargetingOptionsProps> = ({
  targetingType,
  targetValue,
  userData,
  uploading,
  onTargetingChange,
  onTargetValueChange
}) => {
  const formatTargetingType = (type: AdTargetingType) => {
    switch (type) {
      case AdTargetingType.ALL_USERS: return 'All Users';
      case AdTargetingType.SPECIFIC_INDUSTRY: return 'Specific Industry';
      case AdTargetingType.BUSINESS_REFERENCE: return 'Business Reference';
      case AdTargetingType.USER_ROLE: return 'User Role';
      case AdTargetingType.USER_PACKAGE: return 'User Package';
      default: return type;
    }
  };

  const getDefaultTargetValue = (type: AdTargetingType): string => {
    if (!userData) return '';
    
    switch (type) {
      case AdTargetingType.SPECIFIC_INDUSTRY:
        return userData.industry || '';
      case AdTargetingType.BUSINESS_REFERENCE:
        return userData.businessReference || '';
      case AdTargetingType.USER_ROLE:
        return userData.role;
      case AdTargetingType.USER_PACKAGE:
        return userData.userPackage;
      default:
        return '';
    }
  };

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Target size={20} />
        Targeting Options
      </h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who should see this ad?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.values(AdTargetingType).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onTargetingChange(type)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${uploading ? 'opacity-50 cursor-not-allowed' : ''} ${
                  targetingType === type
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={uploading}
              >
                {type === AdTargetingType.ALL_USERS && <Users size={20} />}
                {type === AdTargetingType.SPECIFIC_INDUSTRY && <Building size={20} />}
                {type === AdTargetingType.BUSINESS_REFERENCE && <Target size={20} />}
                {type === AdTargetingType.USER_ROLE && <User size={20} />}
                {type === AdTargetingType.USER_PACKAGE && <Package size={20} />}
                <span className="text-xs mt-1 text-center">
                  {formatTargetingType(type)}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {targetingType !== AdTargetingType.ALL_USERS && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Value *
            </label>
            <input
              type="text"
              value={targetValue}
              onChange={(e) => onTargetValueChange(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${uploading ? 'opacity-50' : ''}`}
              placeholder={`Enter ${targetingType.toLowerCase().replace('_', ' ') || 'target value'}`}
              required
              disabled={uploading}
            />
            {userData && (
              <p className="text-xs text-gray-500 mt-1">
                Your value: {getDefaultTargetValue(targetingType)}
                <button
                  type="button"
                  onClick={() => onTargetValueChange(getDefaultTargetValue(targetingType))}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                  disabled={uploading}
                >
                  Use my value
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TargetingOptions;