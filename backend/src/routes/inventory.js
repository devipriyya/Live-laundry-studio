const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

// Get all inventory items with filtering and pagination
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const { 
      category, 
      status, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;

    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Inventory.find(query)
      .sort({ itemName: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inventory.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inventory statistics
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const stats = await Inventory.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$currentStock', '$pricePerUnit'] } }
        }
      }
    ]);

    const categoryStats = await Inventory.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$currentStock' }
        }
      }
    ]);

    const lowStockItems = await Inventory.find({ status: 'low-stock' }).count();
    const outOfStockItems = await Inventory.find({ status: 'out-of-stock' }).count();

    res.json({
      statusStats: stats,
      categoryStats,
      lowStockCount: lowStockItems,
      outOfStockCount: outOfStockItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get low stock items
router.get('/low-stock', protect, isAdmin, async (req, res) => {
  try {
    const items = await Inventory.find({ status: 'low-stock' }).sort({ currentStock: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single inventory item
router.get('/:id', protect, isAdmin, async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new inventory item
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update inventory item
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add stock (restock)
router.patch('/:id/add-stock', protect, isAdmin, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.currentStock += quantity;
    item.lastRestocked = new Date();
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Reduce stock (usage)
router.patch('/:id/reduce-stock', protect, isAdmin, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.currentStock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    item.currentStock -= quantity;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete inventory item
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
