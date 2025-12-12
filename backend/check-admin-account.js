// Script to check admin account in the database
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  firebaseUid: String,
  isBlocked: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

async function checkAdminAccount() {
  try {
    console.log('=== CHECKING ADMIN ACCOUNT ===\n');
    
    // Look for the admin account
    const adminUser = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!adminUser) {
      console.log('❌ Admin account not found in database');
      return;
    }
    
    console.log('✅ Admin account found in database');
    console.log('Email:', adminUser.email);
    console.log('Name:', adminUser.name);
    console.log('Role:', adminUser.role);
    console.log('Is Blocked:', adminUser.isBlocked);
    console.log('Has Password:', !!adminUser.password);
    console.log('Firebase UID:', adminUser.firebaseUid || 'Not set');
    
  } catch (error) {
    console.log('❌ Error checking admin account:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkAdminAccount();