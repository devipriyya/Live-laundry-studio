const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');
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

// Get reviews for a specific product
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ 'items.productId': req.params.id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a review for a product (requires authentication)
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if product exists
    const product = await Inventory.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      'items.productId': productId,
      userId: req.user._id
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    
    // Create review
    const review = new Review({
      userId: req.user._id,
      customerInfo: {
        name: req.user.name,
        email: req.user.email
      },
      rating,
      comment,
      items: [{
        productId: product._id,
        productName: product.itemName
      }]
    });
    
    await review.save();
    
    // Update product rating (simplified approach)
    // In a real implementation, you would recalculate the average
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;