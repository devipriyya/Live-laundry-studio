const mongoose = require('mongoose');

async function checkDatabase() {
  try {
    await mongoose.connect('mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB');
    
    // Use the User model from our application
    const User = require('./backend/src/models/User');
    
    // Count total users
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);
    
    // Get a few sample users
    const sampleUsers = await User.find({}, 'name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log('\nRecent users:');
    sampleUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role} - ${user.createdAt}`);
    });
    
    // Check if jeevaa@gmail.com exists
    const jeevaaUser = await User.findOne({ email: "jeevaa@gmail.com" });
    if (jeevaaUser) {
      console.log(`\nFound user with email jeevaa@gmail.com: ${jeevaaUser.name}`);
    } else {
      console.log('\nNo user found with email jeevaa@gmail.com');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDatabase();