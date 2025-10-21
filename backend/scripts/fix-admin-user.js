/**
 * Script to fix or create admin user
 * 
 * Usage:
 *   node scripts/fix-admin-user.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// User Schema (copy from your User model)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  profilePicture: { type: String },
  role: { type: String, enum: ['customer','admin','delivery'], default: 'customer' },
  isBlocked: { type: Boolean, default: false },
  addresses: [{
    type: { type: String, enum: ['Home', 'Office', 'Other'], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' }
  },
  stats: {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    memberSince: { type: Date, default: Date.now }
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// Admin user to create/fix
const adminUser = {
  name: 'Admin User',
  email: 'admin@gmail.com',
  password: 'admin123',
  role: 'admin'
};

// Fix or create admin user
const fixAdminUser = async () => {
  try {
    console.log('\n🔧 Checking Admin User...\n');
    
    // Check if admin user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    
    if (existingUser) {
      console.log(`✅ Admin user found: ${existingUser.name || 'No Name'} (${existingUser.email})`);
      console.log(`🔒 Role: ${existingUser.role}`);
      console.log(`🚫 Blocked: ${existingUser.isBlocked ? 'Yes' : 'No'}`);
      
      // Update missing fields
      let updated = false;
      
      if (!existingUser.name) {
        existingUser.name = adminUser.name;
        updated = true;
      }
      
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        updated = true;
      }
      
      // Hash and update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      existingUser.password = hashedPassword;
      updated = true;
      
      if (updated) {
        await existingUser.save();
        console.log('✅ Admin user updated successfully!');
      }
      
    } else {
      // Create admin user
      console.log('❌ Admin user not found. Creating new admin user...');
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      // Create user
      const user = new User({
        ...adminUser,
        password: hashedPassword
      });
      
      await user.save();
      console.log(`✅ Admin user created: ${adminUser.name} (${adminUser.email})`);
    }
    
    console.log('\n✨ Admin user is ready!\n');
    console.log('📋 Login Credentials:');
    console.log('─────────────────────────────────────');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminUser.password}`);
    console.log('─────────────────────────────────────');
    console.log('\n🎯 You can now login with these credentials!\n');
    
  } catch (err) {
    console.error('❌ Error fixing admin user:', err.message);
    console.error('Error details:', err);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed\n');
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await fixAdminUser();
};

run();