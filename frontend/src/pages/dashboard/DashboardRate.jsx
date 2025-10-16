import React from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const DashboardRate = () => {
  const services = [
    { category: 'Clothing', items: [
      { name: 'Shirt', wash: '₹80', dryClean: '₹150', steam: '₹50' },
      { name: 'T-Shirt', wash: '₹60', dryClean: '₹120', steam: '₹40' },
      { name: 'Trousers', wash: '₹100', dryClean: '₹180', steam: '₹60' },
      { name: 'Jeans', wash: '₹120', dryClean: '₹200', steam: '₹70' }
    ]},
    { category: 'Formal Wear', items: [
      { name: 'Suit (2-piece)', wash: '₹300', dryClean: '₹500', steam: '₹200' },
      { name: 'Blazer', wash: '₹200', dryClean: '₹350', steam: '₹150' },
      { name: 'Tie', wash: '₹50', dryClean: '₹80', steam: '₹30' }
    ]},
    { category: 'Bedding', items: [
      { name: 'Bed Sheet', wash: '₹150', dryClean: '₹250', steam: '₹100' },
      { name: 'Pillow Cover', wash: '₹40', dryClean: '₹70', steam: '₹25' },
      { name: 'Comforter', wash: '₹300', dryClean: '₹500', steam: '₹200' }
    ]}
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rate Card</h1>
          <p className="text-gray-600 mt-2">View pricing for all our laundry services</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Rate Tables */}
      {services.map((service, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{service.category}</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Wash & Press</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Dry Clean</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Steam Press</th>
                </tr>
              </thead>
              <tbody>
                {service.items.map((item, itemIndex) => (
                  <tr key={itemIndex} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{item.name}</td>
                    <td className="py-4 px-4 text-green-600 font-semibold">{item.wash}</td>
                    <td className="py-4 px-4 text-blue-600 font-semibold">{item.dryClean}</td>
                    <td className="py-4 px-4 text-purple-600 font-semibold">{item.steam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Additional Info */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Additional Information</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Express service available with 50% surcharge</li>
          <li>• Premium service includes stain protection treatment</li>
          <li>• Bulk orders (10+ items) get 10% discount</li>
          <li>• Free pickup and delivery for orders above ₹500</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardRate;
