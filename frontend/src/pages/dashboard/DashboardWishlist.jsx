import React, { useContext } from 'react';
import { 
  HeartIcon, 
  ShoppingCartIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const DashboardWishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Optionally remove from wishlist after adding to cart
    // toggleWishlist(product);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard/products')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Back to Products</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
            <p className="text-gray-600">{wishlist.length} items in your wishlist</p>
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <HeartIcon className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Save items that you like to your wishlist</p>
          <button
            onClick={() => navigate('/dashboard/products')}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">{product.image}</div>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="text-rose-500 hover:text-rose-700"
                >
                  <HeartIcon className="h-6 w-6 fill-current" />
                </button>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
              </div>
              
              <div className="text-xl font-bold text-gray-900 mb-4">₹{product.price}</div>
              
              <div className="mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.availability === 'In Stock' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.availability}
                </span>
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardWishlist;