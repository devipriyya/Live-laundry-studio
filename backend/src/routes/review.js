const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Create a new review
router.post('/', async (req, res) => {
  try {
    const { 
      orderId, 
      rating, 
      serviceQuality, 
      deliverySpeed, 
      customerService, 
      comment, 
      customerInfo 
    } = req.body;

    // Check if order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already submitted for this order' });
    }

    const review = new Review({
      orderId,
      userId: req.user?._id,
      customerInfo: customerInfo || {
        name: order.customerInfo.name,
        email: order.customerInfo.email
      },
      rating,
      serviceQuality: serviceQuality || rating,
      deliverySpeed: deliverySpeed || rating,
      customerService: customerService || rating,
      comment,
      verified: true
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all reviews with pagination and filters
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      rating, 
      sort = '-createdAt' 
    } = req.query;

    let query = { status: 'approved' };
    
    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .populate('orderId', 'orderNumber')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);
    
    // Get average rating
    const stats = await Review.getAverageRating();

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a specific order
router.get('/order/:orderId', async (req, res) => {
  try {
    const review = await Review.findOne({ orderId: req.params.orderId })
      .populate('orderId', 'orderNumber');
    
    if (!review) {
      return res.status(404).json({ message: 'No review found for this order' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews by customer email
router.get('/customer/:email', async (req, res) => {
  try {
    const reviews = await Review.find({ 'customerInfo.email': req.params.email })
      .populate('orderId', 'orderNumber')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get review statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const averageRatings = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          averageServiceQuality: { $avg: '$serviceQuality' },
          averageDeliverySpeed: { $avg: '$deliverySpeed' },
          averageCustomerService: { $avg: '$customerService' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.json({
      ratingDistribution: stats,
      averages: averageRatings[0] || {}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update review (customer can edit their own review)
router.put('/:id', async (req, res) => {
  try {
    const { rating, serviceQuality, deliverySpeed, customerService, comment } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (rating) review.rating = rating;
    if (serviceQuality) review.serviceQuality = serviceQuality;
    if (deliverySpeed) review.deliverySpeed = deliverySpeed;
    if (customerService) review.customerService = customerService;
    if (comment !== undefined) review.comment = comment;

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Respond to review
router.post('/:id/respond', protect, async (req, res) => {
  try {
    const { responseText } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.response = {
      text: responseText,
      respondedBy: req.user._id,
      respondedAt: new Date()
    };

    await review.save();
    await review.populate('response.respondedBy', 'name');
    
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark review as helpful
router.post('/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
