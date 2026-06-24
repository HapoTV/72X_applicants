// src/hooks/crm/useContacts.ts

import { useState, useEffect, useCallback } from 'react';
import type { Contact, CreateContactRequest, UpdateContactRequest } from '../../interfaces/crm/contact.interface';
import { contactService } from '../../services/crm/contact.service';
import { useCRM } from './useCRM';

export const useContacts = () => {
    const { loading, error, setError, withLoading } = useCRM();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const fetchContacts = useCallback(async () => {
        try {
            console.log('useContacts - Fetching contacts...');
            const response = await withLoading(() => contactService.getContacts());
            console.log('useContacts - Full response:', response);
            
            // Handle different response structures
            let contactsData: Contact[] = [];
            let count = 0;
            
            if (response) {
                // Case 1: Response has success and data properties
                if (response.success === true && Array.isArray(response.data)) {
                    contactsData = response.data;
                    count = response.count || response.data.length;
                }
                // Case 2: Response is directly an array
                else if (Array.isArray(response)) {
                    contactsData = response;
                    count = response.length;
                }
                // Case 3: Response has data property but not success
                else if (response.data && Array.isArray(response.data)) {
                    contactsData = response.data;
                    count = response.data.length;
                }
                // Case 4: Response is an object with contacts property
                else if (response.contacts && Array.isArray(response.contacts)) {
                    contactsData = response.contacts;
                    count = response.contacts.length;
                }
            }
            
            console.log('useContacts - Setting contacts:', contactsData);
            setContacts(contactsData);
            setTotalCount(count);
        } catch (err) {
            console.error('useContacts - Error fetching contacts:', err);
            setContacts([]);
            setTotalCount(0);
        }
    }, [withLoading]);

    const getContact = useCallback(async (id: string) => {
        return withLoading(() => contactService.getContact(id));
    }, [withLoading]);

    const createContact = useCallback(async (data: CreateContactRequest) => {
        const response = await withLoading(() => contactService.createContact(data));
        if (response && response.success !== false) {
            await fetchContacts();
        }
        return response;
    }, [withLoading, fetchContacts]);

    const updateContact = useCallback(async (id: string, data: UpdateContactRequest) => {
        const response = await withLoading(() => contactService.updateContact(id, data));
        if (response && response.success !== false) {
            await fetchContacts();
        }
        return response;
    }, [withLoading, fetchContacts]);

    const deleteContact = useCallback(async (id: string) => {
        const response = await withLoading(() => contactService.deleteContact(id));
        if (response && response.success !== false) {
            await fetchContacts();
        }
        return response;
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