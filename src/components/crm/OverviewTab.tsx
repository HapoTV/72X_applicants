// src/components/crm/OverviewTab.tsx

import React from 'react';
import { Users, Target, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import type { Activity } from '../../interfaces/crm/activity.interface';
import type { CRMStats } from '../../interfaces/crm/stats.interface';

interface OverviewTabProps {
    stats: CRMStats;
    activities: Activity[];
    onQuickAction: (action: 'contact' | 'lead' | 'sale') => void;
}

const statsConfig = [
    { label: 'Total Contacts', icon: Users, iconBg: 'bg-purple-100', iconColor: 'text-primary-600' },
    { label: 'Total Leads', icon: Target, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Sales This Month', icon: 'R', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Conversion Rate', icon: TrendingUp, iconBg: 'bg-fuchsia-100', iconColor: 'text-purple-600' },
];

export const OverviewTab: React.FC<OverviewTabProps> = ({
    stats,
    activities,
    onQuickAction,
}) => {
    const getStatsValue = (label: string) => {
        switch (label) {
            case 'Total Contacts': return stats.totalContacts;
            case 'Total Leads': return stats.totalLeads;
            case 'Sales This Month': return `R${stats.monthlySalesAmount.toLocaleString()}`;
            case 'Conversion Rate': return `${stats.conversionRate}%`;
            default: return '-';
        }
    };

    const quickActions = [
        { label: 'Add New Contact', icon: Users, primary: true, action: 'contact' as const },
        { label: 'Create Lead', icon: Target, primary: false, action: 'lead' as const },
        { label: 'Record Sale', icon: 'R', primary: false, action: 'sale' as const },
    ];

    return (
        <>
            <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Overview</h2>
                <p className="text-sm text-gray-600">Welcome back! Here's what's happening with your business today.</p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statsConfig.map((stat) => (
                    <StatsCard
                        key={stat.label}
                        label={stat.label}
                        value={getStatsValue(stat.label)}
                        icon={stat.icon}
                        iconBg={stat.iconBg}
                        iconColor={stat.iconColor}
                    />
                ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[245px]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-10">Recent Activity</h3>
                    {activities.length === 0 ? (
                        <div className="h-32 flex items-center justify-center">
                            <p className="text-sm text-gray-400">Recent activity will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                            {activities.slice(0, 10).map((activity) => (
                                <div key={activity.id} className="rounded-lg bg-gray-50 px-4 py-3">
                                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h3>
                    <div className="space-y-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={action.label}
                                    onClick={() => {
                                        console.log('Quick action clicked:', action.action);
                                        onQuickAction(action.action);
                                    }}
                                    className={`w-full h-12 rounded-lg px-4 flex items-center gap-3 text-sm font-semibold transition-colors ${
                                        action.primary
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-95'
                                            : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    {typeof Icon === 'string' ? (
                                        <span className="w-5 h-5 inline-flex items-center justify-center text-sm font-bold">{Icon}</span>
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                    {action.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
};