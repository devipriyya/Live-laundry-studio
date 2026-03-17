const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');
const bcrypt = require('bcryptjs');

// Get all assistants
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const assistants = await User.find({ role: 'assistant' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ assistants });
  } catch (error) {
    console.error('Error fetching assistants:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new assistant
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = new User({
      name,
      email,
      phone,
      password: password || 'Assistant@123',
      role: 'assistant'
    });

    const savedUser = await newUser.save();
    
    // Remove password from response
    const assistant = savedUser.toObject();
    delete assistant.password;

    res.status(201).json({
      message: 'Assistant account created successfully',
      assistant
    });
  } catch (error) {
    console.error('Error creating assistant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an assistant
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, status } = req.body;
    const assistantId = req.params.id;

    const user = await User.findById(assistantId);
    if (!user) {
      return res.status(404).json({ message: 'Assistant not found' });
    }

    if (user.role !== 'assistant') {
      return res.status(400).json({ message: 'User is not an assistant' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.isBlocked = status === 'Inactive';

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();
    const assistant = updatedUser.toObject();
    delete assistant.password;

    res.json({
      message: 'Assistant account updated successfully',
      assistant
    });
  } catch (error) {
    console.error('Error updating assistant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an assistant
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const assistantId = req.params.id;
    const user = await User.findById(assistantId);

    if (!user) {
      return res.status(404).json({ message: 'Assistant not found' });
    }

    if (user.role !== 'assistant') {
      return res.status(400).json({ message: 'User is not an assistant' });
    }

    await User.findByIdAndDelete(assistantId);

    res.json({ message: 'Assistant account deleted successfully' });
  } catch (error) {
    console.error('Error deleting assistant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
