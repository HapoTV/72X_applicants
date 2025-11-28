// src/components/FundingFinder.tsx
import React, { useState, useEffect } from 'react';
import { Search, Banknote, Calendar, MapPin, ExternalLink, Bookmark, Star, Filter } from 'lucide-react';
import { fundingService } from '../services/FundingService';
import type { UserFundingItem } from '../interfaces/FundingData';

const FundingFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedAmount, setSelectedAmount] = useState('all');
  const [fundingOpportunities, setFundingOpportunities] = useState<UserFundingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fundingTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'grants', name: 'Grants' },
    { id: 'loans', name: 'Loans' },
    { id: 'competitions', name: 'Competitions' },
    { id: 'accelerators', name: 'Accelerators' },
    { id: 'investors', name: 'Investors' }
  ];

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'technology', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'retail', name: 'Retail' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'services', name: 'Services' }
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

  const fetchFundingOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const opportunities = await fundingService.getActiveFunding();
      setFundingOpportunities(opportunities);
    } catch (err) {
      setError('Failed to load funding opportunities');
      console.error('Error fetching funding opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (provider: string) => {
    const providerLower = provider.toLowerCase();
    if (providerLower.includes('grant')) return 'bg-blue-100 text-blue-800';
    if (providerLower.includes('loan')) return 'bg-green-100 text-green-800';
    if (providerLower.includes('competition') || providerLower.includes('challenge')) return 'bg-purple-100 text-purple-800';
    if (providerLower.includes('accelerator') || providerLower.includes('incubator')) return 'bg-yellow-100 text-yellow-800';
    if (providerLower.includes('investor') || providerLower.includes('capital')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getDaysLeftColor = (daysLeft?: number) => {
    if (!daysLeft) return 'text-gray-500';
    if (daysLeft < 0) return 'text-red-600';
    if (daysLeft <= 7) return 'text-orange-600';
    if (daysLeft <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredOpportunities = fundingOpportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {fundingTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {industries.map(industry => (
                <option key={industry.id} value={industry.id}>{industry.name}</option>
              ))}
            </select>
            
            <select
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {amountRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Opportunities */}
      {featuredOpportunities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOpportunities.map(opportunity => (
              <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${getTypeColor(opportunity.provider)}`}>
                    {opportunity.provider}
                  </span>
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
                      {opportunity.daysLeft !== undefined && (
                        <span className="ml-1">
                          ({opportunity.daysLeft > 0 ? `${opportunity.daysLeft} days left` : 'Expired'})
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
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Learn More</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">All Funding Opportunities</h2>
          <span className="text-sm text-gray-500">
            {filteredOpportunities.length} opportunities
          </span>
        </div>
        
        <div className="space-y-4">
          {filteredOpportunities.map(opportunity => (
            <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getTypeColor(opportunity.provider)}`}>
                      {opportunity.provider}
                    </span>
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
                    {opportunity.daysLeft !== undefined && (
                      <span className="ml-1">
                        ({opportunity.daysLeft > 0 ? `${opportunity.daysLeft} days left` : 'Expired'})
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
              
              <p className="text-gray-600 text-sm mb-4">{opportunity.description}</p>
              
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
        
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No funding opportunities found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingFinder;