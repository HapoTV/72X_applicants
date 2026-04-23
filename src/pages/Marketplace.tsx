import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Plus, Camera, Tag } from 'lucide-react';
import { marketplaceService } from '../services/MarketplaceService';
import { useAuth } from '../context/AuthContext';
import type { UserProductItem, MarketplaceCategory, MarketplaceLocation } from '../interfaces/MarketplaceData';

const Marketplace: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const isFreeTrialUser = localStorage.getItem('userStatus') === 'FREE_TRIAL';
  const [activeView, setActiveView] = useState<'featured' | 'my'>('featured');
  const [storageAuthToken, setStorageAuthToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [featuredSearchTerm, setFeaturedSearchTerm] = useState('');
  const [featuredSelectedCategory, setFeaturedSelectedCategory] = useState('all');
  const [featuredSelectedLocation, setFeaturedSelectedLocation] = useState('all');
  const [mySearchTerm, setMySearchTerm] = useState('');
  const [mySelectedCategory, setMySelectedCategory] = useState('all');
  const [mySelectedLocation, setMySelectedLocation] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPrimaryProductImage = (product: UserProductItem): string | null => {
    if (!product.images || product.images.length === 0) return null;
    const first = product.images[0];
    if (typeof first !== 'string') return null;
    const trimmed = first.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const normalizePreviewImages = (raw: any): string[] => {
    if (Array.isArray(raw)) {
      return raw
        .filter((x) => typeof x === 'string')
        .map((x) => x.trim())
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
              .map((x) => x.trim())
              .filter((x) => x.length > 0);
          }
        } catch {
          return [trimmed];
        }
      }

      return [trimmed];
    }

    return [];
  };

  const toTitleCase = (value: unknown): string => {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  const formatPrice = (value: unknown): string => {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (/^r\b/i.test(trimmed)) return trimmed;
    return `R ${trimmed}`;
  };

  const formatConditionLabel = (value: unknown): string => {
    if (typeof value !== 'string') return '';
    const v = value.trim().toLowerCase();
    if (!v) return '';
    if (v === 'new') return 'New';
    if (v === 'used') return 'Pre-owned';
    return toTitleCase(v);
  };

  const canEditProduct = (product: UserProductItem): boolean => {
    const createdAt = product.createdAt;
    if (!createdAt) return true;

    const createdMs = new Date(createdAt).getTime();
    if (Number.isNaN(createdMs)) return true;

    const deadlineMs = createdMs + 3 * 60 * 60 * 1000;
    return Date.now() <= deadlineMs;
  };

  const openProductPreview = async (product: UserProductItem) => {
    try {
      setShowProductPreview(true);
      setPreviewError(null);
      setPreviewLoading(true);
      setActivePreviewImageIndex(0);

      const details = await marketplaceService.getProductById(product.id);
      setPreviewProduct(details);
    } catch (e: any) {
      setPreviewProduct(product as any);
      setPreviewError('Could not load full product details. Showing a basic preview.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const closeProductPreview = () => {
    setShowProductPreview(false);
    setPreviewProduct(null);
    setPreviewError(null);
    setPreviewLoading(false);
    setActivePreviewImageIndex(0);
  };

  const handleContactSellerFromPreview = () => {
    const sellerId = previewProduct?.sellerId;
    if (!sellerId) {
      alert('Seller information is not available for this product.');
      return;
    }

    const title = typeof previewProduct?.title === 'string' ? previewProduct.title : 'this product';
    const message = `Hello, I would like to purchase the product: ${title}.`;
    const params = new URLSearchParams();
    params.set('userId', String(sellerId));
    params.set('message', message);
    params.set('autoSend', '1');
    navigate(`/connections?${params.toString()}`);
    closeProductPreview();
  };

  // Form state for new product
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    businessName: '',
    category: 'food',
    location: 'soweto',
    condition: 'new' as 'new' | 'used',
    negotiable: false,
    image: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [myProducts, setMyProducts] = useState<UserProductItem[]>([]);
  const [myProductsLoading, setMyProductsLoading] = useState(false);
  const [myProductsError, setMyProductsError] = useState<string | null>(null);
  const [myStatusFilter, setMyStatusFilter] = useState<'available' | 'sold' | 'all'>('available');
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<UserProductItem | null>(null);
  const [editProduct, setEditProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: 'food',
    location: 'soweto',
    condition: 'new' as 'new' | 'used',
    negotiable: false
  });
  const [editUploadedImage, setEditUploadedImage] = useState<string | null>(null);

  const [products, setProducts] = useState<UserProductItem[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [locations, setLocations] = useState<MarketplaceLocation[]>([]);

  const [showProductPreview, setShowProductPreview] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<any | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [activePreviewImageIndex, setActivePreviewImageIndex] = useState(0);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleListProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.email) {
      alert('Please login to list a product');
      return;
    }
    
    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.businessName) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare form data
      const productData: any = {
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        location: newProduct.location,
        condition: newProduct.condition,
        tags: '',
        specifications: '',
        shippingInfo: '',
        returnPolicy: '',
        negotiable: Boolean(newProduct.negotiable),
        images: uploadedImage ? [uploadedImage] : []
      };
      
      // Validate product data
      if (!productData.title || !productData.description || !productData.price) {
        throw new Error('Product title, description, and price are required');
      }
      
      if (!productData.category || !productData.location) {
        throw new Error('Product category and location are required');
      }
      
      console.log('Sending product data to backend:', productData);
      
      // Create product via service
      await marketplaceService.createProduct(productData, user.email, newProduct.businessName);
      
      // Refresh products list
      await fetchMarketplaceData();
      
      // Reset form
      setNewProduct({
        title: '',
        description: '',
        price: '',
        businessName: '',
        category: 'food',
        location: 'soweto',
        condition: 'new' as 'new' | 'used',
        negotiable: false,
        image: ''
      });
      setUploadedImage(null);
      setShowAddProduct(false);
      
      alert('Product listed successfully!');
    } catch (error) {
      console.error('Error listing product:', error);
      alert('Failed to list product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    if (activeView !== 'featured') return;
    fetchMarketplaceData();
  }, [activeView, featuredSearchTerm, featuredSelectedCategory, featuredSelectedLocation, token, storageAuthToken]);

  useEffect(() => {
    if (activeView !== 'featured') return;
    setFeaturedSearchTerm('');
    setFeaturedSelectedCategory('all');
    setFeaturedSelectedLocation('all');
  }, [activeView]);

  useEffect(() => {
    const sync = () => setStorageAuthToken(localStorage.getItem('authToken'));
    const interval = window.setInterval(sync, 500);
    window.addEventListener('storage', sync);
    sync();
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchMyProducts();
  }, [user]);

  const fetchMyProducts = async () => {
    if (!user) return;
    try {
      setMyProductsLoading(true);
      setMyProductsError(null);
      const sellerProducts = await marketplaceService.getSellerProducts();
      setMyProducts(sellerProducts);
    } catch (e: any) {
      setMyProductsError(e?.message || 'Failed to fetch my products');
      setMyProducts([]);
    } finally {
      setMyProductsLoading(false);
    }
  };

  const openEditModal = (product: UserProductItem) => {
    setEditingProduct(product);
    setEditProduct({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'food',
      location: product.location || 'soweto',
      condition: (product.condition as any) || 'new',
      negotiable: Boolean((product as any).negotiable)
    });
    setEditUploadedImage(getPrimaryProductImage(product));
    setShowEditProduct(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !editingProduct) return;

    try {
      setLoading(true);
      await marketplaceService.updateProduct(
        editingProduct.id,
        {
          title: editProduct.title,
          description: editProduct.description,
          price: editProduct.price,
          category: editProduct.category,
          location: editProduct.location,
          condition: editProduct.condition,
          tags: '',
          specifications: '',
          shippingInfo: '',
          returnPolicy: '',
          negotiable: Boolean(editProduct.negotiable),
          images: editUploadedImage ? [editUploadedImage] : []
        },
        user.email
      );

      setShowEditProduct(false);
      setEditingProduct(null);
      await fetchMarketplaceData();
      await fetchMyProducts();
      alert('Product updated successfully!');
    } catch (err: any) {
      console.error('Error updating product:', err);
      alert(err?.message || 'Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMyProduct = async (productId: string) => {
    const confirmed = window.confirm('Delete this product? This will remove it for all users.');
    if (!confirmed) return;

    try {
      setLoading(true);
      await marketplaceService.deleteProduct(productId);

      setMyProducts((prev) => prev.filter((p) => p.id !== productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));

      try {
        const featuredCacheKey = 'marketplace_featured_cache_v1';
        const raw = localStorage.getItem(featuredCacheKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            localStorage.setItem(
              featuredCacheKey,
              JSON.stringify(parsed.filter((p: any) => (p?.id || p?.productId) !== productId))
            );
          }
        }
      } catch {
        // ignore
      }

      await fetchMarketplaceData();
      await fetchMyProducts();
      alert('Product deleted successfully');
    } catch (err: any) {
      console.error('Error deleting product:', err);
      const messageFromBackend =
        typeof err?.response?.data === 'string'
          ? err.response.data
          : typeof err?.response?.data?.message === 'string'
            ? err.response.data.message
            : undefined;
      alert(messageFromBackend || err?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMyProductStatus = async (product: UserProductItem) => {
    try {
      setLoading(true);
      const nextStatus = product.status === 'sold' ? 'active' : 'sold';
      await marketplaceService.updateProductStatus(product.id, nextStatus);
      await fetchMarketplaceData();
      await fetchMyProducts();
    } catch (err) {
      console.error('Error updating product status:', err);
      alert('Failed to update product status');
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketplaceData = async () => {
    const authToken = token || storageAuthToken || localStorage.getItem('authToken');
    if (!authToken) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const featuredCacheKey = 'marketplace_featured_cache_v1';

    const readFeaturedCache = (): UserProductItem[] | null => {
      try {
        const raw = localStorage.getItem(featuredCacheKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as UserProductItem[]) : null;
      } catch {
        return null;
      }
    };

    const writeFeaturedCache = (items: UserProductItem[]) => {
      try {
        const safeItems = Array.isArray(items) ? items.filter((p) => p?.status !== 'sold') : [];
        localStorage.setItem(featuredCacheKey, JSON.stringify(safeItems));
      } catch {
        // ignore
      }
    };

    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch products with filters
      try {
        if (activeView === 'featured') {
          const featured = await marketplaceService.getFeaturedProducts();
          const featuredActive = Array.isArray(featured) ? featured.filter((p) => p?.status !== 'sold') : [];
          if (featuredActive.length > 0) {
            setProducts(featuredActive);
            writeFeaturedCache(featuredActive);
          } else {
            const productsResponse = await marketplaceService.getActiveProducts({});
            const derived = productsResponse.products
              .filter((p) => p?.status !== 'sold')
              .filter((p) => Boolean((p as any).featured));
            if (derived.length > 0) {
              setProducts(derived);
              writeFeaturedCache(derived);
            } else {
              const cached = readFeaturedCache();
              const cachedSafe = Array.isArray(cached) ? cached.filter((p) => p?.status !== 'sold') : [];
              setProducts(cachedSafe);
            }
          }
        } else {
          const searchParams: any = {};
          if (featuredSearchTerm) searchParams.query = featuredSearchTerm;
          if (featuredSelectedCategory !== 'all') searchParams.category = featuredSelectedCategory;
          if (featuredSelectedLocation !== 'all') searchParams.location = featuredSelectedLocation;
          
          const productsResponse = await marketplaceService.getActiveProducts(searchParams);
          setProducts(productsResponse.products.filter((p) => p?.status !== 'sold'));
        }
      } catch (apiError) {
        try {
          if (activeView === 'featured') {
            const featured = await marketplaceService.getFeaturedProducts();
            const featuredActive = Array.isArray(featured) ? featured.filter((p) => p?.status !== 'sold') : [];
            if (featuredActive.length > 0) {
              setProducts(featuredActive);
              writeFeaturedCache(featuredActive);
            } else {
              const productsResponse = await marketplaceService.getActiveProducts({});
              const derived = productsResponse.products
                .filter((p) => p?.status !== 'sold')
                .filter((p) => Boolean((p as any).featured));
              if (derived.length > 0) {
                setProducts(derived);
                writeFeaturedCache(derived);
              } else {
                const cached = readFeaturedCache();
                const cachedSafe = Array.isArray(cached) ? cached.filter((p) => p?.status !== 'sold') : [];
                setProducts(cachedSafe);
              }
            }
          } else {
            const searchParams: any = {};
            if (featuredSearchTerm) searchParams.query = featuredSearchTerm;
            if (featuredSelectedCategory !== 'all') searchParams.category = featuredSelectedCategory;
            if (featuredSelectedLocation !== 'all') searchParams.location = featuredSelectedLocation;

            const productsResponse = await marketplaceService.getActiveProducts(searchParams);
            setProducts(productsResponse.products.filter((p) => p?.status !== 'sold'));
          }
        } catch (apiError2) {
          console.error('Marketplace API error:', apiError2);
          setError('Failed to load marketplace products');
          setProducts([]);
        }
      }
      
      // Fetch categories and locations (with fallback)
      try {
        const [categoriesData, locationsData] = await Promise.all([
          marketplaceService.getCategories(),
          marketplaceService.getLocations()
        ]);
        
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (fallbackError) {
        console.log('Categories/Locations API not available, using fallback data');
        // Fallback data when backend is not available
        setCategories([
          { id: 'all', name: 'All Categories' },
          { id: 'food', name: 'Food & Beverages' },
          { id: 'crafts', name: 'Arts & Crafts' },
          { id: 'clothing', name: 'Clothing & Fashion' },
          { id: 'services', name: 'Services' },
          { id: 'agriculture', name: 'Agriculture' },
          { id: 'beauty', name: 'Beauty & Personal Care' },
          { id: 'electronics', name: 'Electronics & Repairs' },
          { id: 'home', name: 'Home & Garden' },
          { id: 'other', name: 'Other' }
        ]);
        
        setLocations([
          { id: 'all', name: 'All Locations' },
          { id: 'soweto', name: 'Soweto' },
          { id: 'alexandra', name: 'Alexandra' },
          { id: 'khayelitsha', name: 'Khayelitsha' },
          { id: 'mitchells-plain', name: 'Mitchells Plain' },
          { id: 'mamelodi', name: 'Mamelodi' },
          { id: 'umlazi', name: 'Umlazi' },
          { id: 'mdantsane', name: 'Mdantsane' },
          { id: 'other', name: 'Other' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching marketplace data:', err);
      setError('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(featuredSearchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(featuredSearchTerm.toLowerCase());
    const matchesCategory = featuredSelectedCategory === 'all' || product.category === featuredSelectedCategory;
    const matchesLocation = featuredSelectedLocation === 'all' || product.location.toLowerCase().includes(featuredSelectedLocation.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const featuredProducts = activeView === 'featured'
    ? filteredProducts
    : filteredProducts.filter(product => product.featured);

  const filteredMyProducts = myProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(mySearchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(mySearchTerm.toLowerCase());
    const matchesCategory = mySelectedCategory === 'all' || product.category === mySelectedCategory;
    const matchesLocation = mySelectedLocation === 'all' || product.location.toLowerCase().includes(mySelectedLocation.toLowerCase());
    const matchesStatus =
      myStatusFilter === 'all'
        ? true
        : myStatusFilter === 'sold'
          ? product.status === 'sold'
          : product.status !== 'sold';
    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Marketplace</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchMarketplaceData();
            }}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Community Marketplace</h1>
          <p className="text-gray-600 text-sm">Discover and support local businesses in your community</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            {user && (
              <button
                onClick={() => setActiveView('my')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeView === 'my'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Products
              </button>
            )}
            <button
              onClick={() => setActiveView('featured')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeView === 'featured'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Featured
            </button>
          </div>

          {user && (
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1.5 text-xs font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>List Product</span>
            </button>
          )}
        </div>
      </div>

      {activeView === 'my' && user ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">My Products</h2>
            <button
              onClick={fetchMyProducts}
              disabled={myProductsLoading}
              className="text-sm text-primary-600 hover:underline disabled:text-gray-400"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search my products..."
                value={mySearchTerm}
                onChange={(e) => setMySearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <select
                value={mySelectedCategory}
                onChange={(e) => setMySelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              <select
                value={mySelectedLocation}
                onChange={(e) => setMySelectedLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>

              <select
                value={myStatusFilter}
                onChange={(e) => setMyStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="available">Available</option>
                <option value="sold">Sold/History</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>

          {myProductsError && (
            <div className="text-sm text-red-600 mb-3">{myProductsError}</div>
          )}

          {myProductsLoading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : filteredMyProducts.length === 0 ? (
            <div className="text-sm text-gray-600">You haven’t listed any products yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMyProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="relative">
                    {getPrimaryProductImage(p) ? (
                      <img
                        src={getPrimaryProductImage(p) ?? undefined}
                        alt={p.title}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center px-3 text-center">
                        <span className="text-xs text-gray-500">No product picture uploaded</span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          p.status === 'sold'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {p.status === 'sold' ? 'Sold' : 'Available'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-1">{p.title}</h3>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-primary-600 text-sm">{formatPrice(p.price)}</span>
                      <span className="text-xs text-gray-500">{p.timeAgo}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative group">
                        <button
                          onClick={() => openEditModal(p)}
                          disabled={!canEditProduct(p)}
                          className={`w-full py-1.5 bg-white border rounded-lg transition-colors text-xs ${
                            canEditProduct(p)
                              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              : 'border-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Edit
                        </button>
                        {!canEditProduct(p) && (
                          <div className="pointer-events-none absolute -top-10 left-0 hidden group-hover:block">
                            <div className="max-w-xs rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg">
                              Edit time expired. You cannot edit a product after 3 hours.
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteMyProduct(p.id)}
                        className="py-1.5 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-xs"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleToggleMyProductStatus(p)}
                        className="col-span-2 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-xs"
                      >
                        {p.status === 'sold' ? 'Mark Available' : 'Mark Sold'}
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search featured products..."
                  value={featuredSearchTerm}
                  onChange={(e) => setFeaturedSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={featuredSelectedCategory}
                  onChange={(e) => setFeaturedSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>

                <select
                  value={featuredSelectedLocation}
                  onChange={(e) => setFeaturedSelectedLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Featured Products {featuredProducts.length > 0 && `(${featuredProducts.length})`}
            </h2>
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      {getPrimaryProductImage(product) ? (
                        <img
                          src={getPrimaryProductImage(product) ?? undefined}
                          alt={product.title}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center px-4 text-center">
                          <span className="text-sm text-gray-500">No product picture uploaded</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">{product.title}</h3>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-primary-600">{formatPrice(product.price)}</span>
                        <span className="text-xs text-gray-500">{product.timeAgo}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{product.seller}</span>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{toTitleCase(product.location)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => openProductPreview(product)}
                        className="w-full py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-xs"
                      >
                        Preview Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Featured Products Available</h3>
                <p className="text-gray-600">
                  {filteredProducts.length > 0
                    ? 'No products are marked as featured for the current filters.'
                    : 'Try adjusting your search or filters.'}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Product Preview Modal */}
      {showProductPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={closeProductPreview}
        >
          <div
            className="bg-white rounded-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-900">Product Preview</div>
              <button onClick={closeProductPreview} className="p-1 hover:bg-gray-100 rounded">×</button>
            </div>

            <div className="p-4">
              {previewLoading ? (
                <div className="text-sm text-gray-600">Loading...</div>
              ) : previewError ? (
                <div className="text-sm text-red-600">{previewError}</div>
              ) : previewProduct ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      {normalizePreviewImages(previewProduct.images).length > 0 ? (
                        <div className="space-y-2">
                          <img
                            src={normalizePreviewImages(previewProduct.images)[
                              Math.min(activePreviewImageIndex, normalizePreviewImages(previewProduct.images).length - 1)
                            ]}
                            alt={previewProduct.title}
                            className="w-full h-64 object-cover rounded-lg border border-gray-100"
                          />

                          {normalizePreviewImages(previewProduct.images).length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                              {normalizePreviewImages(previewProduct.images).map((img: string, idx: number) => (
                                <button
                                  key={`${img}-${idx}`}
                                  onClick={() => setActivePreviewImageIndex(idx)}
                                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border ${
                                    idx === activePreviewImageIndex ? 'border-primary-500' : 'border-gray-200'
                                  }`}
                                >
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-64 bg-gray-100 flex items-center justify-center px-4 text-center rounded-lg">
                          <span className="text-sm text-gray-500">No product picture uploaded</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-xl font-bold text-gray-900">{previewProduct.title}</div>
                      <div className="text-lg font-semibold text-primary-600">{formatPrice(previewProduct.price)}</div>
                      <div className="text-sm text-gray-600">{previewProduct.description}</div>

                      <div className="pt-2 space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Seller</span>
                          <span className="text-gray-900">{previewProduct.seller}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Category</span>
                          <span className="text-gray-900">{toTitleCase(previewProduct.category)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Location</span>
                          <span className="text-gray-900">{toTitleCase(previewProduct.location)}</span>
                        </div>
                        {previewProduct.condition && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Condition</span>
                            <span className="text-gray-900">{formatConditionLabel(previewProduct.condition)}</span>
                          </div>
                        )}
                        {typeof previewProduct.negotiable === 'boolean' && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Negotiable</span>
                            <span className="text-gray-900">{previewProduct.negotiable ? 'Yes' : 'No'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={closeProductPreview}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Close
                    </button>
                    <div className="relative group">
                      <button
                        onClick={isFreeTrialUser ? undefined : handleContactSellerFromPreview}
                        disabled={isFreeTrialUser}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                          isFreeTrialUser
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-500 text-white hover:bg-primary-600'
                        }`}
                      >
                        Contact Seller
                      </button>
                      {isFreeTrialUser && (
                        <div className="pointer-events-none absolute -top-10 right-0 hidden group-hover:block">
                          <div className="max-w-xs rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg">
                            Users on Free Trial cannot contact sellers. Subscribe to access messaging.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">List Your Product</h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleListProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={newProduct.businessName}
                  onChange={(e) => setNewProduct({...newProduct, businessName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Enter your business name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Describe your product"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="R 0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select 
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={newProduct.condition}
                    onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value as 'new' | 'used' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="new">New</option>
                    <option value="used">Pre-owned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Negotiable</label>
                  <select
                    value={newProduct.negotiable ? 'yes' : 'no'}
                    onChange={(e) => setNewProduct({ ...newProduct, negotiable: e.target.value === 'yes' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                  {uploadedImage ? (
                    <div className="relative">
                      <img 
                        src={uploadedImage} 
                        alt="Product preview" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload photos</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  List Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProduct && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
              <button
                onClick={() => {
                  setShowEditProduct(false);
                  setEditingProduct(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editProduct.title}
                  onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editProduct.category}
                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={editProduct.location}
                  onChange={(e) => setEditProduct({ ...editProduct, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={editProduct.condition}
                    onChange={(e) => setEditProduct({ ...editProduct, condition: e.target.value as 'new' | 'used' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="new">New</option>
                    <option value="used">Pre-owned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Negotiable</label>
                  <select
                    value={editProduct.negotiable ? 'yes' : 'no'}
                    onChange={(e) => setEditProduct({ ...editProduct, negotiable: e.target.value === 'yes' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                  {editUploadedImage ? (
                    <div className="relative">
                      <img
                        src={editUploadedImage}
                        alt="Product preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setEditUploadedImage(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload photo</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProduct(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
