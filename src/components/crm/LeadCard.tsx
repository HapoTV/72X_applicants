// src/components/crm/LeadCard.tsx

import React from 'react';
import { Pencil, Trash2, Target } from 'lucide-react';
import type { Lead, LeadStage } from '../../interfaces/crm/lead.interface';

interface LeadCardProps {
    lead: Lead;
    onEdit: (lead: Lead) => void;
    onDelete: (lead: Lead) => void;
    onStageChange: (lead: Lead, stage: LeadStage) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
    lead,
    onEdit,
    onDelete,
    onStageChange,
}) => {
    const stages: LeadStage[] = ['New', 'Considering', 'Active', 'Inactive'];

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-blue-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Target className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.email || '-'}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gray-50 px-4 py-2">
                    <span className="block font-medium text-gray-500">Phone</span>
                    <span className="text-gray-900">{lead.phone || '-'}</span>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-2">
                    <span className="block font-medium text-gray-500">Source</span>
                    <span className="text-gray-900">{lead.source || '-'}</span>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-2">
                    <span className="block font-medium text-gray-500">Stage</span>
                    <select
                        value={lead.stage}
                        onChange={(e) => onStageChange(lead, e.target.value as LeadStage)}
                        className="mt-1 rounded-lg border border-gray-300 px-2 py-1 text-xs font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >
                        {stages.map((stage) => (
                            <option key={stage} value={stage}>{stage}</option>
                        ))}
                    </select>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-2">
                    <span className="block font-medium text-gray-500">Notes</span>
                    <span className="text-gray-900 truncate">{lead.notes || '-'}</span>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={() => onEdit(lead)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(lead)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                </button>
            </div>
        </div>
    );
};