// src/hooks/crm/useSales.ts

import { useState, useEffect, useCallback } from 'react';
import type { Sale, CreateSaleRequest, UpdateSaleRequest } from '../../interfaces/crm/sale.interface';
import { saleService } from '../../services/crm/sale.service';
import { useCRM } from './useCRM';
import { crmStorage } from './crmStorage';

export const useSales = () => {
    const { loading, error, setError, withLoading } = useCRM();
    const [sales, setSales] = useState<Sale[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const fetchSales = useCallback(async () => {
        try {
            console.log('useSales - Fetching sales...');
            const response = await withLoading(() => saleService.getSales());
            console.log('useSales - Full response:', response);

            let salesData: Sale[] = [];
            let count = 0;

            if (response) {
                if (response.success === true && Array.isArray(response.data)) {
                    salesData = response.data;
                    count = response.count || response.data.length;
                } else if (Array.isArray(response)) {
                    salesData = response;
                    count = response.length;
                } else if (response.data && Array.isArray(response.data)) {
                    salesData = response.data;
                    count = response.data.length;
                } else if (response.sales && Array.isArray(response.sales)) {
                    salesData = response.sales;
                    count = response.sales.length;
                }
            }

            if (salesData.length === 0) {
                const fallbackSales = crmStorage.getSales();
                salesData = fallbackSales;
                count = fallbackSales.length;
            }

            crmStorage.setSales(salesData);
            console.log('useSales - Setting sales:', salesData);
            setSales(salesData);
            setTotalCount(count);
        } catch (err) {
            console.error('useSales - Error fetching sales:', err);
            const fallbackSales = crmStorage.getSales();
            setSales(fallbackSales);
            setTotalCount(fallbackSales.length);
        }
    }, [withLoading]);

    const getSale = useCallback(async (id: string) => {
        return withLoading(() => saleService.getSale(id));
    }, [withLoading]);

    const createSale = useCallback(async (data: CreateSaleRequest) => {
        try {
            const response = await withLoading(() => saleService.createSale(data));
            if (response && response.success !== false) {
                await fetchSales();
                return response;
            }
        } catch (err) {
            console.error('useSales - createSale fallback:', err);
        }

        const fallbackSales = crmStorage.getSales();
        const newSale: Sale = {
            id: `sale-${Date.now()}`,
            userId: 'local-user',
            customerId: data.customerId,
            customerName: data.customerName,
            productId: data.productId,
            productName: data.productName,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            date: data.date,
            status: data.status || 'Pending',
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const updatedSales = [newSale, ...fallbackSales];
        crmStorage.setSales(updatedSales);
        setSales(updatedSales);
        setTotalCount(updatedSales.length);
        return { success: true, data: newSale, message: 'Sale saved locally' };
    }, [withLoading, fetchSales]);

    const updateSale = useCallback(async (id: string, data: UpdateSaleRequest) => {
        try {
            const response = await withLoading(() => saleService.updateSale(id, data));
            if (response && response.success !== false) {
                await fetchSales();
                return response;
            }
        } catch (err) {
            console.error('useSales - updateSale fallback:', err);
        }

        const fallbackSales = crmStorage.getSales();
        const updatedSales = fallbackSales.map((sale) =>
            sale.id === id ? { ...sale, ...data, updatedAt: new Date().toISOString() } : sale,
        );
        crmStorage.setSales(updatedSales);
        setSales(updatedSales);
        setTotalCount(updatedSales.length);
        return { success: true, data: updatedSales.find((sale) => sale.id === id) as Sale, message: 'Sale updated locally' };
    }, [withLoading, fetchSales]);

    const deleteSale = useCallback(async (id: string) => {
        try {
            const response = await withLoading(() => saleService.deleteSale(id));
            if (response && response.success !== false) {
                await fetchSales();
                return response;
            }
        } catch (err) {
            console.error('useSales - deleteSale fallback:', err);
        }

        const fallbackSales = crmStorage.getSales().filter((sale) => sale.id !== id);
        crmStorage.setSales(fallbackSales);
        setSales(fallbackSales);
        setTotalCount(fallbackSales.length);
        return { success: true, message: 'Sale deleted locally' };
    }, [withLoading, fetchSales]);

    const searchSales = useCallback(async (query: string) => {
        try {
            const response = await withLoading(() => saleService.searchSales(query));
            if (response && response.success !== false) {
                setSales(response.data || []);
                setTotalCount(response.count || 0);
            }
            return response;
        } catch (err) {
            console.error('useSales - Error searching sales:', err);
            return { success: false, data: [], count: 0 };
        }
    }, [withLoading]);

    const getSalesByDateRange = useCallback(async (start: string, end: string) => {
        try {
            const response = await withLoading(() => saleService.getSalesByDateRange(start, end));
            if (response && response.success !== false) {
                setSales(response.data || []);
                setTotalCount(response.count || 0);
            }
            return response;
        } catch (err) {
            console.error('useSales - Error fetching sales by date range:', err);
            return { success: false, data: [], count: 0 };
        }
    }, [withLoading]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    return {
        sales,
        totalCount,
        loading,
        error,
        setError,
        fetchSales,
        getSale,
        createSale,
        updateSale,
        deleteSale,
        searchSales,
        getSalesByDateRange,
    };
};