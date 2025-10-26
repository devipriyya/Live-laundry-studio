const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../src/models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const ensureAdminUser = async () => {
  try {
    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@gmail.com' });
    
    if (adminUser) {
      console.log('Admin user found:', adminUser.email);
      console.log('Current role:', adminUser.role);
      
      // Update role if not admin
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('Admin user role updated to admin');
      } else {
        console.log('Admin user already has admin role');
      }
    } else {
      // Create admin user
      const newUser = new User({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123', // This will be hashed automatically
        role: 'admin'
      });
      
      await newUser.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error);
  }
};

const run = async () => {
  await connectDB();
  await ensureAdminUser();
  process.exit();
};

run();