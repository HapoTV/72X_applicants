// src/hooks/crm/useContacts.ts

import { useState, useEffect, useCallback } from 'react';
import type { Contact, CreateContactRequest, UpdateContactRequest } from '../../interfaces/crm/contact.interface';
import { contactService } from '../../services/crm/contact.service';
import { useCRM } from './useCRM';
import { crmStorage } from './crmStorage';

export const useContacts = () => {
    const { loading, error, setError, withLoading } = useCRM();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const fetchContacts = useCallback(async () => {
        try {
            console.log('useContacts - Fetching contacts...');
            const response = await withLoading(() => contactService.getContacts());
            console.log('useContacts - Full response:', response);

            let contactsData: Contact[] = [];
            let count = 0;

            if (response) {
                if (response.success === true && Array.isArray(response.data)) {
                    contactsData = response.data;
                    count = response.count || response.data.length;
                } else if (Array.isArray(response)) {
                    contactsData = response;
                    count = response.length;
                } else if (response.data && Array.isArray(response.data)) {
                    contactsData = response.data;
                    count = response.data.length;
                } else if (response.contacts && Array.isArray(response.contacts)) {
                    contactsData = response.contacts;
                    count = response.contacts.length;
                }
            }

            if (contactsData.length === 0) {
                const fallbackContacts = crmStorage.getContacts();
                contactsData = fallbackContacts;
                count = fallbackContacts.length;
            }

            crmStorage.setContacts(contactsData);
            console.log('useContacts - Setting contacts:', contactsData);
            setContacts(contactsData);
            setTotalCount(count);
        } catch (err) {
            console.error('useContacts - Error fetching contacts:', err);
            const fallbackContacts = crmStorage.getContacts();
            setContacts(fallbackContacts);
            setTotalCount(fallbackContacts.length);
        }
    }, [withLoading]);

    const getContact = useCallback(async (id: string) => {
        return withLoading(() => contactService.getContact(id));
    }, [withLoading]);

    const createContact = useCallback(async (data: CreateContactRequest) => {
        try {
            const response = await withLoading(() => contactService.createContact(data));
            if (response && response.success !== false) {
                await fetchContacts();
                return response;
            }
            const fallbackContacts = crmStorage.getContacts();
            const newContact: Contact = {
                id: `contact-${Date.now()}`,
                userId: 'local-user',
                name: data.name,
                company: data.company || '',
                email: data.email || '',
                phone: data.phone || '',
                notes: data.notes || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const updatedContacts = [newContact, ...fallbackContacts];
            crmStorage.setContacts(updatedContacts);
            setContacts(updatedContacts);
            setTotalCount(updatedContacts.length);
            return { success: true, data: newContact, message: 'Contact saved locally' };
        } catch (err) {
            const fallbackContacts = crmStorage.getContacts();
            const newContact: Contact = {
                id: `contact-${Date.now()}`,
                userId: 'local-user',
                name: data.name,
                company: data.company || '',
                email: data.email || '',
                phone: data.phone || '',
                notes: data.notes || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const updatedContacts = [newContact, ...fallbackContacts];
            crmStorage.setContacts(updatedContacts);
            setContacts(updatedContacts);
            setTotalCount(updatedContacts.length);
            return { success: true, data: newContact, message: 'Contact saved locally' };
        }
    }, [withLoading, fetchContacts]);

    const updateContact = useCallback(async (id: string, data: UpdateContactRequest) => {
        try {
            const response = await withLoading(() => contactService.updateContact(id, data));
            if (response && response.success !== false) {
                await fetchContacts();
                return response;
            }
        } catch (err) {
            console.error('useContacts - updateContact fallback:', err);
        }

        const fallbackContacts = crmStorage.getContacts();
        const updatedContacts = fallbackContacts.map((contact) =>
            contact.id === id ? { ...contact, ...data, updatedAt: new Date().toISOString() } : contact,
        );
        crmStorage.setContacts(updatedContacts);
        setContacts(updatedContacts);
        setTotalCount(updatedContacts.length);
        return { success: true, data: updatedContacts.find((contact) => contact.id === id) as Contact, message: 'Contact updated locally' };
    }, [withLoading, fetchContacts]);

    const deleteContact = useCallback(async (id: string) => {
        try {
            const response = await withLoading(() => contactService.deleteContact(id));
            if (response && response.success !== false) {
                await fetchContacts();
                return response;
            }
        } catch (err) {
            console.error('useContacts - deleteContact fallback:', err);
        }

        const fallbackContacts = crmStorage.getContacts().filter((contact) => contact.id !== id);
        crmStorage.setContacts(fallbackContacts);
        setContacts(fallbackContacts);
        setTotalCount(fallbackContacts.length);
        return { success: true, message: 'Contact deleted locally' };
    }, [withLoading, fetchContacts]);

    const searchContacts = useCallback(async (query: string) => {
        try {
            const response = await withLoading(() => contactService.searchContacts(query));
            if (response && response.success !== false) {
                setContacts(response.data || []);
                setTotalCount(response.count || 0);
            }
            return response;
        } catch (err) {
            console.error('useContacts - Error searching contacts:', err);
            return { success: false, data: [], count: 0 };
        }
    }, [withLoading]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    return {
        contacts,
        totalCount,
        loading,
        error,
        setError,
        fetchContacts,
        getContact,
        createContact,
        updateContact,
        deleteContact,
        searchContacts,
    };
};