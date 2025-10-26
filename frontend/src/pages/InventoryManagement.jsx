import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the API service
import {
  CubeIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch inventory data from API
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/inventory');
      console.log('Inventory API Response:', response.data);
      // The API returns an object with an items property
      if (response.data && Array.isArray(response.data.items)) {
        setInventory(response.data.items);
        setFilteredInventory(response.data.items);
      } else {
        // If response format is unexpected, use mock data
        console.warn('Unexpected API response format, using mock data');
        setInventory(mockInventory);
        setFilteredInventory(mockInventory);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory data. Please try again.');
      // Fallback to mock data if API fails
      setInventory(mockInventory);
      setFilteredInventory(mockInventory);
    } finally {
      setLoading(false);
    }
  };

  // Mock inventory data as fallback
  const mockInventory = [
    {
      _id: 'INV-001',
      itemName: 'Premium Detergent',
      category: 'detergent',
      sku: 'DET-001',
      currentStock: 45,
      minStockLevel: 20,
      maxStockLevel: 100,
      unit: 'bottle',
      pricePerUnit: 12.50,
      supplier: {
        name: 'CleanCorp Ltd',
        contact: '+1 555-0301'
      },
      lastRestocked: '2024-01-10',
      expiryDate: '2025-01-10',
      status: 'in-stock',
      location: 'Main Storage'
    },
    {
      _id: 'INV-002',
      itemName: 'Fabric Softener',
      category: 'softener',
      sku: 'SOF-001',
      currentStock: 15,
      minStockLevel: 25,
      maxStockLevel: 80,
      unit: 'bottle',
      pricePerUnit: 8.75,
      supplier: {
        name: 'SoftFabric Inc',
        contact: '+1 555-0302'
      },
      lastRestocked: '2024-01-08',
      expiryDate: '2024-12-15',
      status: 'low-stock',
      location: 'Main Storage'
    },
    {
      _id: 'INV-003',
      itemName: 'Dry Cleaning Solvent',
      category: 'other',
      sku: 'DCS-001',
      currentStock: 0,
      minStockLevel: 10,
      maxStockLevel: 50,
      unit: 'gallon',
      pricePerUnit: 25.00,
      supplier: {
        name: 'ChemClean Solutions',
        contact: '+1 555-0303'
      },
      lastRestocked: '2024-01-05',
      expiryDate: '2024-06-30',
      status: 'out-of-stock',
      location: 'Chemical Storage'
    }
  ];

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    let filtered = inventory;
    console.log('Filtering inventory:', inventory, 'searchTerm:', searchTerm, 'categoryFilter:', categoryFilter);

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.supplier && item.supplier.name && item.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    console.log('Filtered inventory:', filtered);
    setFilteredInventory(filtered);
  }, [searchTerm, categoryFilter, inventory]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'in-stock': return 'In Stock';
      case 'low-stock': return 'Low Stock';
      case 'out-of-stock': return 'Out of Stock';
      case 'discontinued': return 'Discontinued';
      default: return status;
    }
  };

  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'detergent': 'Detergent',
      'softener': 'Softener',
      'stain-remover': 'Stain Remover',
      'packaging': 'Packaging',
      'equipment': 'Equipment',
      'other': 'Other'
    };
    return categoryNames[category] || category;
  };

  const categories = ['detergent', 'softener', 'stain-remover', 'packaging', 'equipment', 'other'];

  // Add/Edit Item Modal
  const AddItemModal = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState(
      item || {
        itemName: '',
        category: 'other',
        sku: '',
        currentStock: 0,
        minStockLevel: 10,
        maxStockLevel: 100,
        unit: 'piece',
        pricePerUnit: 0,
        supplier: {
          name: '',
          contact: '',
          email: ''
        },
        expiryDate: '',
        location: 'Main Storage',
        notes: ''
      }
    );

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const itemData = {
          ...formData,
          supplier: {
            name: formData.supplier.name,
            contact: formData.supplier.contact,
            email: formData.supplier.email
          }
        };

        let response;
        if (item) {
          // Update existing item
          response = await api.put(`/inventory/${item._id}`, itemData);
        } else {
          // Add new item
          response = await api.post('/inventory', itemData);
        }
        
        // Call onSave with the item data from the response
        onSave(response.data);
        onClose();
      } catch (err) {
        console.error('Error saving item:', err);
        alert('Failed to save item. Please try again.');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {item ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="detergent">Detergent</option>
                  <option value="softener">Softener</option>
                  <option value="stain-remover">Stain Remover</option>
                  <option value="packaging">Packaging</option>
                  <option value="equipment">Equipment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="liter">Liters (L)</option>
                    <option value="piece">Pieces</option>
                    <option value="box">Boxes</option>
                    <option value="bottle">Bottles</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Stock Level
                  </label>
                  <input
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({...formData, minStockLevel: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Stock Level
                  </label>
                  <input
                    type="number"
                    value={formData.maxStockLevel}
                    onChange={(e) => setFormData({...formData, maxStockLevel: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Unit (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({...formData, pricePerUnit: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={formData.supplier.name}
                    onChange={(e) => setFormData({...formData, supplier: {...formData.supplier, name: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Contact
                  </label>
                  <input
                    type="text"
                    value={formData.supplier.contact}
                    onChange={(e) => setFormData({...formData, supplier: {...formData.supplier, contact: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.supplier.email}
                  onChange={(e) => setFormData({...formData, supplier: {...formData.supplier, email: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {item ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // View Item Modal
  const ViewItemModal = ({ item, onClose }) => {
    if (!item) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Item Details</h2>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{item.itemName}</h3>
                <p className="text-sm text-gray-500">ID: {item._id}</p>
                {item.sku && <p className="text-sm text-gray-500">SKU: {item.sku}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{getCategoryDisplayName(item.category)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusDisplayName(item.status)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Current Stock</p>
                  <p className="font-medium">{item.currentStock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Range</p>
                  <p className="font-medium">{item.minStockLevel} - {item.maxStockLevel}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Price per Unit</p>
                  <p className="font-medium">₹{item.pricePerUnit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="font-medium">₹{(item.currentStock * item.pricePerUnit).toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="font-medium">{item.supplier?.name || 'N/A'}</p>
                {item.supplier?.contact && <p className="text-sm">{item.supplier.contact}</p>}
                {item.supplier?.email && <p className="text-sm">{item.supplier.email}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Last Restocked</p>
                  <p className="font-medium">{item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="font-medium">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{item.location || 'N/A'}</p>
              </div>
              
              {item.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{item.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveItem = (item) => {
    if (selectedItem) {
      // Update existing item
      const updatedInventory = inventory.map(inv => inv._id === item._id ? item : inv);
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
    } else {
      // Add new item
      const updatedInventory = [...inventory, item];
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await api.delete(`/inventory/${itemId}`);
        const updatedInventory = inventory.filter(item => item._id !== itemId);
        setInventory(updatedInventory);
        setFilteredInventory(updatedInventory);
      } catch (err) {
        console.error('Error deleting item:', err);
        // Check if it's a 404 error (item already deleted)
        if (err.response && err.response.status === 404) {
          // Item already deleted, update UI anyway
          const updatedInventory = inventory.filter(item => item._id !== itemId);
          setInventory(updatedInventory);
          setFilteredInventory(updatedInventory);
        } else {
          alert('Failed to delete item. Please try again.');
        }
      }
    }
  };

  // Calculate statistics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = inventory.filter(item => item.status === 'out-of-stock').length;
  const totalValue = inventory.reduce((sum, item) => {
    const itemValue = item.currentStock * item.pricePerUnit;
    return sum + (isNaN(itemValue) ? 0 : itemValue);
  }, 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">Track and manage laundry supplies and equipment</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CubeIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ArrowDownIcon className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ArrowUpIcon className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items by name, category, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{getCategoryDisplayName(category)}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSelectedItem(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Item</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Cost/Unit (₹)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Supplier</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No inventory items found. {searchTerm && 'Try adjusting your search or filter.'}
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{item.itemName}</div>
                      <div className="text-sm text-gray-600">ID: {item._id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{getCategoryDisplayName(item.category)}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-sm text-gray-600">
                        Min: {item.minStockLevel} | Max: {item.maxStockLevel}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {getStatusDisplayName(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">₹{item.pricePerUnit.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-900">{item.supplier?.name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowViewModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowAddModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddItemModal
          item={selectedItem}
          onClose={() => {
            setShowAddModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveItem}
        />
      )}

      {/* View Modal */}
      {showViewModal && (
        <ViewItemModal
          item={selectedItem}
          onClose={() => {
            setShowViewModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default InventoryManagement;