const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// User model exactly as defined in the backend
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

async function verifyUserStorage() {
  console.log('Verifying user storage in database...');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB');
    
    // Count total users
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);
    
    // Get recent users
    const recentUsers = await User.find({}, 'name email role createdAt firebaseUid')
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log('\nRecent users:');
    recentUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role} - Created: ${user.createdAt}`);
      if (user.firebaseUid) {
        console.log(`   Firebase UID: ${user.firebaseUid}`);
      }
    });
    
    // Check if there are any users with Firebase UIDs
    const usersWithFirebaseUid = await User.countDocuments({ firebaseUid: { $exists: true, $ne: null } });
    console.log(`\nUsers with Firebase UIDs: ${usersWithFirebaseUid}`);
    
    // Check if there are any users without Firebase UIDs
    const usersWithoutFirebaseUid = await User.countDocuments({ 
      $or: [
        { firebaseUid: { $exists: false } },
        { firebaseUid: null }
      ]
    });
    console.log(`Users without Firebase UIDs: ${usersWithoutFirebaseUid}`);
    
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error verifying user storage:', error.message);
  }
}

verifyUserStorage();