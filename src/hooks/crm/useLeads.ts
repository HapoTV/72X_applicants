// src/hooks/crm/useLeads.ts

import { useState, useEffect, useCallback } from 'react';
import type { Lead, CreateLeadRequest, UpdateLeadRequest, LeadStage } from '../../interfaces/crm/lead.interface';
import { leadService } from '../../services/crm/lead.service';
import { useCRM } from './useCRM';

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
            
            console.log('useLeads - Setting leads:', leadsData);
            setLeads(leadsData);
            setTotalCount(count);
        } catch (err) {
            console.error('useLeads - Error fetching leads:', err);
            setLeads([]);
            setTotalCount(0);
        }
    }, [withLoading]);

    const getLead = useCallback(async (id: string) => {
        return withLoading(() => leadService.getLead(id));
    }, [withLoading]);

    const createLead = useCallback(async (data: CreateLeadRequest) => {
        const response = await withLoading(() => leadService.createLead(data));
        if (response && response.success !== false) {
            await fetchLeads();
        }
        return response;
    }, [withLoading, fetchLeads]);

    const updateLead = useCallback(async (id: string, data: UpdateLeadRequest) => {
        const response = await withLoading(() => leadService.updateLead(id, data));
        if (response && response.success !== false) {
            await fetchLeads();
        }
        return response;
    }, [withLoading, fetchLeads]);

    const updateLeadStage = useCallback(async (id: string, stage: LeadStage) => {
        const response = await withLoading(() => leadService.updateLeadStage(id, stage));
        if (response && response.success !== false) {
            await fetchLeads();
        }
        return response;
    }, [withLoading, fetchLeads]);

    const deleteLead = useCallback(async (id: string) => {
        const response = await withLoading(() => leadService.deleteLead(id));
        if (response && response.success !== false) {
            await fetchLeads();
        }
        return response;
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

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

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