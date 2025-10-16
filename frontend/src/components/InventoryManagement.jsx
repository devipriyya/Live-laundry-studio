import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  TagIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock inventory data
  const mockInventory = [
    {
      id: 'INV-001',
      name: 'Premium Detergent',
      category: 'Cleaning Supplies',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unitCost: 12.50,
      totalValue: 562.50,
      supplier: 'CleanCorp Ltd',
      supplierContact: '+1 555-0301',
      lastRestocked: '2024-01-15',
      expiryDate: '2025-01-15',
      location: 'Warehouse A - Shelf 3',
      description: 'High-quality eco-friendly detergent for premium services',
      reorderPoint: 25,
      status: 'In Stock'
    },
    {
      id: 'INV-002',
      name: 'Garment Bags',
      category: 'Packaging',
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unitCost: 0.75,
      totalValue: 6.00,
      supplier: 'PackPro Inc',
      supplierContact: '+1 555-0302',
      lastRestocked: '2024-01-10',
      expiryDate: null,
      location: 'Storage Room B - Bin 2',
      description: 'Clear plastic garment bags for dry cleaning',
      reorderPoint: 15,
      status: 'Low Stock'
    },
    {
      id: 'INV-003',
      name: 'Fabric Softener',
      category: 'Cleaning Supplies',
      currentStock: 32,
      minStock: 10,
      maxStock: 60,
      unitCost: 8.99,
      totalValue: 287.68,
      supplier: 'CleanCorp Ltd',
      supplierContact: '+1 555-0301',
      lastRestocked: '2024-01-18',
      expiryDate: '2024-12-31',
      location: 'Warehouse A - Shelf 2',
      description: 'Gentle fabric softener for delicate items',
      reorderPoint: 15,
      status: 'In Stock'
    },
    {
      id: 'INV-004',
      name: 'Dry Cleaning Solvent',
      category: 'Chemicals',
      currentStock: 0,
      minStock: 5,
      maxStock: 25,
      unitCost: 45.00,
      totalValue: 0.00,
      supplier: 'ChemSupply Co',
      supplierContact: '+1 555-0303',
      lastRestocked: '2024-01-05',
      expiryDate: '2024-06-30',
      location: 'Chemical Storage - Cabinet 1',
      description: 'Professional grade dry cleaning solvent',
      reorderPoint: 8,
      status: 'Out of Stock'
    }
  ];

  useEffect(() => {
    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
  }, []);

  // Filter inventory
  useEffect(() => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase().replace(' ', '_') === categoryFilter
      );
    }

    setFilteredInventory(filtered);
  }, [searchTerm, categoryFilter, inventory]);

  // Get stock status
  const getStockStatus = (item) => {
    if (item.currentStock === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800 border-red-200' };
    if (item.currentStock <= item.minStock) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (item.currentStock >= item.maxStock) return { status: 'Overstock', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    return { status: 'In Stock', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  // Calculate total inventory value
  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock).length;
  const outOfStockItems = inventory.filter(item => item.currentStock === 0).length;

  // Inventory Detail Modal
  const InventoryDetailModal = ({ item, onClose }) => {
    if (!item) return null;

    const stockInfo = getStockStatus(item);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Inventory Item Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Item Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Item Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Item ID:</span>
                      <span className="font-medium">{item.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${stockInfo.color}`}>
                        {stockInfo.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Stock Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Stock:</span>
                      <span className="font-bold text-lg">{item.currentStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Stock:</span>
                      <span className="font-medium">{item.minStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maximum Stock:</span>
                      <span className="font-medium">{item.maxStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reorder Point:</span>
                      <span className="font-medium">{item.reorderPoint}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Financial</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unit Cost:</span>
                      <span className="font-medium">${item.unitCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-bold text-green-600">${item.totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Supplier Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{item.supplier}</p>
                      <p className="text-sm text-gray-500">Supplier</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{item.supplierContact}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Last Restocked</p>
                    <p className="font-medium">{new Date(item.lastRestocked).toLocaleDateString()}</p>
                  </div>
                </div>
                {item.expiryDate && (
                  <div className="flex items-center space-x-3">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Expiry Date</p>
                      <p className="font-medium">{new Date(item.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stock Level Indicator */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Stock Level</h3>
              <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    item.currentStock === 0 ? 'bg-red-500' :
                    item.currentStock <= item.minStock ? 'bg-yellow-500' :
                    item.currentStock >= item.maxStock ? 'bg-purple-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>0</span>
                <span>Min: {item.minStock}</span>
                <span>Current: {item.currentStock}</span>
                <span>Max: {item.maxStock}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Track and manage inventory levels, suppliers, and stock alerts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CubeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-green-600">${totalInventoryValue.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="cleaning_supplies">Cleaning Supplies</option>
                <option value="packaging">Packaging</option>
                <option value="chemicals">Chemicals</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-5 w-5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const stockInfo = getStockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <TagIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.currentStock} / {item.maxStock}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              item.currentStock === 0 ? 'bg-red-500' :
                              item.currentStock <= item.minStock ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${stockInfo.color}`}>
                          {stockInfo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${item.unitCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${item.totalValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.supplier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded transition-colors">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Detail Modal */}
        {showModal && (
          <InventoryDetailModal
            item={selectedItem}
            onClose={() => {
              setShowModal(false);
              setSelectedItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
