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

// Sample products data
const sampleProducts = [
  {
    itemName: 'Premium Fabric Softener',
    category: 'softener',
    sku: 'FS-001',
    currentStock: 50,
    minStockLevel: 10,
    maxStockLevel: 100,
    unit: 'liter',
    pricePerUnit: 299,
    supplier: {
      name: 'EcoCare Solutions',
      contact: 'John Smith',
      email: 'john@ecocare.com'
    },
    notes: 'Long-lasting freshness for all fabrics with eco-friendly formula'
  },
  {
    itemName: 'Stain Remover Pro',
    category: 'stain-remover',
    sku: 'SR-001',
    currentStock: 30,
    minStockLevel: 5,
    maxStockLevel: 50,
    unit: 'piece',
    pricePerUnit: 199,
    supplier: {
      name: 'CleanTech Industries',
      contact: 'Sarah Johnson',
      email: 'sarah@cleantech.com'
    },
    notes: 'Removes tough stains instantly with natural enzymes'
  },
  {
    itemName: 'Concentrated Detergent',
    category: 'detergent',
    sku: 'DT-001',
    currentStock: 100,
    minStockLevel: 20,
    maxStockLevel: 200,
    unit: 'liter',
    pricePerUnit: 399,
    supplier: {
      name: 'PureClean Ltd',
      contact: 'Mike Wilson',
      email: 'mike@pureclean.com'
    },
    notes: 'Eco-friendly concentrated formula for superior cleaning'
  },
  {
    itemName: 'Fabric Protector Spray',
    category: 'softener',
    sku: 'FS-002',
    currentStock: 25,
    minStockLevel: 5,
    maxStockLevel: 50,
    unit: 'piece',
    pricePerUnit: 249,
    supplier: {
      name: 'EcoCare Solutions',
      contact: 'John Smith',
      email: 'john@ecocare.com'
    },
    notes: 'Protects against stains and odors with natural ingredients'
  }
];

// Create sample products
const createSampleProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products in the categories we're using (optional)
    // await Inventory.deleteMany({ category: { $in: ['detergent', 'softener', 'stain-remover'] } });
    
    // Insert sample products
    for (const product of sampleProducts) {
      try {
        const existing = await Inventory.findOne({ sku: product.sku });
        if (existing) {
          console.log(`Product with SKU ${product.sku} already exists, skipping...`);
          continue;
        }
        
        const newProduct = new Inventory(product);
        await newProduct.save();
        console.log(`Created product: ${newProduct.itemName}`);
      } catch (error) {
        console.error(`Error creating product ${product.itemName}:`, error.message);
      }
    }
    
    console.log('Sample products creation completed!');
    
    // Verify the products were created
    const products = await Inventory.find({
      category: { $in: ['detergent', 'softener', 'stain-remover'] }
    });
    
    console.log(`\nTotal products available: ${products.length}`);
    products.forEach(product => {
      console.log(`- ${product.itemName} (${product.category}) - ₹${product.pricePerUnit} (${product.status})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createSampleProducts();