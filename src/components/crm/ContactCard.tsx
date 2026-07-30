// src/components/crm/ContactCard.tsx

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Contact } from '../../interfaces/crm/contact.interface';

interface ContactCardProps {
    contact: Contact;
    onEdit: (contact: Contact) => void;
    onDelete: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
    contact,
    onEdit,
    onDelete,
}) => {
    // Handle click events with proper stopPropagation
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Edit button clicked for:', contact.name);
        onEdit(contact);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Delete button clicked for:', contact.name);
        onDelete(contact);
    };

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-primary-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-sm font-bold text-primary-600">
                    {contact?.name ? contact.name.slice(0, 2).toUpperCase() : '??'}
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{contact?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{contact?.company || 'No company added'}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 px-4 py-2">
                    <span className="block font-medium text-gray-500">Email</span>
                    <span className="text-gray-900">{contact?.email || '-'}</span>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-2">
                    <span className="block font-medium text-gray-500">Phone</span>
                    <span className="text-gray-900">{contact?.phone || '-'}</span>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-2 sm:col-span-2">
                    <span className="block font-medium text-gray-500">Notes</span>
                    <span className="text-gray-900">{contact?.notes || '-'}</span>
                </div>
            </div>
            
            <div className="flex shrink-0 items-center gap-2">
                <button
                    type="button"
                    onClick={handleEditClick}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                </button>
                <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                </button>
            </div>
        </div>
    );
};