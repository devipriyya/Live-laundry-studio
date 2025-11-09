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
      // If user exists but doesn't have a Firebase UID, and we're trying to register with one,
      // update the user with the Firebase UID
      if (firebaseUid && !user.firebaseUid) {
        console.log('Updating existing user with Firebase UID:', firebaseUid);
        user.firebaseUid = firebaseUid;
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
      }
      // If user exists and we're not providing a Firebase UID, or user already has one,
      // return appropriate message
      return res.status(400).json({ message: 'User already exists. Please login instead.' });
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

// New route for Firebase login
router.post('/firebase-login', async (req, res) => {
  const { uid, email, name } = req.body;
  try {
    // Check if user exists with Firebase UID
    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      // Check if user exists with email
      user = await User.findOne({ email });
      if (user) {
        // Update existing user with Firebase UID
        user.firebaseUid = uid;
        await user.save();
      } else {
        // Create new user
        user = new User({
          name: name || email?.split('@')[0],
          email: email,
          firebaseUid: uid,
          role: 'customer'
        });
        await user.save();
      }
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Firebase login - Generated token:', token);
    console.log('Firebase login - User ID:', user._id);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Firebase login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
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

// Admin: Export all users as CSV
router.get('/users/export/csv', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: 'admin@gmail.com' } })
      .select('-password')
      .sort({ createdAt: -1 });

    // Create CSV header
    const csvHeader = 'Name,Email,Phone,Role,Status,Total Orders,Total Spent,Member Since\n';
    
    // Create CSV rows
    const csvRows = users.map(user => {
      const totalOrders = user.stats?.totalOrders || 0;
      const totalSpent = user.stats?.totalSpent || 0;
      const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '';
      const status = user.isBlocked ? 'Blocked' : 'Active';
      
      // Escape fields that might contain commas
      return [
        `"${user.name || ''}"`,
        `"${user.email || ''}"`,
        `"${user.phone || ''}"`,
        `"${user.role || ''}"`,
        `"${status}"`,
        `"${totalOrders}"`,
        `"${totalSpent.toFixed(2)}"`,
        `"${memberSince}"`
      ].join(',');
    });

    const csvContent = csvHeader + csvRows.join('\n');

    // Set headers for CSV download
    res.header('Content-Type', 'text/csv');
    res.attachment('customers-export.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error exporting customers as CSV:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Export all users as PDF
router.get('/users/export/pdf', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: 'admin@gmail.com' } })
      .select('-password')
      .sort({ createdAt: -1 });

    // Import PDFKit dynamically
    const PDFDocument = require('pdfkit');
    
    // Create a document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=customers-export.pdf');
    
    // Pipe the PDF into the response
    doc.pipe(res);

    // Add company header with business details
    doc.fontSize(24).font('Helvetica-Bold').text('FABRICO LAUNDRY SERVICES', { align: 'center' });
    doc.fontSize(12).font('Helvetica')
      .text('123 Business Avenue, Commercial District', { align: 'center' })
      .text('Mumbai, Maharashtra 400001', { align: 'center' })
      .text('Phone: +91 98765 43210 | Email: info@fabrico.in', { align: 'center' })
      .text('GSTIN: 27AABCF1234L1Z5', { align: 'center' });
    
    // Add a line separator
    doc.moveTo(50, doc.y + 20)
       .lineTo(550, doc.y + 20)
       .stroke();

    // Report title
    doc.moveDown()
       .fontSize(18).font('Helvetica-Bold')
       .text('Customer Management Report', { align: 'center' });
    
    // Report date
    doc.fontSize(12).font('Helvetica')
       .text(`Generated on: ${new Date().toLocaleDateString('en-IN', { 
         day: '2-digit', 
         month: 'long', 
         year: 'numeric' 
       })}`, { align: 'center' });
    
    // Add a line separator
    doc.moveTo(50, doc.y + 20)
       .lineTo(550, doc.y + 20)
       .stroke();

    // Summary section with better formatting
    doc.moveDown()
       .fontSize(12);
    
    const totalCustomers = users.length;
    const activeCustomers = users.filter(user => !user.isBlocked).length;
    const blockedCustomers = totalCustomers - activeCustomers;
    const totalOrders = users.reduce((sum, user) => sum + (user.stats?.totalOrders || 0), 0);
    const totalRevenue = users.reduce((sum, user) => sum + (user.stats?.totalSpent || 0), 0);
    
    // Create a summary table-like structure
    doc.font('Helvetica-Bold').text('Summary Statistics:');
    doc.moveDown(0.5);
    
    // Summary details in a structured format
    doc.font('Helvetica')
       .text(`• Total Customers:     ${totalCustomers}`)
       .text(`• Active Customers:    ${activeCustomers}`)
       .text(`• Blocked Customers:   ${blockedCustomers}`)
       .text(`• Total Orders:        ${totalOrders}`)
       .text(`• Total Revenue:       ₹${totalRevenue.toFixed(2)}`);
    
    // Add a line separator before the customer table
    doc.moveTo(50, doc.y + 20)
       .lineTo(550, doc.y + 20)
       .stroke();

    // Check if there are customers to display
    if (users.length === 0) {
      doc.moveDown()
         .fontSize(12).text('No customers found.', { align: 'center' });
      doc.end();
      return;
    }

    // Customer table with improved structure
    doc.moveDown()
       .fontSize(14).font('Helvetica-Bold')
       .text('Customer Details', { align: 'center' });
    
    doc.moveDown();
    
    // Table headers with better styling
    const tableTop = doc.y;
    const rowHeight = 25;
    const startX = 50;
    const columnWidths = [90, 120, 80, 60, 60, 50, 60]; // Adjusted widths for better fit
    
    // Header row with background
    doc.rect(startX, tableTop, 500, rowHeight).fill('#f0f0f0');
    doc.fillColor('black').fontSize(10).font('Helvetica-Bold');
    
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Orders', 'Spent (₹)'];
    let currentX = startX + 5; // Add some padding
    
    headers.forEach((header, i) => {
      doc.text(header, currentX, tableTop + 8);
      currentX += columnWidths[i];
    });
    
    doc.font('Helvetica');

    // Draw table rows with alternating colors
    let y = tableTop + rowHeight;
    let isEvenRow = false;
    
    for (const user of users) {
      if (y > 750) { // Create new page if needed
        doc.addPage({ margin: 50 });
        y = 50;
        
        // Re-add headers on new page
        doc.rect(startX, y, 500, rowHeight).fill('#f0f0f0');
        doc.fillColor('black').fontSize(10).font('Helvetica-Bold');
        
        currentX = startX + 5;
        headers.forEach((header, i) => {
          doc.text(header, currentX, y + 8);
          currentX += columnWidths[i];
        });
        
        doc.font('Helvetica');
        y += rowHeight;
      }
      
      // Alternate row colors
      if (isEvenRow) {
        doc.rect(startX, y, 500, rowHeight).fill('#f8f8f8');
        doc.fillColor('black');
      }
      
      const totalOrders = user.stats?.totalOrders || 0;
      const totalSpent = user.stats?.totalSpent ? user.stats.totalSpent.toFixed(2) : '0.00';
      const status = user.isBlocked ? 'Blocked' : 'Active';
      const role = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A';
      
      // Add data to the row
      doc.fontSize(9);
      currentX = startX + 5;
      
      doc.text(user.name || 'N/A', currentX, y + 8);
      currentX += columnWidths[0];
      
      doc.text(user.email || 'N/A', currentX, y + 8);
      currentX += columnWidths[1];
      
      doc.text(user.phone || 'N/A', currentX, y + 8);
      currentX += columnWidths[2];
      
      doc.text(role, currentX, y + 8);
      currentX += columnWidths[3];
      
      doc.text(status, currentX, y + 8);
      currentX += columnWidths[4];
      
      doc.text(totalOrders.toString(), currentX, y + 8);
      currentX += columnWidths[5];
      
      doc.text(`₹${totalSpent}`, currentX, y + 8);
      
      y += rowHeight;
      isEvenRow = !isEvenRow;
    }

    // Add footer with page number
    doc.fontSize(10).font('Helvetica')
       .text(`Page 1`, 500, 800, { align: 'right' });

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Error exporting customers as PDF:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
