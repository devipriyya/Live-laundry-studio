const mongoose = require('mongoose');

async function simpleCheck() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect('mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('Connected to MongoDB successfully');
    
    // Define a simple user schema to check the collection
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      role: String
    }, { collection: 'users' });
    
    const User = mongoose.model('UserCheck', userSchema);
    
    // Check if jeevaa@gmail.com exists
    const jeevaaUser = await User.findOne({ email: "jeevaa@gmail.com" });
    if (jeevaaUser) {
      console.log(`Found user with email jeevaa@gmail.com: ${jeevaaUser.name}`);
    } else {
      console.log('No user found with email jeevaa@gmail.com');
    }
    
    // Get total count
    try {
      const count = await User.countDocuments();
      console.log(`Total users in database: ${count}`);
    } catch (countError) {
      console.log('Could not get user count:', countError.message);
    }
    
    mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Connection error:', error.message);
  }
}

simpleCheck();