const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

// @route   GET /api/coupons
// @desc    Get all coupons (Admin Only)
// @access  Private/Admin
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/coupons
// @desc    Create a new coupon (Admin Only)
// @access  Private/Admin
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiryDate, isActive } = req.body;
    
    // Check if code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      minOrderAmount,
      expiryDate,
      isActive
    });

    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/coupons/:id
// @desc    Update a coupon (Admin Only)
// @access  Private/Admin
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiryDate, isActive } = req.body;
    
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    if (code) coupon.code = code.toUpperCase();
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
    if (expiryDate) coupon.expiryDate = expiryDate;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();
    res.json({ success: true, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete a coupon (Admin Only)
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
