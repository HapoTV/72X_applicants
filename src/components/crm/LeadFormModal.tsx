// src/components/crm/LeadFormModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Lead, CreateLeadRequest, LeadStage } from '../../interfaces/crm/lead.interface';

interface LeadFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateLeadRequest) => Promise<void>;
    initialData?: Lead | null;
    loading: boolean;
}

const LEAD_STAGES: LeadStage[] = ['New', 'Considering', 'Active', 'Inactive'];

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    loading,
}) => {
    const [formData, setFormData] = useState<CreateLeadRequest>({
        name: '',
        email: '',
        phone: '',
        source: '',
        stage: 'New',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    email: initialData.email || '',
                    phone: initialData.phone || '',
                    source: initialData.source || '',
                    stage: initialData.stage || 'New',
                    notes: initialData.notes || '',
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    source: '',
                    stage: 'New',
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
        
        if (!formData.name || formData.name.trim() === '') {
            console.warn('Name is required');
            return;
        }
        
        console.log('Submitting lead form...', formData);
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            console.log('Lead form submitted successfully');
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        if (isSubmitting || loading) return;
        console.log('Closing lead form');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={handleClose}>
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Edit Lead' : 'Add New Lead'}
                    </h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting || loading}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-name">
                            Name *
                        </label>
                        <input
                            id="lead-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting || loading}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-email">
                            Email
                        </label>
                        <input
                            id="lead-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting || loading}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-phone">
                            Phone
                        </label>
                        <input
                            id="lead-phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isSubmitting || loading}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-source">
                            Source
                        </label>
                        <input
                            id="lead-source"
                            name="source"
                            type="text"
                            value={formData.source}
                            onChange={handleChange}
                            disabled={isSubmitting || loading}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-stage">
                            Stage
                        </label>
                        <select
                            id="lead-stage"
                            name="stage"
                            value={formData.stage}
                            onChange={handleChange}
                            disabled={isSubmitting || loading}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                        >
                            {LEAD_STAGES.map((stage) => (
                                <option key={stage} value={stage}>{stage}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-notes">
                            Notes
                        </label>
                        <textarea
                            id="lead-notes"
                            name="notes"
                            rows={3}
                            value={formData.notes}
                            onChange={handleChange}
                            disabled={isSubmitting || loading}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
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
                            {isSubmitting || loading ? 'Saving...' : (initialData ? 'Update Lead' : 'Add Lead')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};