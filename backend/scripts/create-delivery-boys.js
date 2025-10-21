/**
 * Script to create delivery staff accounts
 * 
 * Usage:
 *   node scripts/create-delivery-boys.js
 * 
 * This will create 3 sample delivery staff accounts in your database
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

// Delivery staff to create
const deliveryBoys = [
  {
    name: 'Mike Johnson',
    email: 'mike.delivery@fabrico.com',
    password: 'delivery123',
    phone: '+1 (555) 123-4567',
    role: 'delivery'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.delivery@fabrico.com',
    password: 'delivery123',
    phone: '+1 (555) 234-5678',
    role: 'delivery'
  },
  {
    name: 'Tom Parker',
    email: 'tom.delivery@fabrico.com',
    password: 'delivery123',
    phone: '+1 (555) 345-6789',
    role: 'delivery'
  }
];

// Create delivery staff
const createDeliveryBoys = async () => {
  try {
    console.log('\n🚚 Creating Delivery Staff Accounts...\n');
    
    for (const deliveryBoy of deliveryBoys) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: deliveryBoy.email });
      
      if (existingUser) {
        console.log(`⚠️  User already exists: ${deliveryBoy.email}`);
        continue;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(deliveryBoy.password, salt);
      
      // Create user
      const user = new User({
        ...deliveryBoy,
        password: hashedPassword
      });
      
      await user.save();
      
      console.log(`✅ Created: ${deliveryBoy.name} (${deliveryBoy.email})`);
    }
    
    console.log('\n✨ All delivery staff created successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('─────────────────────────────────────');
    deliveryBoys.forEach(db => {
      console.log(`   Email: ${db.email}`);
      console.log(`   Password: ${db.password}`);
      console.log('─────────────────────────────────────');
    });
    console.log('\n🎯 You can now login with any of these accounts!\n');
    
  } catch (err) {
    console.error('❌ Error creating delivery staff:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed\n');
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await createDeliveryBoys();
};

run();
