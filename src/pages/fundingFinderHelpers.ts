import { fundingService } from '../services/FundingService';
import type { UserFundingItem } from '../interfaces/FundingData';

export const fundingTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'GRANT', name: 'Grants' },
  { id: 'LOAN', name: 'Loans' },
  { id: 'COMPETITION', name: 'Competitions' },
  { id: 'ACCELERATOR', name: 'Accelerators' },
  { id: 'INVESTOR', name: 'Investors' },
  { id: 'CROWDFUNDING', name: 'Crowdfunding' },
  { id: 'OTHER', name: 'Other' }
];

export const fundingIndustries = [
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

export const amountRanges = [
  { id: 'all', name: 'Any Amount' },
  { id: '0-10k', name: 'Up to R10K' },
  { id: '10k-50k', name: 'R10K - R50K' },
  { id: '50k-100k', name: 'R50K - R100K' },
  { id: '100k-500k', name: 'R100K - R500K' },
  { id: '500k+', name: 'R500K+' }
];

export const getTypeColor = (type?: string) => {
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

export const getIndustryColor = (industry?: string) => {
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

export const getDaysLeftColor = (daysLeft?: number) => {
  if (daysLeft === undefined) return 'text-gray-500';
  if (daysLeft < 0) return 'text-red-600';
  if (daysLeft <= 7) return 'text-orange-600';
  if (daysLeft <= 30) return 'text-yellow-600';
  return 'text-green-600';
};

export const filterFundingOpportunities = (
  fundingOpportunities: UserFundingItem[],
  searchTerm: string,
  selectedType: string,
  selectedIndustry: string,
  selectedAmount: string
) => {
  return fundingOpportunities.filter(opportunity => {
    const matchesSearch = searchTerm === '' ||
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.provider.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' ||
      opportunity.type === selectedType ||
      (selectedType === 'OTHER' && (!opportunity.type || opportunity.type === ''));

    const matchesIndustry = selectedIndustry === 'all' ||
      opportunity.industry === selectedIndustry ||
      (selectedIndustry === 'OTHER' && (!opportunity.industry || opportunity.industry === ''));

    const matchesAmount = fundingService.matchesAmountFilter(opportunity.fundingAmount || '', selectedAmount);

    return matchesSearch && matchesType && matchesIndustry && matchesAmount;
  });
};

export const getFeaturedOpportunities = (opportunities: UserFundingItem[]) => {
  return opportunities.filter(opp =>
    opp.daysLeft && opp.daysLeft > 0 && opp.daysLeft <= 30
  ).slice(0, 3);
};
