const express = require('express');
const router = express.Router();
const Advertisement = require('../models/Advertisement');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

// @route   GET /api/advertisements
// @desc    Get active advertisements for users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    const advertisements = await Advertisement.find({
      isActive: true,
      expiryDate: { $gte: today },
      startDate: { $lte: today }
    }).sort({ createdAt: -1 });

    res.json({ success: true, advertisements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/advertisements/admin
// @desc    Get all advertisements (Admin Only)
// @access  Private/Admin
router.get('/admin', protect, isAdmin, async (req, res) => {
  try {
    const advertisements = await Advertisement.find().sort({ createdAt: -1 });
    res.json({ success: true, advertisements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/advertisements
// @desc    Create a new advertisement (Admin Only)
// @access  Private/Admin
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl, businessName, offerText, startDate, expiryDate, isActive } = req.body;

    const advertisement = new Advertisement({
      title,
      description,
      imageUrl,
      businessName,
      offerText,
      startDate,
      expiryDate,
      isActive
    });

    await advertisement.save();
    res.status(201).json({ success: true, advertisement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/advertisements/:id
// @desc    Update an advertisement (Admin Only)
// @access  Private/Admin
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl, businessName, offerText, startDate, expiryDate, isActive } = req.body;
    
    const advertisement = await Advertisement.findById(req.params.id);
    if (!advertisement) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    if (title) advertisement.title = title;
    if (description) advertisement.description = description;
    if (imageUrl) advertisement.imageUrl = imageUrl;
    if (businessName) advertisement.businessName = businessName;
    if (offerText !== undefined) advertisement.offerText = offerText;
    if (startDate) advertisement.startDate = startDate;
    if (expiryDate) advertisement.expiryDate = expiryDate;
    if (isActive !== undefined) advertisement.isActive = isActive;

    await advertisement.save();
    res.json({ success: true, advertisement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/advertisements/:id
// @desc    Delete an advertisement (Admin Only)
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const advertisement = await Advertisement.findByIdAndDelete(req.params.id);
    if (!advertisement) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }
    res.json({ success: true, message: 'Advertisement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
