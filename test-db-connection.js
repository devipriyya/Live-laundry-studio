const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: './backend/.env' });

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Try to access orders collection
    const Order = mongoose.model('Order', new mongoose.Schema({}), 'orders');
    const orderCount = await Order.countDocuments();
    console.log(`Total orders in database: ${orderCount}`);
    
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Error details:', err);
  }
};

connectDB();