import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentArrowDownIcon, 
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  TruckIcon,
  StarIcon,
  CheckCircleIcon,
  TagIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const DashboardRate = () => {
  const [selectedService, setSelectedService] = useState('all');
  const navigate = useNavigate();

  // Back navigation function
  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Download PDF function
  const handleDownloadPDF = () => {
    // Create a printable version
    const printWindow = window.open('', '', 'height=800,width=1000');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FabricSpa - Rate Card</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
            }
            h1 {
              color: #0D9488;
              text-align: center;
              margin-bottom: 10px;
            }
            .subtitle {
              text-align: center;
              color: #666;
              margin-bottom: 30px;
            }
            .category {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .category-header {
              background: linear-gradient(to right, #F0FDFA, #ECFEFF);
              padding: 15px;
              border-left: 4px solid #0D9488;
              margin-bottom: 15px;
            }
            .category-title {
              font-size: 20px;
              font-weight: bold;
              color: #0D9488;
              margin: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background-color: #F0FDFA;
              padding: 12px;
              text-align: left;
              font-weight: bold;
              border-bottom: 2px solid #0D9488;
            }
            td {
              padding: 10px 12px;
              border-bottom: 1px solid #E5E7EB;
            }
            tr:hover {
              background-color: #F9FAFB;
            }
            .price-wash { color: #059669; font-weight: bold; }
            .price-dry { color: #0D9488; font-weight: bold; }
            .price-steam { color: #0891B2; font-weight: bold; }
            .features {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .feature {
              background: #F0FDFA;
              padding: 15px;
              border-radius: 8px;
              border-left: 3px solid #0D9488;
            }
            .feature-title {
              font-weight: bold;
              color: #0D9488;
              margin-bottom: 5px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #0D9488;
              text-align: center;
              color: #666;
            }
            @media print {
              body { padding: 20px; }
              .category { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>🌊 FabricSpa Rate Card</h1>
          <p class="subtitle">Simple and Transparent Pricing</p>
          
          <div class="features">
            <div class="feature">
              <div class="feature-title">🚚 Free Pickup & Delivery</div>
              <div>On orders above ₹500</div>
            </div>
            <div class="feature">
              <div class="feature-title">⏰ Express Service</div>
              <div>Available with 50% surcharge</div>
            </div>
            <div class="feature">
              <div class="feature-title">⭐ Quality Guarantee</div>
              <div>100% satisfaction assured</div>
            </div>
            <div class="feature">
              <div class="feature-title">🏷️ Bulk Discounts</div>
              <div>10% off on 10+ items</div>
            </div>
          </div>
          
          ${services.map(service => `
            <div class="category">
              <div class="category-header">
                <h2 class="category-title">${service.icon} ${service.category}</h2>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Wash & Press</th>
                    <th>Dry Clean</th>
                    <th>Steam Press</th>
                  </tr>
                </thead>
                <tbody>
                  ${service.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td class="price-wash">${item.wash}</td>
                      <td class="price-dry">${item.dryClean}</td>
                      <td class="price-steam">${item.steam}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('')}
          
          <div class="footer">
            <p><strong>Special Offers:</strong></p>
            <p>✓ Express service available with 50% surcharge</p>
            <p>✓ Premium service includes stain protection treatment</p>
            <p>✓ Bulk orders (10+ items) get 10% discount</p>
            <p>✓ Free pickup and delivery for orders above ₹500</p>
            <p style="margin-top: 20px;"><strong>Contact us:</strong> FabricSpa - Your Premium Laundry Partner</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  const services = [
    { 
      category: 'Clothing', 
      icon: '👔',
      color: 'blue',
      items: [
        { name: 'Shirt', wash: '₹80', dryClean: '₹150', steam: '₹50' },
        { name: 'T-Shirt', wash: '₹60', dryClean: '₹120', steam: '₹40' },
        { name: 'Trousers', wash: '₹100', dryClean: '₹180', steam: '₹60' },
        { name: 'Jeans', wash: '₹120', dryClean: '₹200', steam: '₹70' },
        { name: 'Dress', wash: '₹150', dryClean: '₹250', steam: '₹80' },
        { name: 'Skirt', wash: '₹90', dryClean: '₹160', steam: '₹55' }
      ]
    },
    { 
      category: 'Formal Wear', 
      icon: '🤵',
      color: 'purple',
      items: [
        { name: 'Suit (2-piece)', wash: '₹300', dryClean: '₹500', steam: '₹200' },
        { name: 'Blazer', wash: '₹200', dryClean: '₹350', steam: '₹150' },
        { name: 'Tie', wash: '₹50', dryClean: '₹80', steam: '₹30' },
        { name: 'Waistcoat', wash: '₹100', dryClean: '₹180', steam: '₹70' }
      ]
    },
    { 
      category: 'Bedding', 
      icon: '🛏️',
      color: 'green',
      items: [
        { name: 'Bed Sheet', wash: '₹150', dryClean: '₹250', steam: '₹100' },
        { name: 'Pillow Cover', wash: '₹40', dryClean: '₹70', steam: '₹25' },
        { name: 'Comforter', wash: '₹300', dryClean: '₹500', steam: '₹200' },
        { name: 'Blanket', wash: '₹200', dryClean: '₹350', steam: '₹150' }
      ]
    },
    { 
      category: 'Ethnic Wear', 
      icon: '🥻',
      color: 'pink',
      items: [
        { name: 'Saree (Cotton)', wash: '₹120', dryClean: '₹200', steam: '₹80' },
        { name: 'Saree (Silk)', wash: '₹180', dryClean: '₹300', steam: '₹120' },
        { name: 'Kurta', wash: '₹80', dryClean: '₹150', steam: '₹60' },
        { name: 'Lehenga', wash: '₹350', dryClean: '₹600', steam: '₹250' }
      ]
    }
  ];

  const serviceFilters = [
    { id: 'all', name: 'All Services', icon: SparklesIcon },
    { id: 'wash', name: 'Wash & Press', icon: SparklesIcon },
    { id: 'dryClean', name: 'Dry Clean', icon: ShieldCheckIcon },
    { id: 'steam', name: 'Steam Press', icon: ClockIcon }
  ];

  const features = [
    { icon: TruckIcon, title: 'Free Pickup & Delivery', desc: 'On orders above ₹500' },
    { icon: ClockIcon, title: 'Express Service', desc: 'Available with 50% surcharge' },
    { icon: StarIcon, title: 'Quality Guarantee', desc: '100% satisfaction assured' },
    { icon: TagIcon, title: 'Bulk Discounts', desc: '10% off on 10+ items' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Simple Header */}
      <div className="bg-white border-b-4 border-teal-500 rounded-lg mb-6 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors p-2 hover:bg-teal-50 rounded-lg"
                title="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="border-l border-gray-300 h-8"></div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">Rate Card</h1>
                <p className="text-gray-600">Simple and transparent pricing</p>
              </div>
            </div>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simple Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border-2 border-teal-100 hover:border-teal-400 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Filter Tabs */}
      <div className="bg-white rounded-lg p-1 shadow-sm mb-6 inline-flex gap-1 border-2 border-teal-200">
        {serviceFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedService(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
              selectedService === filter.id
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-teal-50'
            }`}
          >
            <filter.icon className="h-4 w-4" />
            {filter.name}
          </button>
        ))}  
      </div>

      {/* Compact Rate Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Simple Category Header */}
            <div className={`${
              service.color === 'blue' ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-300' :
              service.color === 'purple' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300' :
              service.color === 'green' ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300' :
              'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-300'
            } border-b-2 p-4`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <h2 className={`text-lg font-bold ${
                    service.color === 'blue' ? 'text-teal-700' :
                    service.color === 'purple' ? 'text-purple-700' :
                    service.color === 'green' ? 'text-emerald-700' :
                    'text-pink-700'
                  }`}>{service.category}</h2>
                  <p className="text-xs text-gray-600">{service.items.length} items</p>
                </div>
              </div>
            </div>

            {/* Compact Pricing Table */}
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Item</th>
                      {(selectedService === 'all' || selectedService === 'wash') && (
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Wash</th>
                      )}
                      {(selectedService === 'all' || selectedService === 'dryClean') && (
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Dry Clean</th>
                      )}
                      {(selectedService === 'all' || selectedService === 'steam') && (
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Steam</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {service.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-medium text-gray-900 text-sm">{item.name}</td>
                        {(selectedService === 'all' || selectedService === 'wash') && (
                          <td className="py-3 px-3">
                            <span className="text-emerald-600 font-semibold text-sm">
                              {item.wash}
                            </span>
                          </td>
                        )}
                        {(selectedService === 'all' || selectedService === 'dryClean') && (
                          <td className="py-3 px-3">
                            <span className="text-teal-600 font-semibold text-sm">
                              {item.dryClean}
                            </span>
                          </td>
                        )}
                        {(selectedService === 'all' || selectedService === 'steam') && (
                          <td className="py-3 px-3">
                            <span className="text-cyan-600 font-semibold text-sm">
                              {item.steam}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Special Offers */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 shadow-sm border-2 border-amber-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-amber-400 to-orange-400 w-8 h-8 rounded-lg flex items-center justify-center">
              <TagIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Special Offers
            </h3>
          </div>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">Express service available with 50% surcharge</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">Premium service includes stain protection treatment</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">Bulk orders (10+ items) get 10% discount</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">Free pickup and delivery for orders above ₹500</span>
            </li>
          </ul>
        </div>

        {/* Service Information */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-5 shadow-sm border-2 border-teal-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-8 h-8 rounded-lg flex items-center justify-center">
              <StarIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Why Choose FabricSpa?
            </h3>
          </div>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">Eco-friendly detergents and fabric softeners</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">Professional stain removal experts</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">24/7 customer support available</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">100% satisfaction guarantee on all services</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Simple Call to Action */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-6 text-center shadow-md border-2 border-teal-400 mt-6">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to Get Started?</h2>
        <p className="text-teal-50 mb-6">
          Experience premium laundry care with transparent pricing
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-white hover:bg-teal-50 text-teal-700 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md">
            Schedule Pickup
          </button>
          <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-6 py-2.5 rounded-lg font-semibold transition-all">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardRate;
