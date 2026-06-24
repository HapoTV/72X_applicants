// src/hooks/crm/useActivities.ts

import { useState, useEffect, useCallback } from 'react';
import type { Activity } from '../../interfaces/crm/activity.interface';
import { activityService } from '../../services/crm/activity.service';
import { useCRM } from './useCRM';

export const useActivities = () => {
    const { loading, error, setError, withLoading } = useCRM();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const fetchActivities = useCallback(async () => {
        try {
            console.log('useActivities - Fetching activities...');
            const response = await withLoading(() => activityService.getActivities());
            console.log('useActivities - Full response:', response);
            
            let activitiesData: Activity[] = [];
            let count = 0;
            
            if (response) {
                if (response.success === true && Array.isArray(response.data)) {
                    activitiesData = response.data;
                    count = response.count || response.data.length;
                } else if (Array.isArray(response)) {
                    activitiesData = response;
                    count = response.length;
                } else if (response.data && Array.isArray(response.data)) {
                    activitiesData = response.data;
                    count = response.data.length;
                } else if (response.activities && Array.isArray(response.activities)) {
                    activitiesData = response.activities;
                    count = response.activities.length;
                }
            }
            
            console.log('useActivities - Setting activities:', activitiesData);
            setActivities(activitiesData);
            setTotalCount(count);
        } catch (err) {
            console.error('useActivities - Error fetching activities:', err);
            setActivities([]);
            setTotalCount(0);
        }
    }, [withLoading]);

    const fetchRecentActivities = useCallback(async (limit: number = 10) => {
        try {
            const response = await withLoading(() => activityService.getRecentActivities(limit));
            console.log('useActivities - Recent activities response:', response);
            
            let activitiesData: Activity[] = [];
            let count = 0;
            
            if (response) {
                if (response.success === true && Array.isArray(response.data)) {
                    activitiesData = response.data;
                    count = response.count || response.data.length;
                } else if (Array.isArray(response)) {
                    activitiesData = response;
                    count = response.length;
                } else if (response.data && Array.isArray(response.data)) {
                    activitiesData = response.data;
                    count = response.data.length;
                }
            }
            
            setActivities(activitiesData);
            setTotalCount(count);
            return response;
        } catch (err) {
            console.error('useActivities - Error fetching recent activities:', err);
            return { success: false, data: [], count: 0 };
        }
    }, [withLoading]);

    const deleteAllActivities = useCallback(async () => {
        const response = await withLoading(() => activityService.deleteAllActivities());
        if (response && response.success !== false) {
            await fetchActivities();
        }
        return response;
    }, [withLoading, fetchActivities]);

    useEffect(() => {
        fetchRecentActivities(10);
    }, []);

    return {
        activities,
        totalCount,
        loading,
        error,
        setError,
        fetchActivities,
        fetchRecentActivities,
        deleteAllActivities,
    };
};