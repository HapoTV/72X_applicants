// src/services/MarketplaceService.ts
import axiosClient from '../api/axiosClient';
import type { 
  ProductFormData,
  AdminProductItem,
  UserProductItem,
  ProductApiResponse,
  MarketplaceCategory,
  MarketplaceLocation,
  ProductReview,
  ReviewFormData,
  ReviewRequest,
  MarketplaceAnalytics,
  ProductSearchParams,
  ProductSearchResponse
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

  private getBackendBaseUrl(): string {
    const rawBaseUrl = axiosClient.defaults.baseURL;
    if (typeof rawBaseUrl !== 'string' || !rawBaseUrl.trim()) return '';
    return rawBaseUrl.replace(/\/?api\/?$/i, '');
  }

  private normalizeImageUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return '';

    if (
      trimmed.startsWith('data:') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('blob:')
    ) {
      return trimmed;
    }

    const backendBaseUrl = this.getBackendBaseUrl();
    if (!backendBaseUrl) return trimmed;

    try {
      return new URL(trimmed, backendBaseUrl).toString();
    } catch {
      return trimmed;
    }
  }

  private normalizeImages(raw: unknown): string[] {
    if (Array.isArray(raw)) {
      return raw
        .filter((x) => typeof x === 'string')
        .map((x) => this.normalizeImageUrl(x))
        .filter((x) => x.length > 0);
    }

    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed) return [];

      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed
              .filter((x) => typeof x === 'string')
              .map((x) => this.normalizeImageUrl(x))
              .filter((x) => x.length > 0);
          }
        } catch {
          // fall through
        }
      }

      return [this.normalizeImageUrl(trimmed)].filter((x) => x.length > 0);
    }

    return [];
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
      const data: any = response.data;

      return {
        ...data,
        productId: data?.productId || data?.id,
        seller: data?.seller ?? data?.sellerName,
        sellerId: data?.sellerId,
        images: this.normalizeImages(data?.images)
      } as ProductApiResponse;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
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
      const productDTO = this.transformToProductDTO(productData, createdBy);
      const tagsValue =
        typeof productDTO.tags === 'string'
          ? productDTO.tags
          : Array.isArray(productDTO.tags)
            ? productDTO.tags.join(',')
            : null;

      const specificationsValue =
        typeof productDTO.specifications === 'string'
          ? productDTO.specifications
          : productDTO.specifications && typeof productDTO.specifications === 'object'
            ? this.formatSpecifications(productDTO.specifications)
            : null;

      const imagesValue =
        typeof productDTO.images === 'string'
          ? productDTO.images
          : Array.isArray(productDTO.images) && productDTO.images.length > 0
            ? productDTO.images[0]
            : null;

      const response = await axiosClient.put(
        `/marketplace/products/${productId}`,
        {
          title: productDTO.title,
          description: productDTO.description,
          price: productDTO.price,
          category: productDTO.category,
          location: productDTO.location,
          condition: productDTO.condition,
          tags: tagsValue,
          specifications: specificationsValue,
          shippingInfo: productDTO.shippingInfo,
          returnPolicy: productDTO.returnPolicy,
          negotiable: productDTO.negotiable,
          images: imagesValue,
          createdBy: productDTO.createdBy
        },
        {
          headers: this.getAuthHeader()
        }
      );
      return this.transformToAdminProductItem(response.data);
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const messageFromBackend =
        typeof data === 'string'
          ? data
          : typeof data?.message === 'string'
            ? data.message
            : undefined;
      console.error('Error updating product:', { status, data });
      throw new Error(messageFromBackend || 'Failed to update product');
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

  async updateProductStatus(productId: string, status: 'active' | 'sold' | 'pending' | 'removed'): Promise<void> {
    try {
      await axiosClient.patch(`/marketplace/products/${productId}/status`, null, {
        params: { status },
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error updating product status:', error);
      throw new Error('Failed to update product status');
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

  async getCategories(): Promise<MarketplaceCategory[]> {
    return [
      { id: 'all', name: 'All Categories' },
      { id: 'food', name: 'Food & Beverages' },
      { id: 'crafts', name: 'Arts & Crafts' },
      { id: 'clothing', name: 'Clothing & Fashion' },
      { id: 'services', name: 'Services' },
      { id: 'agriculture', name: 'Agriculture' },
      { id: 'beauty', name: 'Beauty & Personal Care' },
      { id: 'electronics', name: 'Electronics & Repairs' },
      { id: 'home', name: 'Home & Garden' },
      { id: 'other', name: 'Other' },
    ];
  }

  async getLocations(): Promise<MarketplaceLocation[]> {
    return [
      { id: 'all', name: 'All Locations' },
      { id: 'soweto', name: 'Soweto' },
      { id: 'alexandra', name: 'Alexandra' },
      { id: 'khayelitsha', name: 'Khayelitsha' },
      { id: 'mitchells-plain', name: 'Mitchells Plain' },
      { id: 'mamelodi', name: 'Mamelodi' },
      { id: 'umlazi', name: 'Umlazi' },
      { id: 'mdantsane', name: 'Mdantsane' },
      { id: 'other', name: 'Other' },
    ];
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
      id: apiProduct.productId || apiProduct.id,
      title: apiProduct.title,
      description: apiProduct.description,
      price: apiProduct.price,
      seller: apiProduct.seller,
      sellerId: apiProduct.sellerId,
      location: apiProduct.location,
      category: apiProduct.category,
      rating: apiProduct.rating,
      reviews: apiProduct.reviews,
      images: this.normalizeImages(apiProduct.images),
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
      id: apiProduct.productId || apiProduct.id,
      title: apiProduct.title,
      description: apiProduct.description,
      price: apiProduct.price,
      seller: apiProduct.seller,
      sellerId: apiProduct.sellerId,
      location: apiProduct.location,
      category: apiProduct.category,
      rating: apiProduct.rating,
      reviews: apiProduct.reviews,
      images: this.normalizeImages(apiProduct.images),
      featured: apiProduct.featured || false,
      inStock: apiProduct.inStock !== false,
      condition: apiProduct.condition,
      negotiable: apiProduct.negotiable,
      status: apiProduct.status,
      timeAgo: this.formatTimeAgo(apiProduct.createdAt),
      isLiked: false,
      createdAt: apiProduct.createdAt
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