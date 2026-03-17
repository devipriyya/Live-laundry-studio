const express = require('express');
const router = express.Router();
const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get user's loyalty summary and history
router.get('/summary', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's current balance
    const user = await User.findById(userId).select('stats.loyaltyPoints');
    
    // Get transaction history
    const transactions = await LoyaltyTransaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);
      
    res.json({
      balance: user.stats?.loyaltyPoints || 0,
      transactions
    });
  } catch (error) {
    console.error('Error fetching loyalty summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed transaction history with pagination
router.get('/history', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;
    
    const transactions = await LoyaltyTransaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await LoyaltyTransaction.countDocuments({ userId });
    
    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching loyalty history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
