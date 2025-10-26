const mongoose = require('mongoose');
require('dotenv').config();

// User model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  profilePicture: { type: String },
  role: { type: String, enum: ['customer','admin','delivery'], default: 'customer' },
  isBlocked: { type: Boolean, default: false },
  firebaseUid: { type: String, unique: true, sparse: true },
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

async function listUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/ecowashdb');
    console.log('Connected to MongoDB');

    // List all users
    const users = await User.find({}, 'name email role createdAt');
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role} - Created: ${user.createdAt}`);
    });
    
    console.log(`\nTotal users: ${users.length}`);
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
listUsers();