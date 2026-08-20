import React, { useMemo } from 'react';
import { TrendingUp, Bookmark, Calendar, MapPin } from 'lucide-react';
import type { TenderItem } from '../../interfaces/TenderlyAIData';

interface OverviewTabProps {
  tenders: TenderItem[];
  savedTenderIds: Set<string>;
}

const isClosingWithinDays = (closingAt: string, days: number) => {
  const dt = new Date(closingAt);
  if (Number.isNaN(dt.getTime())) return false;
  const diffDays = (dt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
};

export const OverviewTab: React.FC<OverviewTabProps> = ({ tenders, savedTenderIds }) => {
  const stats = useMemo(() => {
    const openTenders = tenders.filter((t) => t.status === 'OPEN');
    const urgentTenders = openTenders.filter((t) => isClosingWithinDays(t.closingAt, 7));
    const categories = new Set(tenders.map((t) => t.industry)).size;

    return {
      totalTenders: tenders.length,
      openTenders: openTenders.length,
      savedTenders: savedTenderIds.size,
      urgentTenders: urgentTenders.length,
      categories,
    };
  }, [tenders, savedTenderIds]);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    description,
    highlight = false,
  }: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    description: string;
    highlight?: boolean;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">{label}</div>
          <div className={`text-2xl font-bold mt-1 ${highlight ? 'text-primary-600' : 'text-gray-900'}`}>
            {value}
          </div>
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        </div>
        <div className="p-2 rounded-lg bg-primary-50">
          <Icon className={`w-4 h-4 ${highlight ? 'text-primary-600' : 'text-primary-600'}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome to TenderlyAI!</h2>
        <p className="text-gray-600 mt-1">Here's what's happening in the tender marketplace today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total Tenders"
          value={stats.totalTenders}
          description="Available opportunities"
        />
        <StatCard
          icon={Bookmark}
          label="Saved Tenders"
          value={stats.savedTenders}
          description="Click Save to bookmark"
        />
        <StatCard
          icon={Calendar}
          label="Urgent"
          value={stats.urgentTenders}
          description="Closing within 7 days"
          highlight
        />
        <StatCard
          icon={MapPin}
          label="Categories"
          value={stats.categories}
          description="Industry categories"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200 p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">Quick Stats</h3>
          <div className="space-y-2">
            <p className="text-sm text-primary-800">
              <span className="font-semibold">{stats.openTenders}</span> open tenders are available
            </p>
            <p className="text-sm text-primary-800">
              <span className="font-semibold">{stats.urgentTenders}</span> tenders are closing soon
            </p>
            <p className="text-sm text-primary-800">
              Explore <span className="font-semibold">{stats.categories}</span> different industries
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Tips & Insights</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• Use filters to narrow down relevant opportunities</li>
            <li>• Bookmark tenders you want to track closely</li>
            <li>• Check urgency indicators for deadlines</li>
            <li>• Review documents before applying</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
