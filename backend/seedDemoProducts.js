const mongoose = require('mongoose');
require('dotenv').config();
const Inventory = require('./src/models/Inventory');

const DEMO_PRODUCTS = [
  {
    itemName: 'Premium Liquid Detergent',
    category: '69b987ed585bffc359e7c143', // Detergent
    pricePerUnit: 249,
    unit: 'liter',
    currentStock: 50,
    minStockLevel: 10,
    maxStockLevel: 100,
    notes: 'High-efficiency liquid detergent with a fresh ocean breeze scent.',
    image: '/uploads/premium_detergent.png',
    rating: 4.8
  },
  {
    itemName: 'Lavender Fabric Softener',
    category: '69b987ed585bffc359e7c147', // Softener
    pricePerUnit: 189,
    unit: 'liter',
    currentStock: 40,
    minStockLevel: 5,
    maxStockLevel: 80,
    notes: 'Leaves clothes feeling soft and smelling of fresh lavender fields.',
    image: '/uploads/lavender_softener.png',
    rating: 4.7
  },
  {
    itemName: 'Eco-Friendly Stain Remover',
    category: '69b987ed585bffc359e7c14c', // Stain Remover
    pricePerUnit: 129,
    unit: 'piece',
    currentStock: 30,
    minStockLevel: 5,
    maxStockLevel: 50,
    notes: 'Tough on stains, gentle on the planet. Non-toxic formula.',
    image: '/uploads/stain_remover.png',
    rating: 4.6
  },
  {
    itemName: 'Mesh Laundry Bag (Set of 3)',
    category: '69b987ed585bffc359e7c150', // Laundry Bag
    pricePerUnit: 199,
    unit: 'pkg',
    currentStock: 25,
    minStockLevel: 5,
    maxStockLevel: 100,
    notes: 'Protects delicate garments during washing. Durable mesh design.',
    image: '/uploads/laundry_bag.png',
    rating: 4.5
  },
  {
    itemName: 'Velvet Garment Hangers',
    category: '69b987ed585bffc359e7c153', // Hanger
    pricePerUnit: 349,
    unit: 'pkg',
    currentStock: 15,
    minStockLevel: 5,
    maxStockLevel: 60,
    notes: 'Non-slip velvet surface keeps clothes in place. Set of 10.',
    image: '/uploads/hangers.png',
    rating: 4.9
  }
];

const seedDemoProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const prod of DEMO_PRODUCTS) {
      const existing = await Inventory.findOne({ itemName: prod.itemName });
      if (!existing) {
        await new Inventory(prod).save();
        console.log(`Seeded: ${prod.itemName}`);
      } else {
        console.log(`Skipped (already exists): ${prod.itemName}`);
      }
    }

    console.log('Demo products seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo products:', error);
    process.exit(1);
  }
};

seedDemoProducts();
