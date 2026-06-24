// src/components/crm/LeadsTab.tsx

import React, { useState } from 'react';
import { Plus, Search, Target } from 'lucide-react';
import { LeadCard } from './LeadCard';
import type { Lead, LeadStage } from '../../interfaces/crm/lead.interface';

interface LeadsTabProps {
    leads: Lead[];
    loading: boolean;
    onAdd: () => void;
    onEdit: (lead: Lead) => void;
    onDelete: (lead: Lead) => void;
    onStageChange: (lead: Lead, stage: LeadStage) => void;
}

export const LeadsTab: React.FC<LeadsTabProps> = ({
    leads,
    loading,
    onAdd,
    onEdit,
    onDelete,
    onStageChange,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.stage?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[255px]">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading leads...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Leads</h2>
                    <p className="text-sm text-gray-600">Track and manage your sales leads</p>
                </div>
                <button
                    onClick={onAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Lead
                </button>
            </section>

            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[255px]">
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                </div>

                <div className="flex min-h-[175px] flex-col items-center justify-center text-center">
                    {filteredLeads.length === 0 ? (
                        <>
                            <Target className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">
                                {searchTerm ? 'No leads match your search.' : 'No leads yet. Add your first lead to get started!'}
                            </p>
                        </>
                    ) : (
                        <div className="w-full space-y-3 text-left">
                            {filteredLeads.map((lead) => (
                                <LeadCard
                                    key={lead.id}
                                    lead={lead}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onStageChange={onStageChange}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};