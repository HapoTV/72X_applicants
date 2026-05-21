import React from 'react';
import { Banknote, Calendar, ExternalLink, Bookmark } from 'lucide-react';
import type { UserFundingItem } from '../../interfaces/FundingData';
import { getDaysLeftColor, getIndustryColor, getTypeColor } from '../fundingFinderHelpers';

interface FundingOpportunityCardProps {
  opportunity: UserFundingItem;
  variant?: 'featured' | 'list';
}

const FundingOpportunityCard: React.FC<FundingOpportunityCardProps> = ({
  opportunity,
  variant = 'list'
}) => {
  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
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
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
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
  );
};

export default FundingOpportunityCard;
