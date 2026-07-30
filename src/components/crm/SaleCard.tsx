// src/components/crm/SaleCard.tsx

import React from 'react';
import { Pencil, Trash2, TrendingUp } from 'lucide-react';
import type { Sale } from '../../interfaces/crm/sale.interface';

interface SaleCardProps {
    sale: Sale;
    onEdit: (sale: Sale) => void;
    onDelete: (sale: Sale) => void;
}

export const SaleCard: React.FC<SaleCardProps> = ({
    sale,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-green-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-sm font-bold text-green-600">
                    R
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{sale.customerName}</p>
                    <p className="text-xs text-gray-500">{sale.productName}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gray-50 px-4 py-2">
                    <span className="block font-medium text-gray-500">Amount</span>
                    <span className="font-semibold text-gray-900">R{sale.amount.toLocaleString()}</span>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-2">
                    <span className="block font-medium text-gray-500">Payment Method</span>
                    <span className="text-gray-900">{sale.paymentMethod || '-'}</span>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-2">
                    <span className="block font-medium text-gray-500">Date</span>
                    <span className="text-gray-900">{sale.date}</span>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-2">
                    <span className="block font-medium text-gray-500">Notes</span>
                    <span className="text-gray-900 truncate">{sale.notes || '-'}</span>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    sale.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    sale.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                }`}>
                    {sale.status}
                </span>
                <button
                    type="button"
                    onClick={() => onEdit(sale)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(sale)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                </button>
            </div>
        </div>
    );
};