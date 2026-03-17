const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

// Get all staff members
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const staffMembers = await User.find({ role: 'staff' })
      .select('-password')
      .sort({ createdAt: -1 });

    const formattedStaff = staffMembers.map(s => ({
      id: s._id,
      name: s.name,
      email: s.email,
      phone: s.phone || '',
      role: s.staffInfo?.designation || 'Staff',
      department: s.staffInfo?.department || '',
      status: s.isBlocked ? 'Inactive' : 'Active',
      hireDate: s.staffInfo?.hireDate || s.createdAt,
      salary: s.staffInfo?.salary || 0,
      address: s.staffInfo?.address || '',
      emergencyContact: s.staffInfo?.emergencyContact || '',
      skills: s.staffInfo?.skills || [],
      gender: s.staffInfo?.gender || '',
      shift: s.staffInfo?.shift || 'Morning',
      experience: s.staffInfo?.experience || '',
      idType: s.staffInfo?.idType || '',
      idNumber: s.staffInfo?.idNumber || '',
      rating: s.staffInfo?.rating || 0,
      completedOrders: s.staffInfo?.completedOrders || 0,
      performance: {
        efficiency: 0,
        onTimeDelivery: 0,
        customerSatisfaction: 0,
        tasksCompleted: s.staffInfo?.completedOrders || 0,
        avgCompletionTime: '0 hours',
        qualityScore: 0
      },
      schedule: {
        monday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
        tuesday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
        wednesday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
        thursday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
        friday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
        saturday: 'Off',
        sunday: 'Off'
      }
    }));

    res.json({ staff: formattedStaff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new staff member
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, role: designation, department, status, hireDate, salary, address, emergencyContact, skills, gender, shift, experience, idType, idNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = new User({
      name,
      email,
      phone,
      password: password || 'Staff@123',
      role: 'staff',
      isBlocked: status === 'Inactive',
      staffInfo: {
        designation: designation || 'Staff',
        department,
        salary: salary || 0,
        hireDate: hireDate || new Date(),
        address,
        emergencyContact,
        skills: skills || [],
        gender,
        shift,
        experience,
        idType,
        idNumber,
        rating: 0,
        completedOrders: 0
      }
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'Staff member created successfully',
      staff: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.staffInfo.designation,
        department: savedUser.staffInfo.department,
        status: savedUser.isBlocked ? 'Inactive' : 'Active',
        hireDate: savedUser.staffInfo.hireDate,
        salary: savedUser.staffInfo.salary,
        address: savedUser.staffInfo.address,
        emergencyContact: savedUser.staffInfo.emergencyContact,
        skills: savedUser.staffInfo.skills,
        gender: savedUser.staffInfo.gender,
        shift: savedUser.staffInfo.shift,
        experience: savedUser.staffInfo.experience,
        idType: savedUser.staffInfo.idType,
        idNumber: savedUser.staffInfo.idNumber,
        rating: 0,
        completedOrders: 0,
        performance: {
          efficiency: 0,
          onTimeDelivery: 0,
          customerSatisfaction: 0,
          tasksCompleted: 0,
          avgCompletionTime: '0 hours',
          qualityScore: 0
        }
      }
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a staff member
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, role: designation, department, status, hireDate, salary, address, emergencyContact, skills, gender, shift, experience, idType, idNumber } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    if (user.role !== 'staff') {
      return res.status(400).json({ message: 'User is not a staff member' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.isBlocked = status === 'Inactive';

    if (!user.staffInfo) {
      user.staffInfo = {};
    }

    user.staffInfo.designation = designation || user.staffInfo.designation;
    user.staffInfo.department = department || user.staffInfo.department;
    user.staffInfo.salary = salary !== undefined ? salary : user.staffInfo.salary;
    user.staffInfo.hireDate = hireDate || user.staffInfo.hireDate;
    user.staffInfo.address = address || user.staffInfo.address;
    user.staffInfo.emergencyContact = emergencyContact || user.staffInfo.emergencyContact;
    user.staffInfo.skills = skills || user.staffInfo.skills;
    user.staffInfo.gender = gender || user.staffInfo.gender;
    user.staffInfo.shift = shift || user.staffInfo.shift;
    user.staffInfo.experience = experience || user.staffInfo.experience;
    user.staffInfo.idType = idType || user.staffInfo.idType;
    user.staffInfo.idNumber = idNumber || user.staffInfo.idNumber;

    const updatedUser = await user.save();

    res.json({
      message: 'Staff member updated successfully',
      staff: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.staffInfo.designation,
        department: updatedUser.staffInfo.department,
        status: updatedUser.isBlocked ? 'Inactive' : 'Active',
        hireDate: updatedUser.staffInfo.hireDate,
        salary: updatedUser.staffInfo.salary,
        address: updatedUser.staffInfo.address,
        emergencyContact: updatedUser.staffInfo.emergencyContact,
        skills: updatedUser.staffInfo.skills,
        gender: updatedUser.staffInfo.gender,
        shift: updatedUser.staffInfo.shift,
        experience: updatedUser.staffInfo.experience,
        idType: updatedUser.staffInfo.idType,
        idNumber: updatedUser.staffInfo.idNumber,
        rating: updatedUser.staffInfo.rating,
        completedOrders: updatedUser.staffInfo.completedOrders
      }
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a staff member
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    if (user.role !== 'staff') {
      return res.status(400).json({ message: 'User is not a staff member' });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
