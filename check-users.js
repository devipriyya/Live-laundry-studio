const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Connect to MongoDB
async function connectDB() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Mongo URI:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

const User = require('./backend/src/models/User');

async function checkUsers() {
  try {
    const connected = await connectDB();
    if (!connected) {
      return;
    }
    
    console.log('Checking users in database...');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user._id}`);
      console.log('---');
    });
    
    // Check specifically for admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`\nFound ${adminUsers.length} admin users:`);
    
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user._id}`);
      console.log('---');
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking users:', error);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
  }
}

checkUsers();