const mongoose = require('mongoose');
const Inventory = require('./src/models/Inventory');
require('dotenv').config();

const seedExpandedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry-booking');
    console.log('Connected to MongoDB');

    const expandedProducts = [
      // Laundry Accessories
      {
        itemName: 'Premium Mesh Laundry Bag',
        category: 'laundry-bag',
        pricePerUnit: 199,
        currentStock: 100,
        minStockLevel: 10,
        unit: 'piece',
        notes: 'Durable mesh bag to protect delicate fabrics during wash.',
        image: 'laundry-bag.png',
        rating: 4.8
      },
      {
        itemName: 'Luxury Wooden Hangers (Set of 10)',
        category: 'hanger',
        pricePerUnit: 599,
        currentStock: 40,
        minStockLevel: 5,
        unit: 'box',
        notes: 'High-quality polished wooden hangers for your finest garments.',
        image: 'hanger', // Placeholder icon
        rating: 4.7
      },
      {
        itemName: 'Clear Garment Cover',
        category: 'garment-cover',
        pricePerUnit: 149,
        currentStock: 150,
        minStockLevel: 20,
        unit: 'piece',
        notes: 'Transparent dust-proof covers for suits and dresses.',
        image: 'cover', // Placeholder icon
        rating: 4.6
      },
      // Fabric & Clothing Items
      {
        itemName: 'Egyptian Cotton Bedsheet Set',
        category: 'bedsheet',
        pricePerUnit: 1299,
        currentStock: 25,
        minStockLevel: 5,
        unit: 'piece',
        notes: 'Ultra-soft, high thread count Egyptian cotton for a hotel-like feel.',
        image: 'bedsheet', // Placeholder icon
        rating: 4.9
      },
      {
        itemName: 'Premium Microfiber Towel',
        category: 'towel',
        pricePerUnit: 349,
        currentStock: 80,
        minStockLevel: 10,
        unit: 'piece',
        notes: 'High-absorbency, quick-dry microfiber towel.',
        image: 'towel', // Placeholder icon
        rating: 4.8
      },
      {
        itemName: 'Blackout Window Curtains',
        category: 'curtain',
        pricePerUnit: 899,
        currentStock: 30,
        minStockLevel: 5,
        unit: 'piece',
        notes: 'Elegant blackout curtains for better sleep and privacy.',
        image: 'curtain', // Placeholder icon
        rating: 4.7
      },
      {
        itemName: 'Formal Staff Uniform',
        category: 'uniform',
        pricePerUnit: 749,
        currentStock: 45,
        minStockLevel: 10,
        unit: 'piece',
        notes: 'Professional-grade formal uniform for laundry and hospitality staff.',
        image: 'uniform', // Placeholder icon
        rating: 4.6
      }
    ];

    for (const prod of expandedProducts) {
      const existing = await Inventory.findOne({ itemName: prod.itemName });
      if (existing) {
        await Inventory.updateOne({ _id: existing._id }, { $set: prod });
        console.log(`Updated existing product: ${prod.itemName}`);
      } else {
        await Inventory.create(prod);
        console.log(`Created new product: ${prod.itemName}`);
      }
    }

    console.log('Seeding expanded products completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding expanded products:', error);
    process.exit(1);
  }
};

seedExpandedProducts();
