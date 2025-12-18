// src/components/FundingFinder.tsx
import React, { useState, useEffect } from 'react';
import { Search, Banknote, Calendar, ExternalLink, Bookmark, Building2, Tag } from 'lucide-react';
import { fundingService } from '../services/FundingService';
import type { UserFundingItem } from '../interfaces/FundingData';
import UpgradePage from '../components/UpgradePage';

type PackageType = 'startup' | 'essential' | 'premium';

const FundingFinder: React.FC = () => {
  const userPackage = (localStorage.getItem('userPackage') || 'startup') as PackageType;
  const hasAccess = userPackage === 'essential' || userPackage === 'premium';

  if (!hasAccess) {
    return (
      <UpgradePage
        featureName="Funding"
        featureIcon={Banknote}
        packageType="essential"
        description="Discover funding opportunities tailored to your business needs, from grants to loans and investments."
        benefits={[
          "Access to curated funding opportunities",
          "Advanced filtering by type and industry",
          "Real-time funding opportunity updates",
          "Save and track favorite opportunities",
          "Direct application links and contacts",
          "Personalized funding recommendations"
        ]}
      />
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedAmount, setSelectedAmount] = useState('all');
  const [fundingOpportunities, setFundingOpportunities] = useState<UserFundingItem[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<UserFundingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const types = [
    { id: 'all', name: 'All Types' },
    { id: 'GRANT', name: 'Grants' },
    { id: 'LOAN', name: 'Loans' },
    { id: 'COMPETITION', name: 'Competitions' },
    { id: 'ACCELERATOR', name: 'Accelerators' },
    { id: 'INVESTOR', name: 'Investors' },
    { id: 'CROWDFUNDING', name: 'Crowdfunding' },
    { id: 'OTHER', name: 'Other' }
  ];

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Healthcare', name: 'Healthcare' },
    { id: 'Finance', name: 'Finance' },
    { id: 'Retail', name: 'Retail' },
    { id: 'Manufacturing', name: 'Manufacturing' },
    { id: 'Agriculture', name: 'Agriculture' },
    { id: 'Education', name: 'Education' },
    { id: 'Other', name: 'Other' }
  ];

  const amountRanges = [
    { id: 'all', name: 'Any Amount' },
    { id: '0-10k', name: 'Up to R10K' },
    { id: '10k-50k', name: 'R10K - R50K' },
    { id: '50k-100k', name: 'R50K - R100K' },
    { id: '100k-500k', name: 'R100K - R500K' },
    { id: '500k+', name: 'R500K+' }
  ];

  useEffect(() => {
    fetchFundingOpportunities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedType, selectedIndustry, selectedAmount, fundingOpportunities]);

  const fetchFundingOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching funding opportunities...');
      const opportunities = await fundingService.getActiveFunding();
      console.log('Fetched opportunities:', opportunities);
      setFundingOpportunities(opportunities);
    } catch (err) {
      console.error('Error fetching funding opportunities:', err);
      setError('Failed to load funding opportunities');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    console.log('Applying filters with:', {
      opportunities: fundingOpportunities.length,
      searchTerm,
      selectedType,
      selectedIndustry,
      selectedAmount
    });

    const filtered = fundingOpportunities.filter(opportunity => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.provider.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = selectedType === 'all' || 
        opportunity.type === selectedType ||
        (selectedType === 'OTHER' && (!opportunity.type || opportunity.type === ''));
      
      // Industry filter
      const matchesIndustry = selectedIndustry === 'all' || 
        opportunity.industry === selectedIndustry ||
        (selectedIndustry === 'OTHER' && (!opportunity.industry || opportunity.industry === ''));
      
      // Amount filter
      const matchesAmount = fundingService.matchesAmountFilter(opportunity.fundingAmount || '', selectedAmount);
      
      const matchesAll = matchesSearch && matchesType && matchesIndustry && matchesAmount;
      
      if (matchesAll) {
        console.log('Matched opportunity:', opportunity.title);
      }
      
      return matchesAll;
    });
    
    console.log('Filtered results:', filtered.length);
    setFilteredOpportunities(filtered);
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'GRANT':
        return 'bg-blue-100 text-blue-800';
      case 'LOAN':
        return 'bg-green-100 text-green-800';
      case 'COMPETITION':
        return 'bg-purple-100 text-purple-800';
      case 'ACCELERATOR':
        return 'bg-yellow-100 text-yellow-800';
      case 'INVESTOR':
        return 'bg-red-100 text-red-800';
      case 'CROWDFUNDING':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIndustryColor = (industry?: string) => {
    switch (industry) {
      case 'Technology':
        return 'bg-indigo-100 text-indigo-800';
      case 'Healthcare':
        return 'bg-emerald-100 text-emerald-800';
      case 'Finance':
        return 'bg-amber-100 text-amber-800';
      case 'Retail':
        return 'bg-rose-100 text-rose-800';
      case 'Manufacturing':
        return 'bg-cyan-100 text-cyan-800';
      case 'Agriculture':
        return 'bg-lime-100 text-lime-800';
      case 'Education':
        return 'bg-violet-100 text-violet-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysLeftColor = (daysLeft?: number) => {
    if (daysLeft === undefined) return 'text-gray-500';
    if (daysLeft < 0) return 'text-red-600';
    if (daysLeft <= 7) return 'text-orange-600';
    if (daysLeft <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const featuredOpportunities = filteredOpportunities.filter(opp => 
    opp.daysLeft && opp.daysLeft > 0 && opp.daysLeft <= 30
  ).slice(0, 3);

  const refreshFunding = () => {
    fetchFundingOpportunities();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Search and Filters Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Opportunities Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
          <div className="font-medium text-yellow-800">Debug Info:</div>
          <div className="text-yellow-700">
            Total opportunities: {fundingOpportunities.length} | 
            Filtered: {filteredOpportunities.length}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search funding opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {industries.map(industry => (
                  <option key={industry.id} value={industry.id}>{industry.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
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
              <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type || 'Other'}
                    </span>
                    {opportunity.industry && (
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getIndustryColor(opportunity.industry)}`}>
                        {opportunity.industry}
                      </span>
                    )}
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Bookmark className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{opportunity.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-1">{opportunity.provider}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <Banknote className="w-4 h-4" />
                    <span>{opportunity.fundingAmount || 'Amount not specified'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className={getDaysLeftColor(opportunity.daysLeft)}>
                      {opportunity.deadline || 'No deadline'}
                      {opportunity.daysLeft !== undefined && opportunity.daysLeft > 0 && (
                        <span className="ml-1">
                          ({opportunity.daysLeft} days left)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{opportunity.description}</p>
                
                {opportunity.applicationUrl && (
                  <button 
                    onClick={() => window.open(opportunity.applicationUrl, '_blank')}
                    className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
                    disabled={opportunity.isExpired}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{opportunity.isExpired ? 'Expired' : 'Learn More'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Opportunities */}
      <div>
        <div className="space-y-4">
          {filteredOpportunities.map(opportunity => (
            <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type || 'Other'}
                    </span>
                    {opportunity.industry && (
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getIndustryColor(opportunity.industry)}`}>
                        {opportunity.industry}
                      </span>
                    )}
                    {opportunity.daysLeft !== undefined && opportunity.daysLeft > 0 && opportunity.daysLeft <= 30 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Ending Soon
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{opportunity.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{opportunity.provider}</p>
                </div>
                
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Bookmark className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Banknote className="w-4 h-4" />
                  <span>{opportunity.fundingAmount || 'Amount not specified'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className={getDaysLeftColor(opportunity.daysLeft)}>
                    {opportunity.deadline || 'No deadline'}
                    {opportunity.daysLeft !== undefined && opportunity.daysLeft > 0 && (
                      <span className="ml-1">
                        ({opportunity.daysLeft} days left)
                      </span>
                    )}
                  </span>
                </div>
                {opportunity.contactInfo && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Contact: {opportunity.contactInfo}</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opportunity.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {opportunity.daysLeft !== undefined && (
                    <span className={getDaysLeftColor(opportunity.daysLeft)}>
                      {opportunity.daysLeft > 0 ? `${opportunity.daysLeft} days left` : 'Application closed'}
                    </span>
                  )}
                </div>
                
                {opportunity.applicationUrl && (
                  <button 
                    onClick={() => window.open(opportunity.applicationUrl, '_blank')}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                    disabled={opportunity.isExpired}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{opportunity.isExpired ? 'Expired' : 'Apply Now'}</span>
                  </button>
                )}
              </div>
            </div>
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