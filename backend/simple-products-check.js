const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const inventorySchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  availability: String,
  image: String,
  rating: Number,
  description: String
});

const Inventory = mongoose.model('Inventory', inventorySchema, 'inventories');

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const count = await Inventory.countDocuments();
    console.log(`Total products: ${count}`);
    
    const categories = await Inventory.distinct('category');
    console.log('Categories found:', categories);
    
    const sample = await Inventory.find().limit(3);
    console.log('Sample products:', JSON.stringify(sample, null, 2));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();
