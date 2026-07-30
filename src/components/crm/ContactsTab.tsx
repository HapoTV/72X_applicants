// src/components/crm/ContactsTab.tsx

import React, { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { ContactCard } from './ContactCard';
import type { Contact } from '../../interfaces/crm/contact.interface';

interface ContactsTabProps {
    contacts: Contact[];
    loading: boolean;
    onAdd: () => void;
    onEdit: (contact: Contact) => void;
    onDelete: (contact: Contact) => void;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({
    contacts,
    loading,
    onAdd,
    onEdit,
    onDelete,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (contact: Contact) => {
        console.log('Edit contact clicked:', contact);
        onEdit(contact);
    };

    const handleDelete = (contact: Contact) => {
        console.log('Delete contact clicked:', contact);
        if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
            onDelete(contact);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[255px]">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading contacts...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Contacts</h2>
                    <p className="text-sm text-gray-600">Manage your business contacts</p>
                </div>
                <button
                    onClick={() => {
                        console.log('Add contact clicked');
                        onAdd();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add Contact
                </button>
            </section>

            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[255px]">
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                </div>

                <div className="flex min-h-[175px] flex-col items-center justify-center text-center">
                    {filteredContacts.length === 0 ? (
                        <>
                            <Users className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">
                                {searchTerm ? 'No contacts match your search.' : 'No contacts yet. Add your first contact to get started!'}
                            </p>
                        </>
                    ) : (
                        <div className="w-full space-y-3 text-left">
                            {filteredContacts.map((contact) => (
                                <ContactCard
                                    key={contact.id}
                                    contact={contact}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};