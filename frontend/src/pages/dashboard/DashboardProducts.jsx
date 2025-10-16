import React from 'react';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';

const DashboardProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Fabric Softener Premium',
      price: '₹299',
      rating: 4.8,
      image: '🧴',
      description: 'Long-lasting freshness for all fabrics'
    },
    {
      id: 2,
      name: 'Stain Remover Pro',
      price: '₹199',
      rating: 4.9,
      image: '🧽',
      description: 'Removes tough stains instantly'
    },
    {
      id: 3,
      name: 'Detergent Concentrate',
      price: '₹399',
      rating: 4.7,
      image: '🧼',
      description: 'Eco-friendly concentrated formula'
    },
    {
      id: 4,
      name: 'Fabric Protector Spray',
      price: '₹249',
      rating: 4.6,
      image: '💨',
      description: 'Protects against stains and odors'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Jivika Labs Products</h1>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">NEW</span>
        </div>
        <p className="text-gray-600">Premium laundry care products from our research lab</p>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">🧪 Jivika Labs Collection</h2>
        <p className="text-purple-100 mb-6">
          Scientifically formulated products for superior fabric care. 
          Developed in our state-of-the-art research facility.
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
              
              <div className="text-2xl font-bold text-gray-900 mb-4">{product.price}</div>
              
              <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors">
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Why Choose Jivika Labs?</h2>
        
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
