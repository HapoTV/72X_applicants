// src/services/crm/crm.service.ts

import type { AxiosRequestConfig } from 'axios';
import axiosClient from '../../api/axiosClient';

export class CRMService {
    protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            console.log(`CRMService GET: ${url}`);
            const response = await axiosClient.get<T>(url, config);
            console.log(`CRMService GET response:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`CRMService GET error for ${url}:`, error);
            throw error;
        }
    }

    protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            console.log(`CRMService POST: ${url}`, data);
            const response = await axiosClient.post<T>(url, data, config);
            console.log(`CRMService POST response:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`CRMService POST error for ${url}:`, error);
            throw error;
        }
    }

    protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            console.log(`CRMService PUT: ${url}`, data);
            const response = await axiosClient.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            console.error(`CRMService PUT error for ${url}:`, error);
            throw error;
        }
    }

    protected async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            console.log(`CRMService PATCH: ${url}`, data);
            const response = await axiosClient.patch<T>(url, data, config);
            return response.data;
        } catch (error) {
            console.error(`CRMService PATCH error for ${url}:`, error);
            throw error;
        }
    }

    protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            console.log(`CRMService DELETE: ${url}`);
            const response = await axiosClient.delete<T>(url, config);
            return response.data;
        } catch (error) {
            console.error(`CRMService DELETE error for ${url}:`, error);
            throw error;
        }
    }
}