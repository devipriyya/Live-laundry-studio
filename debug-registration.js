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

async function debugRegistration() {
  const email = `testuser${Date.now()}@example.com`;
  console.log('Testing registration with email:', email);
  
  try {
    // Step 1: Try to register via the API
    console.log('\n1. Attempting API registration...');
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Debug Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    console.log('API registration response:', registerResponse.status, registerResponse.data);
    
    // Step 2: Check if user exists in database
    console.log('\n2. Connecting to MongoDB to check user...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ email: email });
    if (user) {
      console.log('User found in database:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });
    } else {
      console.log('User NOT found in database');
      
      // List all users to see what's in the database
      const allUsers = await User.find({}, 'name email role createdAt');
      console.log('All users in database:');
      allUsers.forEach(u => {
        console.log(`- ${u.name} (${u.email}) - ${u.role} - Created: ${u.createdAt}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error during test:', error.response?.data || error.message);
    
    // Even if there's an error, let's still check the database
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0');
      console.log('Connected to MongoDB for error checking');
      
      const allUsers = await User.find({}, 'name email role createdAt');
      console.log('All users in database:');
      allUsers.forEach(u => {
        console.log(`- ${u.name} (${u.email}) - ${u.role} - Created: ${u.createdAt}`);
      });
      
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (dbError) {
      console.error('Database check failed:', dbError.message);
    }
  }
}

debugRegistration();