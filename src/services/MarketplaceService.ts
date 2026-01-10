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
  SellerRequest,
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

/**
 * Service layer for handling all marketplace-related operations
 */
class MarketplaceService {
  
  // ==================== PRODUCT OPERATIONS ====================

  /**
   * Get all products (Admin only)
   */
  async getAllProducts(): Promise<AdminProductItem[]> {
    try {
      const response = await axiosClient.get('/marketplace/products');
      return response.data.map((product: ProductApiResponse) => 
        this.transformToAdminProductItem(product)
      );
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get active products for users
   */
  async getActiveProducts(params?: ProductSearchParams): Promise<ProductSearchResponse> {
    try {
      const response = await axiosClient.get('/marketplace/products/active', { params });
      return {
        products: response.data.products.map((product: ProductApiResponse) => 
          this.transformToUserProductItem(product)
        ),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        hasMore: response.data.hasMore
      };
    } catch (error) {
      console.error('Error fetching active products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(): Promise<UserProductItem[]> {
    try {
      const response = await axiosClient.get('/marketplace/products/featured');
      return response.data.map((product: ProductApiResponse) => 
        this.transformToUserProductItem(product)
      );
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw new Error('Failed to fetch featured products');
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: string): Promise<ProductApiResponse> {
    try {
      const response = await axiosClient.get(`/marketplace/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  /**
   * Create a new product
   */
  async createProduct(productData: ProductFormData, createdBy: string): Promise<AdminProductItem> {
    try {
      const productDTO = this.transformToProductDTO(productData, createdBy);
      console.log('Sending product data to backend:', productDTO);
      const response = await axiosClient.post('/marketplace/products', productDTO);
      return this.transformToAdminProductItem(response.data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(productId: string, productData: ProductFormData, createdBy: string): Promise<AdminProductItem> {
    try {
      const productRequest: ProductRequest = this.transformToProductRequest(productData, createdBy);
      const response = await axiosClient.put(`/marketplace/products/${productId}`, productRequest);
      return this.transformToAdminProductItem(response.data);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.delete(`/marketplace/products/${productId}`, {
        params: { userEmail }
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  /**
   * Toggle product featured status (Admin only)
   */
  async toggleProductFeatured(productId: string): Promise<void> {
    try {
      await axiosClient.patch(`/marketplace/products/${productId}/featured`);
    } catch (error) {
      console.error('Error toggling product featured status:', error);
      throw new Error('Failed to update product status');
    }
  }

  /**
   * Update product status
   */
  async updateProductStatus(productId: string, status: 'active' | 'sold' | 'pending' | 'removed'): Promise<void> {
    try {
      await axiosClient.patch(`/marketplace/products/${productId}/status`, { status });
    } catch (error) {
      console.error('Error updating product status:', error);
      throw new Error('Failed to update product status');
    }
  }

  // ==================== CATEGORY OPERATIONS ====================

  /**
   * Get all categories
   */
  async getCategories(): Promise<MarketplaceCategory[]> {
    try {
      const response = await axiosClient.get('/marketplace/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  // ==================== LOCATION OPERATIONS ====================

  /**
   * Get all locations
   */
  async getLocations(): Promise<MarketplaceLocation[]> {
    try {
      const response = await axiosClient.get('/marketplace/locations');
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw new Error('Failed to fetch locations');
    }
  }

  // ==================== SELLER OPERATIONS ====================

  /**
   * Get seller by ID
   */
  async getSellerById(sellerId: string): Promise<SellerApiResponse> {
    try {
      const response = await axiosClient.get(`/marketplace/sellers/${sellerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller:', error);
      throw new Error('Failed to fetch seller');
    }
  }

  /**
   * Get current seller profile
   */
  async getCurrentSellerProfile(userId: string): Promise<SellerApiResponse> {
    try {
      const response = await axiosClient.get(`/marketplace/sellers/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller profile:', error);
      throw new Error('Failed to fetch seller profile');
    }
  }

  /**
   * Create or update seller profile
   */
  async updateSellerProfile(sellerData: SellerFormData, createdBy: string): Promise<SellerApiResponse> {
    try {
      const sellerRequest: SellerRequest = this.transformToSellerRequest(sellerData, createdBy);
      const response = await axiosClient.post('/marketplace/sellers/profile', sellerRequest);
      return response.data;
    } catch (error) {
      console.error('Error updating seller profile:', error);
      throw new Error('Failed to update seller profile');
    }
  }

  /**
   * Get seller's products
   */
  async getSellerProducts(sellerId: string): Promise<UserProductItem[]> {
    try {
      const response = await axiosClient.get(`/marketplace/sellers/${sellerId}/products`);
      return response.data.map((product: ProductApiResponse) => 
        this.transformToUserProductItem(product)
      );
    } catch (error) {
      console.error('Error fetching seller products:', error);
      throw new Error('Failed to fetch seller products');
    }
  }

  // ==================== REVIEW OPERATIONS ====================

  /**
   * Get product reviews
   */
  async getProductReviews(productId: string): Promise<ProductReview[]> {
    try {
      const response = await axiosClient.get(`/marketplace/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw new Error('Failed to fetch reviews');
    }
  }

  /**
   * Add product review
   */
  async addProductReview(reviewData: ReviewFormData, createdBy: string): Promise<ProductReview> {
    try {
      const reviewRequest: ReviewRequest = this.transformToReviewRequest(reviewData, createdBy);
      const response = await axiosClient.post('/marketplace/reviews', reviewRequest);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw new Error('Failed to add review');
    }
  }

  /**
   * Update review
   */
  async updateReview(reviewId: string, reviewData: ReviewFormData, createdBy: string): Promise<ProductReview> {
    try {
      const reviewRequest: ReviewRequest = this.transformToReviewRequest(reviewData, createdBy);
      const response = await axiosClient.put(`/marketplace/reviews/${reviewId}`, reviewRequest);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw new Error('Failed to update review');
    }
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: string, userEmail: string): Promise<void> {
    try {
      await axiosClient.delete(`/marketplace/reviews/${reviewId}`, {
        params: { userEmail }
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error('Failed to delete review');
    }
  }

  /**
   * Mark review as helpful
   */
  async markReviewHelpful(reviewId: string): Promise<void> {
    try {
      await axiosClient.post(`/marketplace/reviews/${reviewId}/helpful`);
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw new Error('Failed to update review');
    }
  }

  // ==================== MESSAGE OPERATIONS ====================

  /**
   * Send message to seller
   */
  async sendMessage(messageData: MessageFormData, createdBy: string): Promise<ProductMessage> {
    try {
      const messageRequest: MessageRequest = this.transformToMessageRequest(messageData, createdBy);
      const response = await axiosClient.post('/marketplace/messages', messageRequest);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  /**
   * Get user's messages
   */
  async getUserMessages(userId: string): Promise<ProductMessage[]> {
    try {
      const response = await axiosClient.get(`/marketplace/messages/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await axiosClient.patch(`/marketplace/messages/${messageId}/read`);
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw new Error('Failed to update message');
    }
  }

  // ==================== FAVORITE OPERATIONS ====================

  /**
   * Add product to favorites
   */
  async addToFavorites(productId: string, userId: string): Promise<void> {
    try {
      await axiosClient.post('/marketplace/favorites', { productId, userId });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw new Error('Failed to add to favorites');
    }
  }

  /**
   * Remove product from favorites
   */
  async removeFromFavorites(productId: string, userId: string): Promise<void> {
    try {
      await axiosClient.delete('/marketplace/favorites', {
        params: { productId, userId }
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw new Error('Failed to remove from favorites');
    }
  }

  /**
   * Get user's favorite products
   */
  async getUserFavorites(userId: string): Promise<UserProductItem[]> {
    try {
      const response = await axiosClient.get(`/marketplace/favorites/${userId}`);
      return response.data.map((product: ProductApiResponse) => 
        this.transformToUserProductItem(product)
      );
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw new Error('Failed to fetch favorites');
    }
  }

  // ==================== REPORT OPERATIONS ====================

  /**
   * Report a product
   */
  async reportProduct(reportData: ReportFormData, createdBy: string): Promise<void> {
    try {
      await axiosClient.post('/marketplace/reports', {
        ...reportData,
        createdBy
      });
    } catch (error) {
      console.error('Error reporting product:', error);
      throw new Error('Failed to report product');
    }
  }

  // ==================== ANALYTICS ====================

  /**
   * Get marketplace analytics (Admin only)
   */
  async getMarketplaceAnalytics(): Promise<MarketplaceAnalytics> {
    try {
      const response = await axiosClient.get('/marketplace/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketplace analytics:', error);
      throw new Error('Failed to fetch analytics');
    }
  }

  // ==================== DATA TRANSFORMATION METHODS ====================

  /**
   * Transform API response to AdminProductItem
   */
  private transformToAdminProductItem(apiProduct: ProductApiResponse): AdminProductItem {
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

  /**
   * Transform API response to UserProductItem
   */
  private transformToUserProductItem(apiProduct: ProductApiResponse): UserProductItem {
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
      isLiked: false // This would be determined by checking user's favorites
    };
  }

  /**
   * Transform form data to API request format
   */
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

  /**
   * Transform form data to match backend ProductDTO expectations
   */
  private transformToProductDTO(formData: ProductFormData, createdBy: string): any {
    return {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      location: formData.location,
      condition: formData.condition || 'new',
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      specifications: formData.specifications ? this.parseSpecifications(formData.specifications) : {},
      shippingInfo: formData.shippingInfo || null,
      returnPolicy: formData.returnPolicy || null,
      negotiable: formData.negotiable || false,
      images: formData.images || [],
      createdBy: createdBy
    };
  }

  /**
   * Transform form data to API request format
   */
  private transformToSellerRequest(formData: SellerFormData, createdBy: string): SellerRequest {
    return {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      location: formData.location,
      description: formData.description || undefined,
      responseTime: formData.responseTime || undefined,
      languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0),
      socialLinks: this.parseSocialLinks(formData.socialLinks),
      createdBy: createdBy
    };
  }

  /**
   * Transform form data to API request format
   */
  private transformToReviewRequest(formData: ReviewFormData, createdBy: string): ReviewRequest {
    return {
      productId: formData.productId,
      rating: formData.rating,
      comment: formData.comment,
      images: formData.images,
      createdBy: createdBy
    };
  }

  /**
   * Transform form data to API request format
   */
  private transformToMessageRequest(formData: MessageFormData, createdBy: string): MessageRequest {
    return {
      productId: formData.productId,
      receiverId: formData.receiverId,
      message: formData.message,
      createdBy: createdBy
    };
  }

  /**
   * Transform AdminProductItem back to form data for editing
   */
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

  /**
   * Parse specifications from string
   */
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

  /**
   * Format specifications to string
   */
  private formatSpecifications(specs: Record<string, string>): string {
    return Object.entries(specs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  }

  /**
   * Parse social links from string
   */
  private parseSocialLinks(linksString: string): Record<string, string> {
    const links: Record<string, string> = {};
    if (!linksString) return links;
    
    linksString.split('\n').forEach(line => {
      const [platform, ...urlParts] = line.split(':');
      if (platform && urlParts.length > 0) {
        links[platform.trim()] = urlParts.join(':').trim();
      }
    });
    
    return links;
  }

  /**
   * Format time ago
   */
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

  /**
   * Format price for display
   */
  formatPrice(price: string): string {
    return price.startsWith('R') ? price : `R${price}`;
  }

  /**
   * Validate product form data
   */
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
    
    return null; // No errors
  }

  /**
   * Validate review form data
   */
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
    
    return null; // No errors
  }

  /**
   * Get condition color for display
   */
  getConditionColor(condition?: 'new' | 'used' | 'refurbished'): string {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-yellow-100 text-yellow-800';
      case 'refurbished': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get status color for display
   */
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

// Export as singleton instance
export const marketplaceService = new MarketplaceService();
export default marketplaceService;
