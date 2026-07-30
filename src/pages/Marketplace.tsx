import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Tag } from 'lucide-react';
import Spinner from '../components/Spinner';
import { marketplaceService } from '../services/MarketplaceService';
import { useAuth } from '../context/AuthContext';
import type { UserProductItem, MarketplaceCategory, MarketplaceLocation } from '../interfaces/MarketplaceData';
import {
  getPrimaryProductImage,
  DEFAULT_CATEGORIES,
  DEFAULT_LOCATIONS,
  readFeaturedCache,
  writeFeaturedCache,
  removeFromFeaturedCache
} from './marketplaceHelpers';
import ProductCard from './components/ProductCard';
import ProductFormModal from './components/ProductFormModal';
import ProductPreviewModal from './components/ProductPreviewModal';
import MarketplaceFilters from './components/MarketplaceFilters';
import type { ProductFormData } from './components/ProductFormModal';

const Marketplace: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const isFreeTrialUser = localStorage.getItem('userStatus') === 'FREE_TRIAL';
  const currentUserId = String((user as any)?.id || (user as any)?.userId || '');
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

  const openProductPreview = async (product: UserProductItem) => {
    try {
      setShowProductPreview(true);
      setPreviewError(null);
      setPreviewLoading(true);
      setActivePreviewImageIndex(0);

      const details = await marketplaceService.getProductById(product.id);
      setPreviewProduct(details);
    } catch {
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

    if (currentUserId && String(sellerId) === currentUserId) {
      alert("You can't contact yourself about your own product.");
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
  const [newProduct, setNewProduct] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    businessName: '',
    category: 'food',
    location: 'soweto',
    condition: 'new' as 'new' | 'used',
    negotiable: false
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [myProducts, setMyProducts] = useState<UserProductItem[]>([]);
  const [myProductsLoading, setMyProductsLoading] = useState(false);
  const [myProductsError, setMyProductsError] = useState<string | null>(null);
  const [myStatusFilter, setMyStatusFilter] = useState<'available' | 'sold' | 'all'>('available');
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<UserProductItem | null>(null);
  const [editProduct, setEditProduct] = useState<ProductFormData>({
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

  const isOwnPreviewProduct = Boolean(currentUserId) && String(previewProduct?.sellerId || '') === currentUserId;

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

    if (isFreeTrialUser) {
      alert('Users on Free Trial cannot list products. Please subscribe to a plan to continue.');
      navigate('/select-package');
      return;
    }
    
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
        negotiable: false
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
    void fetchMarketplaceData();
  }, [activeView, featuredSearchTerm, featuredSelectedCategory, featuredSelectedLocation, token, storageAuthToken, fetchMarketplaceData]);

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
    void fetchMyProducts();
  }, [fetchMyProducts, user]);

  const fetchMyProducts = useCallback(async () => {
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
  }, [user]);

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
        removeFromFeaturedCache(productId);
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

  const fetchMarketplaceData = useCallback(async () => {
    const authToken = token || storageAuthToken || localStorage.getItem('authToken');
    if (!authToken) {
      setProducts([]);
      setLoading(false);
      return;
    }

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
      } catch {
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
      } catch {
        console.log('Categories/Locations API not available, using fallback data');
        // Fallback data when backend is not available
        setCategories(DEFAULT_CATEGORIES);
        setLocations(DEFAULT_LOCATIONS);
      }
    } catch (err) {
      console.error('Error fetching marketplace data:', err);
      setError('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  }, [activeView, featuredSearchTerm, featuredSelectedCategory, featuredSelectedLocation, storageAuthToken, token]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" color="primary" />
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
            <div className="relative group">
              <button
                onClick={isFreeTrialUser ? undefined : () => setShowAddProduct(true)}
                disabled={isFreeTrialUser}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium shadow-sm ${
                  isFreeTrialUser
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>List Product</span>
              </button>
              {isFreeTrialUser && (
                <div className="pointer-events-none absolute -top-10 right-0 hidden group-hover:block">
                  <div className="max-w-xs rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg">
                    Users on Free Trial cannot list products. Subscribe to a plan to continue.
                  </div>
                </div>
              )}
            </div>
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
            <MarketplaceFilters
              searchTerm={mySearchTerm}
              selectedCategory={mySelectedCategory}
              selectedLocation={mySelectedLocation}
              categories={categories}
              locations={locations}
              statusFilter={myStatusFilter}
              onSearchChange={setMySearchTerm}
              onCategoryChange={setMySelectedCategory}
              onLocationChange={setMySelectedLocation}
              onStatusChange={setMyStatusFilter}
              showStatusFilter={true}
            />
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
                <ProductCard
                  key={p.id}
                  product={p}
                  variant="my"
                  onEdit={openEditModal}
                  onDelete={handleDeleteMyProduct}
                  onToggleStatus={handleToggleMyProductStatus}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <MarketplaceFilters
              searchTerm={featuredSearchTerm}
              selectedCategory={featuredSelectedCategory}
              selectedLocation={featuredSelectedLocation}
              categories={categories}
              locations={locations}
              onSearchChange={setFeaturedSearchTerm}
              onCategoryChange={setFeaturedSelectedCategory}
              onLocationChange={setFeaturedSelectedLocation}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Featured Products {featuredProducts.length > 0 && `(${featuredProducts.length})`}
            </h2>
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="featured"
                    onPreview={openProductPreview}
                  />
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
      <ProductPreviewModal
        isOpen={showProductPreview}
        previewProduct={previewProduct}
        previewLoading={previewLoading}
        previewError={previewError}
        activePreviewImageIndex={activePreviewImageIndex}
        isFreeTrialUser={isFreeTrialUser}
        isOwnPreviewProduct={isOwnPreviewProduct}
        onClose={closeProductPreview}
        onContactSeller={handleContactSellerFromPreview}
        onImageIndexChange={setActivePreviewImageIndex}
      />

      {/* Add Product Modal */}
      <ProductFormModal
        isOpen={showAddProduct}
        mode="add"
        formData={newProduct}
        uploadedImage={uploadedImage}
        categories={categories}
        locations={locations}
        loading={loading}
        onClose={() => setShowAddProduct(false)}
        onFormChange={(field, value) => setNewProduct(prev => ({ ...prev, [field]: value }))}
        onImageUpload={handleImageUpload}
        onImageRemove={() => setUploadedImage(null)}
        onSubmit={handleListProduct}
      />

      {/* Edit Product Modal */}
      <ProductFormModal
        isOpen={showEditProduct}
        mode="edit"
        formData={editProduct}
        uploadedImage={editUploadedImage}
        categories={categories}
        locations={locations}
        loading={loading}
        onClose={() => {
          setShowEditProduct(false);
          setEditingProduct(null);
        }}
        onFormChange={(field, value) => setEditProduct(prev => ({ ...prev, [field]: value }))}
        onImageUpload={handleEditImageUpload}
        onImageRemove={() => setEditUploadedImage(null)}
        onSubmit={handleUpdateProduct}
      />
    </div>
  );
};

export default Marketplace;
