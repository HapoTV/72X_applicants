// src/components/FundingFinder.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Banknote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fundingService } from '../services/FundingService';
import type { UserFundingItem } from '../interfaces/FundingData';
import FundingFilters from './components/FundingFilters';
import FundingFinderLoading from './components/FundingFinderLoading';
import FundingOpportunityCard from './components/FundingOpportunityCard';
import { filterFundingOpportunities, getFeaturedOpportunities } from './fundingFinderHelpers';

const FundingFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedAmount, setSelectedAmount] = useState('all');
  const [filteredOpportunities, setFilteredOpportunities] = useState<UserFundingItem[]>([]);

  const {
    data: fundingOpportunities = [],
    isLoading: loading,
    isError,
    refetch,
  } = useQuery<UserFundingItem[]>({
    queryKey: ['funding-opportunities'],
    queryFn: () => fundingService.getActiveFunding(),
    staleTime: 3 * 60 * 1000,
  });

  const error = isError ? 'Failed to load funding opportunities' : null;

  const applyFilters = useCallback(() => {
    console.log('Applying filters with:', {
      opportunities: fundingOpportunities.length,
      searchTerm,
      selectedType,
      selectedIndustry,
      selectedAmount
    });

    const filtered = filterFundingOpportunities(
      fundingOpportunities,
      searchTerm,
      selectedType,
      selectedIndustry,
      selectedAmount
    );
    
    console.log('Filtered results:', filtered.length);
    setFilteredOpportunities(filtered);
  }, [fundingOpportunities, searchTerm, selectedType, selectedIndustry, selectedAmount]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const featuredOpportunities = getFeaturedOpportunities(filteredOpportunities);

  const refreshFunding = () => {
    refetch();
  };

  if (loading) {
    return <FundingFinderLoading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Funding & Grant Finder</h1>
        <p className="text-gray-600">Discover funding opportunities tailored to your business needs and stage</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={refreshFunding}
              className="text-red-700 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <FundingFilters
        searchTerm={searchTerm}
        selectedType={selectedType}
        selectedIndustry={selectedIndustry}
        selectedAmount={selectedAmount}
        onSearchTermChange={setSearchTerm}
        onSelectedTypeChange={setSelectedType}
        onSelectedIndustryChange={setSelectedIndustry}
        onSelectedAmountChange={setSelectedAmount}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Funding Opportunities
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({filteredOpportunities.length} results)
          </span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedIndustry('all');
              setSelectedAmount('all');
            }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear Filters
          </button>
          <button 
            onClick={refreshFunding}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Featured Opportunities */}
      {featuredOpportunities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Opportunities (Ending Soon)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOpportunities.map(opportunity => (
              <FundingOpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                variant="featured"
              />
            ))}
          </div>
        </div>
      )}

      {/* All Opportunities */}
      <div>
        <div className="space-y-4">
          {filteredOpportunities.map(opportunity => (
            <FundingOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
            />
          ))}
        </div>
        
        {filteredOpportunities.length === 0 && fundingOpportunities.length > 0 && (
          <div className="text-center py-12">
            <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No funding opportunities found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedIndustry('all');
                setSelectedAmount('all');
              }}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {fundingOpportunities.length === 0 && (
          <div className="text-center py-12">
            <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No funding opportunities available</h3>
            <p className="text-gray-600">Check back later for new funding opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingFinder;