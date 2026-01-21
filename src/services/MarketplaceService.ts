// src/services/MarketplaceService.ts
import axiosClient from '../api/axiosClient';
import type { 
  ProductFormData,
  AdminProductItem,
  UserProductItem,
  ProductApiResponse,
  ProductRequest,
  MarketplaceCategory,
  MarketplaceLocation,
  SellerFormData,
  SellerApiResponse,
  ProductReview,
  ReviewFormData,
  ReviewRequest,
  ProductMessage,
  MessageFormData,
  MessageRequest,
  MarketplaceAnalytics,
  ProductSearchParams,
  ProductSearchResponse,
  ReportFormData
} from '../interfaces/MarketplaceData';

class MarketplaceService {
  
  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private getCurrentUserId(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id || user.userId || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return '';
  }

  // ==================== PRODUCT OPERATIONS ====================

  async getAllProducts(): Promise<AdminProductItem[]> {
    try {
      const response = await axiosClient.get('/marketplace/products', {
        headers: this.getAuthHeader()
      });
      return response.data.map((product: any) => 
        this.transformToAdminProductItem(product)
      );
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async getActiveProducts(params?: ProductSearchParams): Promise<ProductSearchResponse> {
    try {
      const response = await axiosClient.get('/marketplace/products', { 
        params,
        headers: this.getAuthHeader()
      });

      const data = response.data as any;

      const rawProducts: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.content)
            ? data.content
            : [];

      const total =
        typeof data?.total === 'number'
          ? data.total
          : typeof data?.totalElements === 'number'
            ? data.totalElements
            : rawProducts.length;

      const page = typeof params?.page === 'number' ? params.page : 0;
      const limit = typeof params?.limit === 'number' ? params.limit : rawProducts.length;
      const totalPages =
        typeof data?.totalPages === 'number'
          ? data.totalPages
          : limit > 0
            ? Math.max(1, Math.ceil(total / limit))
            : 1;

      return {
        products: rawProducts.map((product: any) => this.transformToUserProductItem(product)),
        total,
        page,
        limit,
        totalPages,
        hasMore: page + 1 < totalPages
      };
    } catch (error) {
      console.error('Error fetching active products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async getFeaturedProducts(): Promise<UserProductItem[]> {
    try {
      const response = await axiosClient.get('/marketplace/products/featured', {
        headers: this.getAuthHeader()
      });
      return response.data.map((product: any) => 
        this.transformToUserProductItem(product)
      );
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw new Error('Failed to fetch featured products');
    }
  }

  async getProductById(productId: string): Promise<ProductApiResponse> {
    try {
      const response = await axiosClient.get(`/marketplace/products/${productId}`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  async createProduct(productData: ProductFormData, createdBy: string, seller?: string): Promise<AdminProductItem> {
    try {
      const productDTO = this.transformToProductDTO(productData, createdBy, seller);
      const response = await axiosClient.post('/marketplace/products', productDTO, {
        headers: this.getAuthHeader()
      });
      return this.transformToAdminProductItem(response.data);
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      console.error('Error creating product:', { status, data });
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(productId: string, productData: ProductFormData, createdBy: string): Promise<AdminProductItem> {
    try {
      const productRequest: ProductRequest = this.transformToProductRequest(productData, createdBy);
      const response = await axiosClient.put(`/marketplace/products/${productId}`, productRequest, {
        headers: this.getAuthHeader()
      });
      return this.transformToAdminProductItem(response.data);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await axiosClient.delete(`/marketplace/products/${productId}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  async getSellerProducts(): Promise<UserProductItem[]> {
    try {
      const response = await axiosClient.get('/marketplace/products/my-products', {
        headers: this.getAuthHeader()
      });
      return response.data.map((product: any) => 
        this.transformToUserProductItem(product)
      );
    } catch (error) {
      console.error('Error fetching seller products:', error);
      throw new Error('Failed to fetch seller products');
    }
  }

  // ==================== REVIEW OPERATIONS ====================

  async getProductReviews(productId: string): Promise<ProductReview[]> {
    try {
      const response = await axiosClient.get(`/marketplace/reviews/${productId}`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw new Error('Failed to fetch reviews');
    }
  }

  async addProductReview(reviewData: ReviewFormData, createdBy: string): Promise<ProductReview> {
    try {
      const reviewRequest: ReviewRequest = this.transformToReviewRequest(reviewData, createdBy);
      const response = await axiosClient.post('/marketplace/reviews', reviewRequest, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw new Error('Failed to add review');
    }
  }

  async markReviewHelpful(reviewId: string): Promise<void> {
    try {
      await axiosClient.post(`/marketplace/reviews/${reviewId}/helpful`, {}, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw new Error('Failed to update review');
    }
  }

  // ==================== ANALYTICS ====================

  async getMarketplaceAnalytics(): Promise<MarketplaceAnalytics> {
    try {
      const response = await axiosClient.get('/marketplace/analytics', {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching marketplace analytics:', error);
      throw new Error('Failed to fetch analytics');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  private transformToAdminProductItem(apiProduct: any): AdminProductItem {
    return {
      id: apiProduct.productId,
      title: apiProduct.title,
      description: apiProduct.description,
      price: apiProduct.price,
      seller: apiProduct.seller,
      sellerId: apiProduct.sellerId,
      location: apiProduct.location,
      category: apiProduct.category,
      rating: apiProduct.rating,
      reviews: apiProduct.reviews,
      images: apiProduct.images,
      featured: apiProduct.featured || false,
      inStock: apiProduct.inStock !== false,
      condition: apiProduct.condition,
      tags: apiProduct.tags,
      specifications: apiProduct.specifications,
      shippingInfo: apiProduct.shippingInfo,
      returnPolicy: apiProduct.returnPolicy,
      negotiable: apiProduct.negotiable,
      views: apiProduct.views,
      likes: apiProduct.likes,
      shares: apiProduct.shares,
      status: apiProduct.status,
      createdAt: apiProduct.createdAt,
      createdBy: apiProduct.createdBy
    };
  }

  private transformToUserProductItem(apiProduct: any): UserProductItem {
    return {
      id: apiProduct.productId,
      title: apiProduct.title,
      description: apiProduct.description,
      price: apiProduct.price,
      seller: apiProduct.seller,
      location: apiProduct.location,
      category: apiProduct.category,
      rating: apiProduct.rating,
      reviews: apiProduct.reviews,
      images: apiProduct.images,
      featured: apiProduct.featured || false,
      inStock: apiProduct.inStock !== false,
      condition: apiProduct.condition,
      negotiable: apiProduct.negotiable,
      status: apiProduct.status,
      timeAgo: this.formatTimeAgo(apiProduct.createdAt),
      isLiked: false
    };
  }

  private transformToProductRequest(formData: ProductFormData, createdBy: string): ProductRequest {
    return {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      location: formData.location,
      condition: formData.condition,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      specifications: this.parseSpecifications(formData.specifications),
      shippingInfo: formData.shippingInfo || undefined,
      returnPolicy: formData.returnPolicy || undefined,
      negotiable: formData.negotiable,
      images: formData.images,
      createdBy: createdBy
    };
  }

  private transformToProductDTO(formData: ProductFormData, createdBy: string, seller?: string): any {
    return {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      location: formData.location,
      condition: formData.condition || 'new',
      status: 'active',
      tags: formData.tags || null,
      specifications: formData.specifications || null,
      shippingInfo: formData.shippingInfo || null,
      returnPolicy: formData.returnPolicy || null,
      negotiable: formData.negotiable || false,
      images: Array.isArray(formData.images) && formData.images.length > 0 ? formData.images[0] : null,
      createdBy: createdBy,
      sellerName: seller || undefined,
      sellerId: this.getCurrentUserId()
    };
  }

  private transformToReviewRequest(formData: ReviewFormData, createdBy: string): ReviewRequest {
    return {
      productId: formData.productId,
      rating: formData.rating,
      comment: formData.comment,
      images: formData.images,
      createdBy: createdBy
    };
  }

  private transformToMessageRequest(formData: MessageFormData, createdBy: string): MessageRequest {
    return {
      productId: formData.productId,
      receiverId: formData.receiverId,
      message: formData.message,
      createdBy: createdBy
    };
  }

  transformToProductFormData(product: AdminProductItem): ProductFormData {
    return {
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      location: product.location,
      condition: product.condition || 'new',
      tags: product.tags ? product.tags.join(', ') : '',
      specifications: product.specifications ? this.formatSpecifications(product.specifications) : '',
      shippingInfo: product.shippingInfo || '',
      returnPolicy: product.returnPolicy || '',
      negotiable: product.negotiable || false,
      images: product.images
    };
  }

  // ==================== UTILITY METHODS ====================

  private parseSpecifications(specString: string): Record<string, string> {
    const specs: Record<string, string> = {};
    if (!specString) return specs;
    
    specString.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        specs[key.trim()] = valueParts.join(':').trim();
      }
    });
    
    return specs;
  }

  private formatSpecifications(specs: Record<string, string>): string {
    return Object.entries(specs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  }

  private formatTimeAgo(dateString?: string): string {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  validateProductForm(formData: ProductFormData): string | null {
    if (!formData.title.trim()) {
      return 'Product title is required';
    }
    if (!formData.description.trim()) {
      return 'Product description is required';
    }
    if (!formData.price.trim()) {
      return 'Price is required';
    }
    if (!formData.category.trim()) {
      return 'Category is required';
    }
    if (!formData.location.trim()) {
      return 'Location is required';
    }
    
    return null;
  }

  validateReviewForm(formData: ReviewFormData): string | null {
    if (!formData.productId) {
      return 'Product ID is required';
    }
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      return 'Rating must be between 1 and 5';
    }
    if (!formData.comment.trim()) {
      return 'Review comment is required';
    }
    
    return null;
  }

  getConditionColor(condition?: 'new' | 'used' | 'refurbished'): string {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-yellow-100 text-yellow-800';
      case 'refurbished': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: 'active' | 'sold' | 'pending' | 'removed'): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'removed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}

export const marketplaceService = new MarketplaceService();
export default marketplaceService;