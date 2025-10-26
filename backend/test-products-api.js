const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

// Import the Inventory model
const Inventory = require('./src/models/Inventory');

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Test the products query
const testProductsQuery = async () => {
  try {
    await connectDB();
    
    // Check all inventory items
    const allItems = await Inventory.find({});
    console.log('All inventory items:', allItems.length);
    console.log(allItems.map(item => ({
      id: item._id,
      name: item.itemName,
      category: item.category,
      status: item.status,
      price: item.pricePerUnit
    })));
    
    // Check items that match our product criteria
    const query = {
      status: { $in: ['in-stock', 'low-stock'] },
      category: { $in: ['detergent', 'softener', 'stain-remover'] }
    };
    
    const products = await Inventory.find(query);
    console.log('\nMatching products for customer display:', products.length);
    console.log(products.map(item => ({
      id: item._id,
      name: item.itemName,
      category: item.category,
      status: item.status,
      price: item.pricePerUnit
    })));
    
    // If no matching products, show what categories and statuses exist
    if (products.length === 0) {
      console.log('\nNo matching products found. Checking available categories and statuses:');
      
      const categories = await Inventory.distinct('category');
      console.log('Available categories:', categories);
      
      const statuses = await Inventory.distinct('status');
      console.log('Available statuses:', statuses);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testProductsQuery();