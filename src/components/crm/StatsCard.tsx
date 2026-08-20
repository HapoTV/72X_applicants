// src/components/crm/StatsCard.tsx

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon | string;
    iconBg: string;
    iconColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    label,
    value,
    icon: Icon,
    iconBg,
    iconColor,
}) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
                    {typeof Icon === 'string' ? (
                        <span className={`text-sm font-bold ${iconColor}`}>{Icon}</span>
                    ) : (
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                    )}
                </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
};