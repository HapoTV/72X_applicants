import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Heart, Share2, Plus, Camera, Tag } from 'lucide-react';
import { marketplaceService } from '../services/MarketplaceService';
import { useAuth } from '../context/AuthContext';
import type { UserProductItem, MarketplaceCategory, MarketplaceLocation } from '../interfaces/MarketplaceData';

const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for new product
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    businessName: '',
    category: 'food',
    location: 'soweto',
    image: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [products, setProducts] = useState<UserProductItem[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [locations, setLocations] = useState<MarketplaceLocation[]>([]);

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
        condition: 'new' as const,
        tags: '',
        specifications: '',
        shippingInfo: '',
        returnPolicy: '',
        negotiable: false,
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
    fetchMarketplaceData();
  }, [searchTerm, selectedCategory, selectedLocation]);

  const fetchMarketplaceData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch products with filters
      try {
        const searchParams: any = {};
        if (searchTerm) searchParams.query = searchTerm;
        if (selectedCategory !== 'all') searchParams.category = selectedCategory;
        if (selectedLocation !== 'all') searchParams.location = selectedLocation;
        
        const productsResponse = await marketplaceService.getActiveProducts(searchParams);
        setProducts(productsResponse.products);
      } catch (apiError) {
        console.log('Backend API not available, using fallback data');
        // Fallback to empty state when backend is not available
        setProducts([]);
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
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || product.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const featuredProducts = products.filter(product => product.featured);

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
        
        {user && (
          <button
            onClick={() => setShowAddProduct(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>List Product</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products and services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={product.images?.[0] || 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                  alt={product.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium">
                    Featured
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{product.title}</h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-primary-600">{product.price}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{product.seller}</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{product.location}</span>
                  </div>
                </div>
                
                <button className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
                  Contact Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Products */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          All Products & Services {products.length > 0 && `(${products.length})`}
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={product.images?.[0] || 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                    alt={product.title}
                    className="w-full h-32 object-cover"
                  />
                  {product.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-1">{product.title}</h3>
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-primary-600 text-sm">{product.price}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="truncate">{product.seller}</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{product.location}</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-xs">
                    Contact Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600 mb-4">
              {user ? 'Be the first to list a product in your community!' : 'Login to start buying and selling in your community!'}
            </p>
            {user && (
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                List First Product
              </button>
            )}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default Marketplace;
