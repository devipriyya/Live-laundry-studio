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
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import AdvertisementBanner from '../../components/AdvertisementBanner';

const DashboardProductsEnhanced = () => {
  const { user } = useContext(AuthContext);
  const { wishlist, addToCart, toggleWishlist, isInWishlist, getCartCount } = useContext(CartContext);
  const navigate = useNavigate();
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
  const [productReviews, setProductReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [categories, setCategories] = useState([]);

  // Initialize quantities for all products
  useEffect(() => {
    const initialQuantities = {};
    products.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [products]);

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);

      const productList = Array.isArray(productsRes.data) ? productsRes.data : [];
      setProducts(productList);
      setFilteredProducts(productList);

      if (Array.isArray(categoriesRes.data)) {
        setCategories(categoriesRes.data);
      }
    } catch (err) {
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

  // Fetch products
  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(product => product.categoryId === categoryFilter || product.category === categoryFilter);
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

  // Define main groups
  const getCategoryGroup = (category) => {
    const cat = categories.find(c => c._id === category || c.name === category);
    return cat ? cat.name : 'Other';
  };

  const getCategoryColor = (group) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-amber-400 to-orange-500',
      'from-teal-400 to-emerald-600',
      'from-pink-500 to-rose-600',
      'from-purple-500 to-violet-600'
    ];
    const index = categories.findIndex(c => c.name === group);
    return index !== -1 ? colors[index % colors.length] : 'from-gray-400 to-gray-600';
  };

  const getProductFallback = (category) => {
    const icons = {
      'detergent': '🧼',
      'softener': '🧴',
      'stain-remover': '🧽',
      'laundry-bag': '🧺',
      'hanger': '🧥',
      'garment-cover': '🛡️',
      'bedsheet': '🛏️',
      'towel': '🧣',
      'curtain': '🖼️',
      'uniform': '👔'
    };
    return icons[category] || '🛍️';
  };

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

  const fetchProductReviews = async (productId) => {
    try {
      setLoadingReviews(true);
      setReviewError('');
      const response = await api.get(`/products/${productId}/reviews`);
      setProductReviews(Array.isArray(response.data) ? response.data : []);
    } catch (reviewFetchError) {
      setProductReviews([]);
      setReviewError(reviewFetchError.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoadingReviews(false);
    }
  };

  // View product details
  const viewProductDetails = async (product) => {
    try {
      const response = await api.get(`/products/${product.id}`);
      setSelectedProduct(response.data || product);
    } catch (_error) {
      setSelectedProduct(product);
    }

    setReviewForm({ rating: 5, comment: '' });
    setShowProductModal(true);
    fetchProductReviews(product.id);
  };

  // Submit review
  const submitReview = async (productId, rating, comment) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment
      });
      
      if (response.status === 201) {
        await fetchProductReviews(productId);
        return true;
      }
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to submit review. Please try again.');
      return false;
    }
  };

  // Buy now
  const buyNow = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    navigate('/dashboard/checkout');
  };

  const handleReviewSubmit = async () => {
    if (!selectedProduct) {
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewError('Please enter a review comment before submitting.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    const isSuccess = await submitReview(selectedProduct.id, reviewForm.rating, reviewForm.comment.trim());
    if (isSuccess) {
      setReviewForm({ rating: 5, comment: '' });
      setShowSuccessMessage('Review submitted successfully!');
      setTimeout(() => setShowSuccessMessage(''), 2500);
    }
    setSubmittingReview(false);
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
                onClick={fetchProductsAndCategories}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <button 
                onClick={() => navigate('/dashboard/home')} 
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Dashboard Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 -m-8 p-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-fade-in flex items-center space-x-3 border border-white/10 backdrop-blur-md">
          <div className="bg-emerald-500 rounded-full p-1">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-bold">{showSuccessMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight font-outfit uppercase">WashLab Store</h1>
              <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse"></div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Professional garment care essentials for your home.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/dashboard/cart')}
              className="group flex items-center px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:border-pink-500 hover:text-pink-600 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Cart ({getCartCount()})</span>
            </button>
            <button 
              onClick={() => navigate('/dashboard/wishlist')}
              className="group flex items-center px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:border-rose-500 hover:text-rose-600 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <HeartIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Wishlist ({wishlist.length})</span>
            </button>
          </div>
        </div>

        <AdvertisementBanner />

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for detergents, accessories, or fabrics..."
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="h-8 w-px bg-gray-100 hidden md:block"></div>

          {/* Quick Filters */}
          <div className="flex items-center px-2 py-1 overflow-x-auto no-scrollbar max-w-full">
            <button 
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === 'all' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id}
                onClick={() => setCategoryFilter(cat._id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  categoryFilter === cat._id ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-gray-100 hidden md:block"></div>

          {/* Sort Menu */}
          <div className="flex items-center p-1 bg-gray-50 rounded-2xl">
            <select
              className="bg-transparent border-none text-xs font-bold text-gray-600 focus:ring-0 py-2 pl-3 pr-8 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setCategoryFilter(cat._id)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                  categoryFilter === cat._id 
                    ? 'bg-pink-500 border-pink-500 text-white shadow-md' 
                    : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                {cat.name}
              </button>
            ))
          }
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group bg-white rounded-[2rem] border border-gray-100 hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-500/5 transition-all duration-500 flex flex-col overflow-hidden"
              >
                {/* Image Area */}
                <div 
                  className="relative aspect-square p-6 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50/50"
                  onClick={() => viewProductDetails(product)}
                >
                  {product.image ? (
                    <img 
                      src={product.image.startsWith('http') ? product.image : `${api.defaults.baseURL.replace('/api', '')}${product.image}`} 
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-lg"
                    />
                  ) : (
                    <div className="text-7xl group-hover:scale-125 transition-transform duration-700 drop-shadow-xl">
                      {getProductFallback(product.category)}
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                    className={`absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md transition-all shadow-sm ${
                      isInWishlist(product.id) 
                        ? 'bg-rose-500 text-white scale-110 shadow-rose-200' 
                        : 'bg-white/80 text-gray-400 hover:bg-white hover:text-rose-500'
                    }`}
                  >
                    <HeartIcon className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Stock Badge */}
                  {product.availability !== 'In Stock' && (
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                      Low Stock
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5 mb-2">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-20'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 mt-0.5">{product.rating}</span>
                    </div>

                    <h3 
                      className="font-black text-gray-900 text-sm mb-1 line-clamp-2 leading-snug group-hover:text-pink-600 transition-colors cursor-pointer font-outfit uppercase tracking-tight"
                      onClick={() => viewProductDetails(product)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-300 mb-4">{product.category.replace('-', ' ')}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-black text-gray-900 tracking-tighter">₹{product.price}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">/ {product.unit}</span>
                      </div>
                    </div>

                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                      >
                        <MinusIcon className="h-3 w-3 text-gray-500" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-gray-900">
                        {quantities[product.id] || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product.id, 1)}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                      >
                        <PlusIcon className="h-3 w-3 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-6 bg-gray-900 hover:bg-black text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
              <MagnifyingGlassIcon className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight font-outfit uppercase">Minimal Results</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8 font-medium">We couldn't find any products matching your current filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}
              className="px-8 py-3 bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {[
            { tag: 'Fast Delivery', title: 'Home Shipping', icon: '🚚', desc: 'Orders over ₹999 qualify for free priority delivery.' },
            { tag: 'Eco Friendly', title: 'Green Products', icon: '🍃', desc: 'Sustainable ingredients that are safe for your family.' },
            { tag: 'Safe Payment', title: 'Secure Checkout', icon: '🔒', desc: 'Industry standard encryption for all transactions.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-6">{item.icon}</div>
              <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block mb-2">{item.tag}</span>
              <h4 className="text-lg font-black text-gray-900 mb-3 font-outfit uppercase tracking-tight">{item.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in">
            {/* Modal Left: Image */}
            <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-12 relative">
              <button 
                onClick={() => setShowProductModal(false)}
                className="absolute top-8 left-8 p-3 bg-white rounded-2xl text-gray-400 hover:text-gray-900 shadow-sm md:hidden"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              
              <div className="relative group/modal-img max-w-md w-full aspect-square flex items-center justify-center">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image.startsWith('http') ? selectedProduct.image : `${api.defaults.baseURL.replace('/api', '')}${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain drop-shadow-2xl group-hover/modal-img:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="text-9xl drop-shadow-2xl filter brightness-110 group-hover/modal-img:scale-110 transition-transform duration-700">
                    {getProductFallback(selectedProduct.category)}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Right: Info */}
            <div className="md:w-1/2 flex flex-col bg-white overflow-y-auto">
              <div className="p-12">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em]">WashLab Essentials</span>
                  <button 
                    onClick={() => setShowProductModal(false)}
                    className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors hidden md:block"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter leading-none font-outfit uppercase">{selectedProduct.name}</h2>
                
                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex items-center px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
                    <StarIcon className="h-5 w-5 text-amber-500 fill-current" />
                    <span className="ml-2 text-sm font-black text-amber-900">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-xs font-bold text-gray-400">{productReviews.length} Verified Reviews</span>
                </div>

                <div className="flex items-baseline space-x-2 mb-8">
                  <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{selectedProduct.price}</span>
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">/ {selectedProduct.unit}</span>
                </div>

                <div className="space-y-8 mb-12">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Product Description</h4>
                    <p className="text-gray-600 text-sm leading-relaxed font-medium">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                      <span className={`text-xs font-black uppercase ${selectedProduct.availability === 'In Stock' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {selectedProduct.availability}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Category</span>
                      <span className="text-xs font-black uppercase text-gray-900">{selectedProduct.category.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-3xl border border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Quantity</span>
                    <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200">
                      <button
                        onClick={() => handleQuantityChange(selectedProduct.id, -1)}
                        className="p-2.5 hover:bg-gray-50 rounded-xl transition-all"
                      >
                        <MinusIcon className="h-4 w-4 text-gray-900" />
                      </button>
                      <span className="w-12 text-center text-lg font-black text-gray-900">
                        {quantities[selectedProduct.id] || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(selectedProduct.id, 1)}
                        className="p-2.5 hover:bg-gray-50 rounded-xl transition-all"
                      >
                        <PlusIcon className="h-4 w-4 text-gray-900" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleAddToCart(selectedProduct)}
                      className="bg-gray-900 hover:bg-black text-white py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>
                    <button 
                      onClick={() => buyNow(selectedProduct)}
                      className="bg-pink-500 hover:bg-pink-600 text-white py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-pink-100 active:scale-95"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Reviews Section In Modal */}
                <div className="mt-16 pt-16 border-t border-gray-100">
                  <h3 className="text-2xl font-black text-gray-900 mb-8 font-outfit uppercase tracking-tight">Customer Feedback</h3>
                  
                  {user && (
                    <div className="bg-gray-50 p-8 rounded-[2rem] mb-10 border border-gray-100">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Write a Review</h4>
                      <div className="flex space-x-1 mb-6">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button 
                            key={s} 
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))}
                            className={`p-2 transition-all ${reviewForm.rating >= s ? 'text-amber-500' : 'text-gray-300'}`}
                          >
                            <StarIcon className={`h-6 w-6 ${reviewForm.rating >= s ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="w-full p-6 bg-white border border-gray-200 rounded-3xl text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                        placeholder="Tell others about your experience..."
                        rows={4}
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      />
                      <button 
                        onClick={handleReviewSubmit}
                        disabled={submittingReview}
                        className="mt-6 w-full bg-white hover:bg-gray-900 hover:text-white text-gray-900 border border-gray-900 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </div>
                  )}

                  <div className="space-y-6">
                    {loadingReviews ? (
                      <div className="text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading feedback...</div>
                    ) : productReviews.length > 0 ? (
                      productReviews.map((review) => (
                        <div key={review._id} className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center text-xs font-black text-gray-500">
                                {review.customerInfo?.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <h5 className="text-xs font-black text-gray-900 uppercase tracking-tight">{review.customerInfo?.name || 'Verified Buyer'}</h5>
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.1em]">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed font-medium">"{review.comment}"</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-[2rem] border border-gray-100 border-dashed">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">No reviews yet. Be the first!</p>
                      </div>
                    )}
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
