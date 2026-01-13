// src/pages/adminDashboard/tabs/components/StatsSummary.tsx
import React from 'react';
import { AdStatus } from '../../../../interfaces/AdData';
import type { AdDTO } from '../../../../interfaces/AdData';

interface StatsSummaryProps {
  ads: AdDTO[];
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ ads }) => {
  const formatCurrency = (amount: number | undefined) => {
    const safeAmount = amount || 0;
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(safeAmount);
  };

  if (ads.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <div className="text-2xl font-bold text-gray-800">
          {ads.filter(ad => ad.status === AdStatus.ACTIVE).length}
        </div>
        <div className="text-sm text-gray-600">Active Ads</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <div className="text-2xl font-bold text-gray-800">
          {ads.reduce((sum, ad) => sum + (ad.totalClicks || 0), 0).toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Total Clicks</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <div className="text-2xl font-bold text-gray-800">
          {formatCurrency(ads.reduce((sum, ad) => sum + (ad.budget || 0), 0))}
        </div>
        <div className="text-sm text-gray-600">Total Budget</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <div className="text-2xl font-bold text-gray-800">
          {ads.length}
        </div>
        <div className="text-sm text-gray-600">Total Ads</div>
      </div>
    </div>
  );
};

export default StatsSummary;