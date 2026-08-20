// src/hooks/crm/useProducts.ts

import { useState, useEffect, useCallback } from 'react';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../../interfaces/crm/product.interface';
import { productService } from '../../services/crm/product.service';
import { useCRM } from './useCRM';
import { crmStorage } from './crmStorage';

export const useProducts = () => {
    const { loading, error, setError, withLoading } = useCRM();
    const [products, setProducts] = useState<Product[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const fetchProducts = useCallback(async () => {
        try {
            console.log('useProducts - Fetching products...');
            const response = await withLoading(() => productService.getProducts());
            console.log('useProducts - Full response:', response);

            let productsData: Product[] = [];
            let count = 0;

            if (response) {
                if (response.success === true && Array.isArray(response.data)) {
                    productsData = response.data;
                    count = response.count || response.data.length;
                } else if (Array.isArray(response)) {
                    productsData = response;
                    count = response.length;
                } else if (response.data && Array.isArray(response.data)) {
                    productsData = response.data;
                    count = response.data.length;
                } else if (response.products && Array.isArray(response.products)) {
                    productsData = response.products;
                    count = response.products.length;
                }
            }

            if (productsData.length === 0) {
                const fallbackProducts = crmStorage.getProducts();
                productsData = fallbackProducts;
                count = fallbackProducts.length;
            }

            crmStorage.setProducts(productsData);
            console.log('useProducts - Setting products:', productsData);
            setProducts(productsData);
            setTotalCount(count);
        } catch (err) {
            console.error('useProducts - Error fetching products:', err);
            const fallbackProducts = crmStorage.getProducts();
            setProducts(fallbackProducts);
            setTotalCount(fallbackProducts.length);
        }
    }, [withLoading]);

    const getProduct = useCallback(async (id: string) => {
        return withLoading(() => productService.getProduct(id));
    }, [withLoading]);

    const createProduct = useCallback(async (data: CreateProductRequest) => {
        try {
            const response = await withLoading(() => productService.createProduct(data));
            if (response && response.success !== false) {
                await fetchProducts();
                return response;
            }
        } catch (err) {
            console.error('useProducts - createProduct fallback:', err);
        }

        const fallbackProducts = crmStorage.getProducts();
        const newProduct: Product = {
            id: `product-${Date.now()}`,
            userId: 'local-user',
            name: data.name,
            price: data.price,
            description: data.description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const updatedProducts = [newProduct, ...fallbackProducts];
        crmStorage.setProducts(updatedProducts);
        setProducts(updatedProducts);
        setTotalCount(updatedProducts.length);
        return { success: true, data: newProduct, message: 'Product saved locally' };
    }, [withLoading, fetchProducts]);

    const updateProduct = useCallback(async (id: string, data: UpdateProductRequest) => {
        const response = await withLoading(() => productService.updateProduct(id, data));
        if (response && response.success !== false) {
            await fetchProducts();
        }
        return response;
    }, [withLoading, fetchProducts]);

    const deleteProduct = useCallback(async (id: string) => {
        const response = await withLoading(() => productService.deleteProduct(id));
        if (response && response.success !== false) {
            await fetchProducts();
        }
        return response;
    }, [withLoading, fetchProducts]);

    const searchProducts = useCallback(async (query: string) => {
        try {
            const response = await withLoading(() => productService.searchProducts(query));
            if (response && response.success !== false) {
                setProducts(response.data || []);
                setTotalCount(response.count || 0);
            }
            return response;
        } catch (err) {
            console.error('useProducts - Error searching products:', err);
            return { success: false, data: [], count: 0 };
        }
    }, [withLoading]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        totalCount,
        loading,
        error,
        setError,
        fetchProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
    };
};