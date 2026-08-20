import React from 'react';
import { Search, Banknote, Building2, Tag } from 'lucide-react';
import { amountRanges, fundingIndustries, fundingTypes } from '../fundingFinderHelpers';

interface FundingFiltersProps {
  searchTerm: string;
  selectedType: string;
  selectedIndustry: string;
  selectedAmount: string;
  onSearchTermChange: (value: string) => void;
  onSelectedTypeChange: (value: string) => void;
  onSelectedIndustryChange: (value: string) => void;
  onSelectedAmountChange: (value: string) => void;
}

const FundingFilters: React.FC<FundingFiltersProps> = ({
  searchTerm,
  selectedType,
  selectedIndustry,
  selectedAmount,
  onSearchTermChange,
  onSelectedTypeChange,
  onSelectedIndustryChange,
  onSelectedAmountChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search funding opportunities..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => onSelectedTypeChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {fundingTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedIndustry}
              onChange={(e) => onSelectedIndustryChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {fundingIndustries.map(industry => (
                <option key={industry.id} value={industry.id}>{industry.name}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedAmount}
              onChange={(e) => onSelectedAmountChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {amountRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingFilters;
