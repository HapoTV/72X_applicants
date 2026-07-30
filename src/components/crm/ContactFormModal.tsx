// src/components/crm/ContactFormModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Contact, CreateContactRequest } from '../../interfaces/crm/contact.interface';

interface ContactFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateContactRequest) => Promise<void>;
    initialData?: Contact | null;
    loading: boolean;
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    loading,
}) => {
    const [formData, setFormData] = useState<CreateContactRequest>({
        name: '',
        company: '',
        email: '',
        phone: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Reset form when modal opens/closes or initialData changes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    company: initialData.company || '',
                    email: initialData.email || '',
                    phone: initialData.phone || '',
                    notes: initialData.notes || '',
                });
            } else {
                setFormData({
                    name: '',
                    company: '',
                    email: '',
                    phone: '',
                    notes: '',
                });
            }
            setIsSubmitting(false);
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent submission if already submitting or loading
        if (isSubmitting || loading) {
            console.log('Already submitting, ignoring...');
            return;
        }
        
        // Validate required fields
        if (!formData.name || formData.name.trim() === '') {
            console.warn('Name is required');
            return;
        }
        
        console.log('Submitting contact form...', formData);
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            console.log('Contact form submitted successfully');
        } catch (error) {
            console.error('Error submitting form:', error);
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
        console.log('Closing contact form');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={handleClose}>
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl border border-gray-100" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {initialData ? 'Edit Contact' : 'Add New Contact'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {initialData ? 'Update this business contact record.' : 'Create a new business contact record.'}
                        </p>
                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-name">
                                Full Name *
                            </label>
                            <input
                                id="contact-name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                                disabled={isSubmitting || loading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-company">
                                Company
                            </label>
                            <input
                                id="contact-company"
                                name="company"
                                type="text"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                disabled={isSubmitting || loading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-email">
                                Email
                            </label>
                            <input
                                id="contact-email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                disabled={isSubmitting || loading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-phone">
                                Phone
                            </label>
                            <input
                                id="contact-phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                disabled={isSubmitting || loading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-notes">
                            Notes
                        </label>
                        <textarea
                            id="contact-notes"
                            name="notes"
                            rows={4}
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add notes about this contact"
                            disabled={isSubmitting || loading}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
                            {isSubmitting || loading ? 'Saving...' : (initialData ? 'Update Contact' : 'Save Contact')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};