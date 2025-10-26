import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import api from '../../api';

const DashboardProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/products');
        console.log('Products API response:', response.data);
        setProducts(response.data);
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
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">WashLab Products</h1>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">NEW</span>
        </div>
        <p className="text-gray-600">Premium laundry care products from WashLab</p>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">🧼 WashLab Product Collection</h2>
        <p className="text-purple-100 mb-6">
          Scientifically formulated products for superior fabric care. 
          Developed for professional-grade results in your home.
        </p>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-purple-200">Natural</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0%</div>
            <div className="text-sm text-purple-200">Harmful Chemicals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">5★</div>
            <div className="text-sm text-purple-200">Customer Rating</div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">{product.image}</div>
                <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.rating})</span>
                </div>
                
                <div className="text-2xl font-bold text-gray-900 mb-4">₹{product.price}</div>
                
                <div className="mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.availability === 'In Stock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.availability}
                  </span>
                </div>
                
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors">
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
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
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No Products Available</h3>
          <p className="text-yellow-700 mb-4">We're working on adding new products to our collection. Check back soon!</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Benefits Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Why Choose WashLab Products?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
            <p className="text-sm text-gray-600">Biodegradable formulas that are safe for the environment</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <span className="text-2xl">🔬</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Lab Tested</h3>
            <p className="text-sm text-gray-600">Rigorously tested for effectiveness and safety</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600">Professional-grade products for superior results</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProducts;