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
            <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              {/* Product Image Wrapper */}
              <div className="relative group/image overflow-hidden rounded-2xl mb-4 bg-gray-50 aspect-square flex items-center justify-center">
                {product.image && product.image.includes('.png') ? (
                  <img 
                    src={`/images/products/${product.image}`} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover/image:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-6xl group-hover/image:scale-110 transition-transform duration-500">{product.image || '🛍️'}</div>
                )}
                
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm z-10"
                >
                  <HeartIcon className="h-5 w-5 fill-current" />
                </button>

                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-700 shadow-sm">
                  {product.category}
                </div>
              </div>

              <div className="px-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</h3>
                  <div className="flex items-center text-yellow-400">
                    <StarIcon className="h-3 w-3 fill-current" />
                    <span className="text-[10px] font-bold ml-1 text-gray-700">{product.rating}</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-5">
                  <div className="text-xl font-black text-gray-900">₹{product.price}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    product.availability === 'In Stock' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {product.availability}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardWishlist;