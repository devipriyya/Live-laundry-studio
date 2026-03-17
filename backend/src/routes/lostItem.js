const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const { protect } = require('../middleware/auth');
const { isAdminOrAssistant } = require('../middleware/role');

// @desc    Create a lost item report
// @route   POST /api/lost-items
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, itemName, description } = req.body;

    const lostItem = new LostItem({
      user: req.user._id,
      orderId,
      itemName,
      description
    });

    const savedItem = await lostItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get current user's lost item reports
// @route   GET /api/lost-items/my-reports
// @access  Private
router.get('/my-reports', protect, async (req, res) => {
  try {
    const reports = await LostItem.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all lost item reports (Admin/Assistant)
// @route   GET /api/lost-items
// @access  Private (Admin/Assistant)
router.get('/', protect, isAdminOrAssistant, async (req, res) => {
  try {
    const reports = await LostItem.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update lost item report status (Admin/Assistant)
// @route   PATCH /api/lost-items/:id
// @access  Private (Admin/Assistant)
router.patch('/:id', protect, isAdminOrAssistant, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (status) lostItem.status = status;
    if (adminNotes) lostItem.adminNotes = adminNotes;
    
    if (status === 'Returned' || status === 'Item Found') {
      lostItem.resolvedAt = new Date();
    }

    const updatedItem = await lostItem.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
