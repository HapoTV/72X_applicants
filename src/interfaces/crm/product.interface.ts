// src/interfaces/crm/product.interface.ts

export interface Product {
    id: string;
    userId: string;
    name: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    price?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    id: string;
}

export interface ProductResponse {
    success: boolean;
    data: Product;
    message?: string;
}

export interface ProductsResponse {
    success: boolean;
    data: Product[];
    count: number;
    message?: string;
}