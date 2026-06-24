// src/services/crm/product.service.ts

import type {
    Product,
    CreateProductRequest,
    UpdateProductRequest,
    ProductResponse,
    ProductsResponse,
} from '../../interfaces/crm/product.interface';
import { CRMService } from './crm.service';

export class ProductService extends CRMService {
    private readonly endpoint = '/crm/products';

    async getProducts(): Promise<ProductsResponse> {
        const response = await this.get<ProductsResponse>(this.endpoint);
        console.log('ProductService - getProducts raw response:', response);
        return response;
    }

    async getProduct(id: string): Promise<ProductResponse> {
        return this.get<ProductResponse>(`${this.endpoint}/${id}`);
    }

    async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
        return this.post<ProductResponse>(this.endpoint, data);
    }

    async updateProduct(id: string, data: UpdateProductRequest): Promise<ProductResponse> {
        return this.put<ProductResponse>(`${this.endpoint}/${id}`, data);
    }

    async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
        return this.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
    }

    async searchProducts(query: string): Promise<ProductsResponse> {
        return this.get<ProductsResponse>(`${this.endpoint}/search`, { params: { q: query } });
    }
}

export const productService = new ProductService();