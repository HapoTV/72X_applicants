// src/hooks/crm/useLeads.ts

import { useState, useCallback } from 'react';
import type { Lead, CreateLeadRequest, UpdateLeadRequest, LeadStage } from '../../interfaces/crm/lead.interface';
import { leadService } from '../../services/crm/lead.service';
import { useCRM } from './useCRM';
import { crmStorage } from './crmStorage';

export const useLeads = () => {
    const { loading, error, setError, withLoading } = useCRM();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const fetchLeads = useCallback(async () => {
        try {
            console.log('useLeads - Fetching leads...');
            const response = await withLoading(() => leadService.getLeads());
            console.log('useLeads - Full response:', response);

            let leadsData: Lead[] = [];
            let count = 0;

            if (response) {
                if (response.success === true && Array.isArray(response.data)) {
                    leadsData = response.data;
                    count = response.count || response.data.length;
                } else if (Array.isArray(response)) {
                    leadsData = response;
                    count = response.length;
                } else if (response.data && Array.isArray(response.data)) {
                    leadsData = response.data;
                    count = response.data.length;
                } else if (response.leads && Array.isArray(response.leads)) {
                    leadsData = response.leads;
                    count = response.leads.length;
                }
            }

            if (leadsData.length === 0) {
                const fallbackLeads = crmStorage.getLeads();
                leadsData = fallbackLeads;
                count = fallbackLeads.length;
            }

            crmStorage.setLeads(leadsData);
            console.log('useLeads - Setting leads:', leadsData);
            setLeads(leadsData);
            setTotalCount(count);
        } catch (err) {
            console.error('useLeads - Error fetching leads:', err);
            const fallbackLeads = crmStorage.getLeads();
            setLeads(fallbackLeads);
            setTotalCount(fallbackLeads.length);
        }
    }, [withLoading]);

    const getLead = useCallback(async (id: string) => {
        return withLoading(() => leadService.getLead(id));
    }, [withLoading]);

    const createLead = useCallback(async (data: CreateLeadRequest) => {
        try {
            const response = await withLoading(() => leadService.createLead(data));
            if (response && response.success !== false) {
                await fetchLeads();
                return response;
            }
        } catch (err) {
            console.error('useLeads - createLead fallback:', err);
        }

        const fallbackLeads = crmStorage.getLeads();
        const newLead: Lead = {
            id: `lead-${Date.now()}`,
            userId: 'local-user',
            name: data.name,
            email: data.email || '',
            phone: data.phone || '',
            source: data.source || '',
            stage: data.stage || 'New',
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const updatedLeads = [newLead, ...fallbackLeads];
        crmStorage.setLeads(updatedLeads);
        setLeads(updatedLeads);
        setTotalCount(updatedLeads.length);
        return { success: true, data: newLead, message: 'Lead saved locally' };
    }, [withLoading, fetchLeads]);

    const updateLead = useCallback(async (id: string, data: UpdateLeadRequest) => {
        try {
            const response = await withLoading(() => leadService.updateLead(id, data));
            if (response && response.success !== false) {
                await fetchLeads();
                return response;
            }
        } catch (err) {
            console.error('useLeads - updateLead fallback:', err);
        }

        const fallbackLeads = crmStorage.getLeads();
        const updatedLeads = fallbackLeads.map((lead) =>
            lead.id === id ? { ...lead, ...data, updatedAt: new Date().toISOString() } : lead,
        );
        crmStorage.setLeads(updatedLeads);
        setLeads(updatedLeads);
        setTotalCount(updatedLeads.length);
        return { success: true, data: updatedLeads.find((lead) => lead.id === id) as Lead, message: 'Lead updated locally' };
    }, [withLoading, fetchLeads]);

    const updateLeadStage = useCallback(async (id: string, stage: LeadStage) => {
        const response = await withLoading(() => leadService.updateLeadStage(id, stage));
        if (response && response.success !== false) {
            await fetchLeads();
        }
        return response;
    }, [withLoading, fetchLeads]);

    const deleteLead = useCallback(async (id: string) => {
        try {
            const response = await withLoading(() => leadService.deleteLead(id));
            if (response && response.success !== false) {
                await fetchLeads();
                return response;
            }
        } catch (err) {
            console.error('useLeads - deleteLead fallback:', err);
        }

        const fallbackLeads = crmStorage.getLeads().filter((lead) => lead.id !== id);
        crmStorage.setLeads(fallbackLeads);
        setLeads(fallbackLeads);
        setTotalCount(fallbackLeads.length);
        return { success: true, message: 'Lead deleted locally' };
    }, [withLoading, fetchLeads]);

    const searchLeads = useCallback(async (query: string) => {
        try {
            const response = await withLoading(() => leadService.searchLeads(query));
            if (response && response.success !== false) {
                setLeads(response.data || []);
                setTotalCount(response.count || 0);
            }
            return response;
        } catch (err) {
            console.error('useLeads - Error searching leads:', err);
            return { success: false, data: [], count: 0 };
        }
    }, [withLoading]);

    const getLeadsByStage = useCallback(async (stage: LeadStage) => {
        try {
            const response = await withLoading(() => leadService.getLeadsByStage(stage));
            if (response && response.success !== false) {
                setLeads(response.data || []);
                setTotalCount(response.count || 0);
            }
            return response;
        } catch (err) {
            console.error('useLeads - Error fetching leads by stage:', err);
            return { success: false, data: [], count: 0 };
        }
    }, [withLoading]);


    return {
        leads,
        totalCount,
        loading,
        error,
        setError,
        fetchLeads,
        getLead,
        createLead,
        updateLead,
        updateLeadStage,
        deleteLead,
        searchLeads,
        getLeadsByStage,
    };
};