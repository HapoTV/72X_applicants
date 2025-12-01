// src/interfaces/MarketplaceData.ts

// ==================== PRODUCTS ====================
export interface MarketplaceProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  seller: string;
  sellerId?: string;
  location: string;
  category: string;
  rating: number;
  reviews: number;
  images: string[];
  featured?: boolean;
  inStock?: boolean;
  condition?: 'new' | 'used' | 'refurbished';
  tags?: string[];
  specifications?: Record<string, string>;
  shippingInfo?: string;
  returnPolicy?: string;
  negotiable?: boolean;
  views?: number;
  likes?: number;
  shares?: number;
  status: 'active' | 'sold' | 'pending' | 'removed';
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  condition: 'new' | 'used' | 'refurbished';
  tags: string;
  specifications: string;
  shippingInfo: string;
  returnPolicy: string;
  negotiable: boolean;
  images: string[];
}

export interface AdminProductItem {
  id: string;
  title: string;
  description: string;
  price: string;
  seller: string;
  sellerId?: string;
  location: string;
  category: string;
  rating: number;
  reviews: number;
  images: string[];
  featured: boolean;
  inStock: boolean;
  condition?: 'new' | 'used' | 'refurbished';
  tags?: string[];
  specifications?: Record<string, string>;
  shippingInfo?: string;
  returnPolicy?: string;
  negotiable?: boolean;
  views?: number;
  likes?: number;
  shares?: number;
  status: 'active' | 'sold' | 'pending' | 'removed';
  createdAt?: string;
  createdBy: string;
}

export interface UserProductItem {
  id: string;
  title: string;
  description: string;
  price: string;
  seller: string;
  location: string;
  category: string;
  categoryName?: string;
  rating: number;
  reviews: number;
  images: string[];
  featured: boolean;
  inStock: boolean;
  condition?: 'new' | 'used' | 'refurbished';
  negotiable?: boolean;
  status: 'active' | 'sold' | 'pending' | 'removed';
  timeAgo?: string;
  isLiked?: boolean;
}

// ==================== CATEGORIES ====================
export interface MarketplaceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  productCount?: number;
  subcategories?: MarketplaceSubcategory[];
}

export interface MarketplaceSubcategory {
  id: string;
  name: string;
  categoryId: string;
  productCount?: number;
}

// ==================== LOCATIONS ====================
export interface MarketplaceLocation {
  id: string;
  name: string;
  province?: string;
  coordinates?: { lat: number; lng: number };
  isActive?: boolean;
  productCount?: number;
}

// ==================== SELLERS ====================
export interface MarketplaceSeller {
  sellerId: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
  description?: string;
  avatar?: string;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  activeProducts: number;
  soldProducts: number;
  memberSince?: string;
  responseTime?: string;
  languages?: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  socialLinks?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SellerFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  responseTime: string;
  languages: string;
  socialLinks: string;
}

// ==================== REVIEWS ====================
export interface ProductReview {
  reviewId: string;
  productId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewFormData {
  productId: string;
  rating: number;
  comment: string;
  images: string[];
}

// ==================== MESSAGES ====================
export interface ProductMessage {
  messageId: string;
  productId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface MessageFormData {
  productId: string;
  receiverId: string;
  message: string;
}

// ==================== API RESPONSES ====================
export interface ProductApiResponse {
  productId: string;
  title: string;
  description: string;
  price: string;
  seller: string;
  sellerId?: string;
  location: string;
  category: string;
  rating: number;
  reviews: number;
  images: string[];
  featured?: boolean;
  inStock?: boolean;
  condition?: 'new' | 'used' | 'refurbished';
  tags?: string[];
  specifications?: Record<string, string>;
  shippingInfo?: string;
  returnPolicy?: string;
  negotiable?: boolean;
  views?: number;
  likes?: number;
  shares?: number;
  status: 'active' | 'sold' | 'pending' | 'removed';
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
}

export interface SellerApiResponse {
  sellerId: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
  description?: string;
  avatar?: string;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  activeProducts: number;
  soldProducts: number;
  memberSince?: string;
  responseTime?: string;
  languages?: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  socialLinks?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewApiResponse {
  reviewId: string;
  productId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== REQUEST PAYLOADS ====================
export interface ProductRequest {
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  condition?: 'new' | 'used' | 'refurbished';
  tags?: string[];
  specifications?: Record<string, string>;
  shippingInfo?: string;
  returnPolicy?: string;
  negotiable?: boolean;
  images: string[];
  createdBy: string;
}

export interface SellerRequest {
  name: string;
  email?: string;
  phone?: string;
  location: string;
  description?: string;
  responseTime?: string;
  languages?: string[];
  socialLinks?: Record<string, string>;
  createdBy: string;
}

export interface ReviewRequest {
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdBy: string;
}

export interface MessageRequest {
  productId: string;
  receiverId: string;
  message: string;
  createdBy: string;
}

// ==================== ANALYTICS ====================
export interface MarketplaceAnalytics {
  totalProducts: number;
  activeProducts: number;
  soldProducts: number;
  totalSellers: number;
  verifiedSellers: number;
  totalReviews: number;
  averageRating: number;
  categoryDistribution: Array<{ category: string; count: number }>;
  locationDistribution: Array<{ location: string; count: number }>;
  priceRanges: Array<{ range: string; count: number }>;
  topSellers: Array<{ seller: string; products: number; rating: number }>;
  featuredProducts: number;
  pendingProducts: number;
}

// ==================== SEARCH & FILTERS ====================
export interface ProductSearchParams {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: 'new' | 'used' | 'refurbished';
  rating?: number;
  featured?: boolean;
  inStock?: boolean;
  negotiable?: boolean;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface ProductSearchResponse {
  products: UserProductItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// ==================== FAVORITES ====================
export interface ProductFavorite {
  favoriteId: string;
  productId: string;
  userId: string;
  createdAt?: string;
}

// ==================== REPORTS ====================
export interface ProductReport {
  reportId: string;
  productId: string;
  reporterId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt?: string;
  updatedAt?: string;
}

export interface ReportFormData {
  productId: string;
  reason: string;
  description: string;
}
