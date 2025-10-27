import React, { useState, useEffect, useContext } from 'react';
import { 
  ShoppingCartIcon, 
  StarIcon, 
  HeartIcon, 
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  MinusIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import api from '../../api';

const DashboardProductsEnhanced = () => {
  const { user } = useContext(AuthContext);
  const { cart, wishlist, addToCart, toggleWishlist, isInWishlist, getCartCount } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [quantities, setQuantities] = useState({});

  // Initialize quantities for all products
  useEffect(() => {
    const initialQuantities = {};
    products.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [products]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/products');
        console.log('Products API response:', response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        // Provide more specific error messages
        if (err.response?.status === 404) {
          setError('Products service not found. Please contact support.');
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Network error. Please check your internet connection.');
        } else {
          setError(`Failed to load products: ${err.response?.data?.message || err.message || 'Please try again later.'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredProducts(result);
  }, [products, searchTerm, categoryFilter, sortBy, sortOrder]);

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))];

  // Handle quantity change
  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => {
      const newQuantities = { ...prev };
      const currentQuantity = newQuantities[productId] || 1;
      const newQuantity = Math.max(1, currentQuantity + change);
      newQuantities[productId] = newQuantity;
      return newQuantities;
    });
  };

  // Add to cart
  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    
    setShowSuccessMessage(`${quantity} ${product.name} added to cart!`);
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  // Add to wishlist
  const handleToggleWishlist = (product) => {
    toggleWishlist(product);
  };

  // View product details
  const viewProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Submit review
  const submitReview = async (productId, rating, comment) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment
      });
      
      if (response.status === 201) {
        alert('Review submitted successfully!');
        return true;
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
      return false;
    }
  };

  // Buy now
  const buyNow = (product) => {
    const quantity = quantities[product.id] || 1;
    // In a real implementation, this would redirect to checkout
    alert(`Proceeding to checkout with ${quantity} ${product.name}`);
  };

  // Ask a question
  const askQuestion = (product) => {
    // In a real implementation, this would open a contact form
    alert(`Contacting support about ${product.name}`);
  };

  // View invoice/reorder
  const viewInvoice = (product) => {
    // In a real implementation, this would show purchase history
    alert(`Viewing invoice for ${product.name}`);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">WashLab Products</h1>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">NEW</span>
        </div>
        <p className="text-gray-600">Premium laundry care products</p>
        
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">WashLab Products</h1>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">NEW</span>
        </div>
        <p className="text-gray-600">Premium laundry care products</p>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-800 text-lg font-medium mb-2">Unable to Load Products</p>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {showSuccessMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">WashLab Products</h1>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">NEW</span>
        </div>
        <p className="text-gray-600">Premium laundry care products from WashLab</p>
      </div>
      
      {/* Navigation Links */}
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => window.location.href = '/dashboard/cart'}
          className="flex items-center px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          <span>View Cart ({getCartCount()})</span>
        </button>
        
        <button 
          onClick={() => window.location.href = '/dashboard/wishlist'}
          className="flex items-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
        >
          <HeartIcon className="h-5 w-5 mr-2" />
          <span>Wishlist ({wishlist.length})</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <button
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              <ArrowPathIcon className={`h-5 w-5 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg p-4 text-white">
        <h2 className="text-lg font-bold mb-2">🧼 WashLab Product Collection</h2>
        <p className="text-pink-100 text-sm mb-3">
          Scientifically formulated products for superior fabric care.
        </p>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-lg font-bold">100%</div>
            <div className="text-xs text-pink-100">Natural</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">0%</div>
            <div className="text-xs text-pink-100">Harmful</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">5★</div>
            <div className="text-xs text-pink-100">Rating</div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300">
              <div className="text-center">
                <div className="text-4xl mb-3">{product.image}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">({product.rating})</span>
                </div>
                
                <div className="text-lg font-bold text-gray-900 mb-2">₹{product.price}</div>
                
                <div className="mb-3">
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    product.availability === 'In Stock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.availability}
                  </span>
                </div>
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-center mb-3">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="p-1 bg-gray-100 hover:bg-gray-200 rounded-l transition-colors"
                  >
                    <MinusIcon className="h-3 w-3 text-gray-700" />
                  </button>
                  <span className="px-2 py-1 bg-gray-50 border-y border-gray-200 text-sm">
                    {quantities[product.id] || 1}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}
                    className="p-1 bg-gray-100 hover:bg-gray-200 rounded-r transition-colors"
                  >
                    <PlusIcon className="h-3 w-3 text-gray-700" />
                  </button>
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-1 mb-2">
                  <button 
                    className="flex items-center justify-center space-x-1 bg-pink-600 hover:bg-pink-700 text-white py-1.5 px-2 rounded transition-colors text-xs"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCartIcon className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                  
                  <button 
                    className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded transition-colors text-xs ${
                      isInWishlist(product.id)
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleToggleWishlist(product)}
                  >
                    <HeartIcon className={`h-3 w-3 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    <span>Wish</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-1">
                  <button 
                    className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-2 rounded transition-colors text-xs"
                    onClick={() => viewProductDetails(product)}
                  >
                    <DocumentTextIcon className="h-3 w-3" />
                    <span>Details</span>
                  </button>
                  
                  <button 
                    className="flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 text-white py-1.5 px-2 rounded transition-colors text-xs"
                    onClick={() => buyNow(product)}
                  >
                    <span>Buy</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-12 text-center">
          <div className="text-yellow-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No Products Found</h3>
          <p className="text-yellow-700 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Benefits Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Why Choose WashLab Products?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-pink-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <span className="text-lg">🌱</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Eco-Friendly</h3>
            <p className="text-xs text-gray-600">Biodegradable formulas that are safe for the environment</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <span className="text-lg">🔬</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Lab Tested</h3>
            <p className="text-xs text-gray-600">Rigorously tested for effectiveness and safety</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <span className="text-lg">💎</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Premium Quality</h3>
            <p className="text-xs text-gray-600">Professional-grade products for superior results</p>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <button 
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{selectedProduct.image}</div>
                <p className="text-gray-700 text-sm mb-3">{selectedProduct.description}</p>
                
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">({selectedProduct.rating} average rating)</span>
                </div>
                
                <div className="text-2xl font-bold text-gray-900 mb-3">₹{selectedProduct.price}</div>
                
                <div className="mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProduct.availability === 'In Stock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedProduct.availability}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button 
                    className="flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white py-2 px-3 rounded transition-colors text-sm"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setShowProductModal(false);
                    }}
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button 
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded transition-colors text-sm"
                    onClick={() => {
                      buyNow(selectedProduct);
                      setShowProductModal(false);
                    }}
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-md font-semibold text-gray-900 mb-2">Product Information</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-1 text-gray-600">{selectedProduct.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Unit:</span>
                    <span className="ml-1 text-gray-600">{selectedProduct.unit}</span>
                  </div>
                </div>
              </div>
              
              {/* Reviews Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-semibold text-gray-900">Customer Reviews</h3>
                  <button className="text-pink-600 hover:text-pink-800 text-xs font-medium">
                    Write a Review
                  </button>
                </div>
                
                <div className="space-y-3">
                  {/* Sample reviews */}
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-600">4 days ago</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-1">Great product! Really helped with my stains.</p>
                    <p className="text-xs text-gray-500">- Sarah Johnson</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3 w-3 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-600">2 weeks ago</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-1">Excellent quality and fast delivery.</p>
                    <p className="text-xs text-gray-500">- Michael Chen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProductsEnhanced;