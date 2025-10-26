const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Settings = require('../models/Settings');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.post('/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  const { name, email, password, role, firebaseUid } = req.body;
  try {
    console.log('Checking if user exists with email:', email);
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', user._id);
      return res.status(400).json({ message: 'User exists' });
    }

    // Create user with Firebase UID if provided
    const userData = { name, email, role };
    if (password) {
      userData.password = password;
    }
    if (firebaseUid) {
      console.log('Firebase UID provided:', firebaseUid);
      userData.firebaseUid = firebaseUid;
    }

    console.log('Creating user with data:', userData);
    user = new User(userData);
    await user.save();
    console.log('User saved successfully:', user._id);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// Get users by role (admin only)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const { role, search, status } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (status) query.isBlocked = status === 'blocked';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single user by ID (admin only)
router.get('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user by ID (admin only)
router.put('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, role, addresses, preferences } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;
    if (addresses) updateData.addresses = addresses;
    if (preferences) updateData.preferences = preferences;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user by ID (admin only)
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Block/Unblock user (admin only)
router.patch('/users/:id/block', protect, isAdmin, async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: isBlocked ? 'User blocked successfully' : 'User unblocked successfully', 
      user 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's order history (admin only)
router.get('/users/:id/orders', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const orders = await Order.find({ 
      $or: [
        { userId: req.params.id },
        { 'customerInfo.email': user.email }
      ]
    })
      .populate('serviceId')
      .populate('deliveryBoyId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get dashboard statistics
router.get('/dashboard/stats', protect, isAdmin, async (req, res) => {
  try {
    // Get total users count (excluding admin@gmail.com)
    const totalCustomers = await User.countDocuments({ 
      email: { $ne: 'admin@gmail.com' } 
    });
    
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Get new customers (registered this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newCustomers = await User.countDocuments({ 
      email: { $ne: 'admin@gmail.com' },
      createdAt: { $gte: startOfMonth }
    });
    
    // Get completed orders today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const completedToday = await Order.countDocuments({
      status: 'delivery-completed',
      updatedAt: { $gte: startOfDay }
    });
    
    // Get today's revenue
    const todayRevenueResult = await Order.aggregate([
      { $match: { 
          status: 'delivery-completed',
          updatedAt: { $gte: startOfDay }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].total : 0;
    
    // Get active orders (not completed or cancelled)
    const activeOrders = await Order.countDocuments({
      status: { $nin: ['delivery-completed', 'cancelled'] }
    });
    
    // Get pending orders
    const pendingOrders = await Order.countDocuments({
      status: 'order-placed'
    });
    
    // Get today's orders
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfDay }
    });
    
    // Calculate growth percentages (simplified for now)
    const orderGrowth = 12.5;
    const revenueGrowth = 18.3;
    const customerGrowth = 8.7;
    
    res.json({
      totalCustomers,
      totalOrders,
      totalRevenue,
      newCustomers,
      completedToday,
      todayRevenue,
      activeOrders,
      pendingOrders,
      todayOrders,
      orderGrowth,
      revenueGrowth,
      customerGrowth
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get business settings
router.get('/settings', protect, isAdmin, async (req, res) => {
  try {
    // Get the first settings document or create default settings
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        businessName: 'WashLab Laundry',
        businessEmail: 'admin@washlab.com',
        businessPhone: '+1 555-0100',
        businessAddress: '123 Business St, City, State 12345',
        timezone: 'America/New_York',
        currency: 'INR',
        language: 'en'
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update business settings
router.put('/settings', protect, isAdmin, async (req, res) => {
  try {
    const { general, notifications, security, payment } = req.body;
    
    // Validate required fields
    if (!general.businessName || !general.businessEmail || !general.businessPhone || !general.businessAddress) {
      return res.status(400).json({ 
        message: 'Business name, email, phone, and address are required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(general.businessEmail)) {
      return res.status(400).json({ 
        message: 'Invalid email format' 
      });
    }
    
    // Validate phone format (simple validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(general.businessPhone.replace(/[\s\-\(\)]/g, ''))) {
      return res.status(400).json({ 
        message: 'Invalid phone number format' 
      });
    }
    
    // Find and update settings
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create new settings if none exist
      settings = new Settings({
        ...general,
        notifications: notifications || {},
        security: security || {},
        payment: payment || {}
      });
    } else {
      // Update existing settings
      Object.assign(settings, {
        ...general,
        notifications: { ...settings.notifications, ...notifications },
        security: { ...settings.security, ...security },
        payment: { ...settings.payment, ...payment }
      });
    }
    
    await settings.save();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
