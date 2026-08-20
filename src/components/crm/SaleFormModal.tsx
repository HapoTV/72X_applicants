// src/components/crm/SaleFormModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import type { Sale, CreateSaleRequest, SaleStatus } from '../../interfaces/crm/sale.interface';
import type { Contact } from '../../interfaces/crm/contact.interface';
import type { Product } from '../../interfaces/crm/product.interface';
import { ProductFormModal } from './ProductFormModal';

interface SaleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateSaleRequest) => Promise<void>;
    initialData?: Sale | null;
    products: Product[];
    contacts: Contact[];
    loading: boolean;
}

const SALE_STATUSES: SaleStatus[] = ['Pending', 'Completed', 'Cancelled'];

export const SaleFormModal: React.FC<SaleFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    products,
    contacts,
    loading,
}) => {
    const [formData, setFormData] = useState<CreateSaleRequest>({
        customerId: '',
        customerName: '',
        productId: '',
        productName: '',
        amount: 0,
        paymentMethod: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        notes: '',
    });
    const [showProductForm, setShowProductForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    customerId: initialData.customerId || '',
                    customerName: initialData.customerName || '',
                    productId: initialData.productId || '',
                    productName: initialData.productName || '',
                    amount: initialData.amount || 0,
                    paymentMethod: initialData.paymentMethod || '',
                    date: initialData.date || new Date().toISOString().split('T')[0],
                    status: initialData.status || 'Pending',
                    notes: initialData.notes || '',
                });
            } else {
                setFormData({
                    customerId: '',
                    customerName: '',
                    productId: '',
                    productName: '',
                    amount: 0,
                    paymentMethod: '',
                    date: new Date().toISOString().split('T')[0],
                    status: 'Pending',
                    notes: '',
                });
            }
            setIsSubmitting(false);
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isSubmitting || loading) {
            console.log('Already submitting, ignoring...');
            return;
        }
        
        // Validate required fields
        if (!formData.customerId) {
            console.warn('Customer is required');
            return;
        }
        if (!formData.productId) {
            console.warn('Product is required');
            return;
        }
        if (!formData.amount || formData.amount <= 0) {
            console.warn('Amount is required and must be greater than 0');
            return;
        }
        if (!formData.paymentMethod || formData.paymentMethod.trim() === '') {
            console.warn('Payment method is required');
            return;
        }
        
        console.log('Submitting sale form...', formData);
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            console.log('Sale form submitted successfully');
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const customerId = e.target.value;
        const contact = contacts.find((c) => c.id === customerId);
        setFormData((prev) => ({
            ...prev,
            customerId,
            customerName: contact?.name || '',
        }));
    };

    const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const productId = e.target.value;
        const product = products.find((p) => p.id === productId);
        setFormData((prev) => ({
            ...prev,
            productId,
            productName: product?.name || '',
            amount: product?.price || 0,
        }));
    };

    const handleClose = () => {
        if (isSubmitting || loading) return;
        console.log('Closing sale form');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={handleClose}>
                <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl border border-gray-100" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {initialData ? 'Edit Sale' : 'Record Sale'}
                        </h3>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting || loading}
                            className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-customer">
                                Customer *
                            </label>
                            <select
                                id="sale-customer"
                                value={formData.customerId}
                                onChange={handleCustomerSelect}
                                required
                                disabled={isSubmitting || loading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                                autoFocus
                            >
                                <option value="">Select a customer...</option>
                                {contacts.map((contact) => (
                                    <option key={contact.id} value={contact.id}>
                                        {contact.name} {contact.email ? `(${contact.email})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-product">
                                Product / Service *
                            </label>
                            <div className="flex gap-2">
                                <select
                                    id="sale-product"
                                    value={formData.productId}
                                    onChange={handleProductSelect}
                                    required
                                    disabled={isSubmitting || loading}
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                                >
                                    <option value="">Select a product...</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} {product.price ? `- R${product.price.toLocaleString()}` : ''}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowProductForm(true)}
                                    disabled={isSubmitting || loading}
                                    className="inline-flex items-center justify-center rounded-lg border border-primary-500 px-3 py-2 text-sm font-semibold text-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50"
                                    title="Add new product"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-amount">
                                Amount (R) *
                            </label>
                            <input
                                id="sale-amount"
                                name="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting || loading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-paymentMethod">
                                Payment Method *
                            </label>
                            <input
                                id="sale-paymentMethod"
                                name="paymentMethod"
                                type="text"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Cash, Card, Bank Transfer"
                                disabled={isSubmitting || loading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-status">
                                    Status *
                                </label>
                                <select
                                    id="sale-status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    disabled={isSubmitting || loading}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                                >
                                    {SALE_STATUSES.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-date">
                                    Sale Date *
                                </label>
                                <input
                                    id="sale-date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting || loading}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-notes">
                                Notes
                            </label>
                            <textarea
                                id="sale-notes"
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                                disabled={isSubmitting || loading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-1">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting || loading}
                                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting || loading ? 'Saving...' : (initialData ? 'Update Sale' : 'Save Sale')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ProductFormModal
                isOpen={showProductForm}
                onClose={() => setShowProductForm(false)}
                loading={loading || isSubmitting}
            />
        </>
    );
};