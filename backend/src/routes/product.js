const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
// Removed protect middleware since products should be publicly accessible

// Get all products available for customers (no authentication required)
router.get('/', async (req, res) => {
  try {
    // Only get items that are in stock and are customer-facing categories
    const query = {
      status: { $in: ['in-stock', 'low-stock'] },
      category: { $in: ['detergent', 'softener', 'stain-remover'] }
    };

    const items = await Inventory.find(query)
      .sort({ itemName: 1 });

    // Transform inventory items to customer-facing product format
    const products = items.map(item => ({
      id: item._id,
      name: item.itemName,
      description: item.notes || `Premium ${item.itemName.toLowerCase()} for your laundry needs`,
      price: item.pricePerUnit,
      category: item.category,
      unit: item.unit,
      availability: item.status === 'in-stock' ? 'In Stock' : 'Low Stock',
      image: getProductImage(item.category),
      rating: getRatingForCategory(item.category)
    }));

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product by ID (no authentication required)
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is available for customers
    if (!['in-stock', 'low-stock'].includes(item.status) || 
        !['detergent', 'softener', 'stain-remover'].includes(item.category)) {
      return res.status(404).json({ message: 'Product not available' });
    }

    const product = {
      id: item._id,
      name: item.itemName,
      description: item.notes || `Premium ${item.itemName.toLowerCase()} for your laundry needs`,
      price: item.pricePerUnit,
      category: item.category,
      unit: item.unit,
      availability: item.status === 'in-stock' ? 'In Stock' : 'Low Stock',
      image: getProductImage(item.category),
      rating: getRatingForCategory(item.category)
    };

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to get product image based on category
function getProductImage(category) {
  const images = {
    'detergent': '🧼',
    'softener': '🧴',
    'stain-remover': '🧽',
    'packaging': '📦',
    'equipment': '⚙️',
    'other': '🛍️'
  };
  return images[category] || '🛍️';
}

// Helper function to get rating based on category
function getRatingForCategory(category) {
  const ratings = {
    'detergent': 4.8,
    'softener': 4.7,
    'stain-remover': 4.9,
    'packaging': 4.5,
    'equipment': 4.6,
    'other': 4.4
  };
  return ratings[category] || 4.5;
}

module.exports = router;