// src/components/crm/SalesTab.tsx

import React, { useState } from 'react';
import { Plus, Search, TrendingUp } from 'lucide-react';
import { SaleCard } from './SaleCard';
import type { Sale } from '../../interfaces/crm/sale.interface';
import type { Product } from '../../interfaces/crm/product.interface';
import type { Contact } from '../../interfaces/crm/contact.interface';

interface SalesTabProps {
    sales: Sale[];
    products: Product[];
    contacts: Contact[];
    loading: boolean;
    onAdd: () => void;
    onEdit: (sale: Sale) => void;
    onDelete: (sale: Sale) => void;
}

export const SalesTab: React.FC<SalesTabProps> = ({
    sales,
    products,
    contacts,
    loading,
    onAdd,
    onEdit,
    onDelete,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSales = sales.filter(sale =>
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[255px]">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading sales...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Sales</h2>
                    <p className="text-sm text-gray-600">Monitor your sales pipeline</p>
                </div>
                <button
                    onClick={onAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Record Sale
                </button>
            </section>

            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[255px]">
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search sales..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                </div>

                <div className="flex min-h-[175px] flex-col items-center justify-center text-center">
                    {filteredSales.length === 0 ? (
                        <>
                            <TrendingUp className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">
                                {searchTerm ? 'No sales match your search.' : 'No sales yet. Record your first sale to get started!'}
                            </p>
                        </>
                    ) : (
                        <div className="w-full space-y-3 text-left">
                            {filteredSales.map((sale) => (
                                <SaleCard
                                    key={sale.id}
                                    sale={sale}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};