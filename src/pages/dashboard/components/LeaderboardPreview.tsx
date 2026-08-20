// src/components/dashboard/components/LeaderboardPreview.tsx
import React from 'react';
import { Briefcase, Sparkles, ShieldCheck, ShoppingBag } from 'lucide-react';

const additionalApps = [
  {
    title: 'CRM',
    description: 'Customer relationship management for leads and clients.',
    icon: Briefcase,
    color: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Tenderly AI',
    description: 'AI tools for forecasting, insights, and smarter decisions.',
    icon: Sparkles,
    color: 'from-violet-500 to-fuchsia-600',
  },
  {
    title: 'Funding Finder',
    description: 'Search grants, loans and funding opportunities.',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Marketplace',
    description: 'List products and get discovered by customers.',
    icon: ShoppingBag,
    color: 'from-amber-400 to-orange-500',
  },
];

const LeaderboardPreview: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Additional apps</h3>
        <p className="text-xs text-gray-500 mt-1">Explore app store tools to grow your business.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {additionalApps.map((app) => {
          const Icon = app.icon;
          const iconClasses = `flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${app.color} text-white shadow-sm`;
          return (
            <div key={app.title} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <div className={iconClasses}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">{app.title}</h4>
                <p className="text-xs text-gray-500">{app.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardPreview;
