// src/hooks/crm/useCRM.ts

import { useState, useEffect, useCallback } from 'react';
// import type { CRMStats } from '../../interfaces/crm/stats.interface';

export const useCRM = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: any) => {
        const message = err?.response?.data?.message || err?.message || 'An error occurred';
        setError(message);
        console.error('CRM Error:', err);
        return message;
    };

    const withLoading = async <T,>(fn: () => Promise<T>): Promise<T> => {
        setLoading(true);
        setError(null);
        try {
            const result = await fn();
            return result;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        setError,
        withLoading,
        handleError,
    };
};