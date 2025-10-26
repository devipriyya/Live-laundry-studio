const mongoose = require('mongoose');
const axios = require('axios');

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

const registerUser = async () => {
  try {
    const email = 'testuser' + Date.now() + '@example.com';
    console.log('Attempting to register user with email:', email);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    console.log('Registration successful:', response.data);
    
    // Connect to MongoDB to verify user was created
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB for verification');
    
    // Check if user exists in database
    const user = await User.findOne({ email: email });
    if (user) {
      console.log('User successfully stored in database:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });
    } else {
      console.log('User NOT found in database');
    }
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    
    // Connect to MongoDB to check what's in the database
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0');
      console.log('Connected to MongoDB for error checking');
      
      const users = await User.find({}, 'name email role createdAt');
      console.log('All users in database:');
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - ${user.role} - Created: ${user.createdAt}`);
      });
      
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (dbError) {
      console.error('Database check failed:', dbError.message);
    }
  }
};

registerUser();