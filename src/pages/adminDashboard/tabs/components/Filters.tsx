// src/pages/adminDashboard/tabs/components/Filters.tsx
import React from 'react';
import { AdStatus, AdTargetingType } from '../../../../interfaces/AdData';
import { Search, RefreshCw } from 'lucide-react';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: AdStatus | 'ALL';
  setStatusFilter: (filter: AdStatus | 'ALL') => void;
  targetingFilter: AdTargetingType | 'ALL';
  setTargetingFilter: (filter: AdTargetingType | 'ALL') => void;
  onRefresh: () => void;
  loading: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  targetingFilter,
  setTargetingFilter,
  onRefresh,
  loading
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

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ads by title or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdStatus | 'ALL')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="ALL">All Status</option>
            {Object.values(AdStatus).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          
          <select
            value={targetingFilter}
            onChange={(e) => setTargetingFilter(e.target.value as AdTargetingType | 'ALL')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="ALL">All Targeting</option>
            {Object.values(AdTargetingType).map((type) => (
              <option key={type} value={type}>
                {formatTargetingType(type)}
              </option>
            ))}
          </select>
          
          <button
            onClick={onRefresh}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            title="Refresh ads"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;