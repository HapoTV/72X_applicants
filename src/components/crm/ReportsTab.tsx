// src/components/crm/ReportsTab.tsx

import React from 'react';
import { Star, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';
import type { Lead } from '../../interfaces/crm/lead.interface';
import type { Sale } from '../../interfaces/crm/sale.interface';

interface ReportsTabProps {
    leads: Lead[];
    sales: Sale[];
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ leads, sales }) => {
    const completedSales = sales.filter(s => s.status === 'Completed');
    const pendingAmount = sales.filter(s => s.status === 'Pending')
        .reduce((total, sale) => total + sale.amount, 0);
    const totalCompletedAmount = completedSales.reduce((total, sale) => total + sale.amount, 0);

    const getLeadStageCount = (stage: string) => leads.filter(l => l.stage === stage).length;

    const conversionRate = leads.length > 0 
        ? Math.round((getLeadStageCount('Active') / leads.length) * 100) 
        : 0;

    return (
        <>
            <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Reports</h2>
                <p className="text-sm text-gray-600">Analyze your business performance</p>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-8">Sales Overview</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Sales Amount</span>
                            <span className="font-medium text-gray-900">
                                R{totalCompletedAmount.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Completed Sales</span>
                            <span className="font-medium text-gray-900">{completedSales.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Pending Amount</span>
                            <span className="font-medium text-gray-900">
                                R{pendingAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-8">Lead Conversion</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Leads</span>
                            <span className="font-medium text-gray-900">{leads.length}</span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p className="text-xs font-semibold text-gray-700 mb-3">Leads by Stage</p>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-gray-600">New</span>
                                </div>
                                <span className="font-semibold text-gray-900">{getLeadStageCount('New')}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-600">Considering</span>
                                </div>
                                <span className="font-semibold text-gray-900">{getLeadStageCount('Considering')}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-600">Active</span>
                                </div>
                                <span className="font-semibold text-gray-900">{getLeadStageCount('Active')}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-gray-600">Inactive</span>
                                </div>
                                <span className="font-semibold text-gray-900">{getLeadStageCount('Inactive')}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Conversion Rate</span>
                            <span className="font-medium text-gray-900">{conversionRate}%</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};