// src/components/crm/ProductFormModal.tsx

import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useProducts } from '../../hooks/crm/useProducts';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
    isOpen,
    onClose,
    loading,
}) => {
    const { createProduct } = useProducts();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isSubmitting || loading) return;
        
        if (!formData.name || formData.name.trim() === '') {
            console.warn('Product name is required');
            return;
        }
        
        const price = parseFloat(formData.price);
        if (isNaN(price) || price <= 0) {
            console.warn('Valid price is required');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await createProduct({
                name: formData.name,
                price: price,
                description: formData.description,
            });
            setFormData({ name: '', price: '', description: '' });
            onClose();
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        if (isSubmitting || loading) return;
        setFormData({ name: '', price: '', description: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={handleClose}>
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="product-name">
                            Product Name *
                        </label>
                        <input
                            id="product-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="product-price">
                            Price (R) *
                        </label>
                        <input
                            id="product-price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="product-description">
                            Description
                        </label>
                        <textarea
                            id="product-description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};