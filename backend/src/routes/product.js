const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');
// Removed protect middleware since products should be publicly accessible

const FALLBACK_PRODUCTS = [
  {
    id: 'demo-1',
    name: 'Premium Liquid Detergent',
    description: 'High-efficiency liquid detergent with a fresh ocean breeze scent.',
    price: 249,
    category: 'Detergent',
    unit: 'liter',
    availability: 'In Stock',
    image: '/uploads/premium_detergent.png',
    rating: 4.8
  },
  {
    id: 'demo-2',
    name: 'Lavender Fabric Softener',
    description: 'Leaves clothes feeling soft and smelling of fresh lavender fields.',
    price: 189,
    category: 'Softener',
    unit: 'liter',
    availability: 'In Stock',
    image: '/uploads/lavender_softener.png',
    rating: 4.7
  },
  {
    id: 'demo-3',
    name: 'Eco-Friendly Stain Remover',
    description: 'Tough on stains, gentle on the planet. Non-toxic formula.',
    price: 129,
    category: 'Stain Remover',
    unit: 'piece',
    availability: 'In Stock',
    image: '/uploads/stain_remover.png',
    rating: 4.6
  },
  {
    id: 'demo-4',
    name: 'Mesh Laundry Bag (Set of 3)',
    description: 'Protects delicate garments during washing. Durable mesh design.',
    price: 199,
    category: 'Laundry Bag',
    unit: 'pkg',
    availability: 'In Stock',
    image: '/uploads/laundry_bag.png',
    rating: 4.5
  },
  {
    id: 'demo-5',
    name: 'Velvet Garment Hangers',
    description: 'Non-slip velvet surface keeps clothes in place. Set of 10.',
    price: 349,
    category: 'Hanger',
    unit: 'pkg',
    availability: 'In Stock',
    image: '/uploads/hangers.png',
    rating: 4.9
  }
];

// Get all products available for customers (no authentication required)
router.get('/', async (req, res) => {
  try {
    // Only get items that are in stock and are customer-facing categories
    const query = {
      status: { $in: ['in-stock', 'low-stock'] }
    };

    const items = await Inventory.find(query)
      .populate({
        path: 'category',
        match: { isActive: true }
      })
      .sort({ itemName: 1 });

    // Filter out items where category didn't match (e.g., inactive or missing)
    const validItems = items.filter(item => item.category);

    // Transform inventory items to customer-facing product format
    let products = validItems.map(item => ({
      id: item._id,
      name: item.itemName,
      description: item.notes || `Premium ${item.itemName.toLowerCase()} for your laundry needs`,
      price: item.pricePerUnit,
      category: item.category.name,
      categoryId: item.category._id,
      unit: item.unit,
      availability: item.status === 'in-stock' ? 'In Stock' : 'Low Stock',
      image: item.image,
      rating: item.rating
    }));

    // If no products available in DB, return demo products
    if (products.length === 0) {
      console.log('No products found in database, returning demo fallback');
      products = FALLBACK_PRODUCTS;
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product by ID (no authentication required)
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate('category');
    
    if (!item || !item.category || !item.category.isActive) {
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }

    // Check if product is available for customers
    if (!['in-stock', 'low-stock'].includes(item.status)) {
      return res.status(404).json({ message: 'Product not available' });
    }

    const product = {
      id: item._id,
      name: item.itemName,
      description: item.notes || `Premium ${item.itemName.toLowerCase()} for your laundry needs`,
      price: item.pricePerUnit,
      category: item.category.name,
      categoryId: item.category._id,
      unit: item.unit,
      availability: item.status === 'in-stock' ? 'In Stock' : 'Low Stock',
      image: item.image,
      rating: item.rating
    };

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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