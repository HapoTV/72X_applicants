import React from 'react';
import { Search } from 'lucide-react';
import type { MarketplaceCategory, MarketplaceLocation } from '../../interfaces/MarketplaceData';

interface MarketplaceFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedLocation: string;
  categories: MarketplaceCategory[];
  locations: MarketplaceLocation[];
  statusFilter?: 'available' | 'sold' | 'all';
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onStatusChange?: (value: 'available' | 'sold' | 'all') => void;
  showStatusFilter?: boolean;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  searchTerm,
  selectedCategory,
  selectedLocation,
  categories,
  locations,
  statusFilter = 'available',
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onStatusChange,
  showStatusFilter = false
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />
      </div>

      <div className={`grid grid-cols-1 gap-4 ${showStatusFilter ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          {locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>

        {showStatusFilter && onStatusChange && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as 'available' | 'sold' | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="available">Available</option>
            <option value="sold">Sold/History</option>
            <option value="all">All</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default MarketplaceFilters;
