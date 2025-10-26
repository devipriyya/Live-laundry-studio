const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get user profile with order statistics
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate order statistics
    const orderStats = await Order.aggregate([
      {
        $match: {
          userId: req.user.id,
          status: { $ne: 'cancelled' } // Exclude cancelled orders
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Add statistics to user object
    const userData = user.toObject();
    userData.stats = {
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalSpent: orderStats[0]?.totalSpent || 0,
      memberSince: user.createdAt || new Date(),
      loyaltyPoints: Math.floor((orderStats[0]?.totalSpent || 0) / 10), // 1 point per ₹10 spent
      co2Saved: ((orderStats[0]?.totalOrders || 0) * 2.5).toFixed(1), // Estimate 2.5kg CO2 saved per order
      favoriteService: 'Not Available', // Would need additional logic to determine this
      currentTier: getOrderTier(orderStats[0]?.totalSpent || 0)
    };

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to determine user tier based on total spent
function getOrderTier(totalSpent) {
  if (totalSpent >= 5000) return 'Platinum';
  if (totalSpent >= 2000) return 'Gold';
  if (totalSpent >= 500) return 'Silver';
  return 'New Member';
}

// Update user profile
router.put('/', protect, async (req, res) => {
  try {
    const { name, email, phone, addresses, preferences, profilePicture } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user.id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (addresses) updateData.addresses = addresses;
    if (preferences) updateData.preferences = preferences;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user account
router.delete('/', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;