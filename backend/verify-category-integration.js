const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
  try {
    console.log('Starting verification...');

    // 1. Check Categories API
    console.log('\n1. Checking Categories API...');
    const categoriesRes = await axios.get(`${API_URL}/categories`);
    console.log(`Found ${categoriesRes.data.length} categories.`);
    if (categoriesRes.data.length === 0) {
      throw new Error('No categories found. Seeding might have failed.');
    }
    const testCategory = categoriesRes.data[0];
    console.log(`Sample category: ${testCategory.name} (${testCategory._id})`);

    // 2. Check Products API
    console.log('\n2. Checking Products API...');
    const productsRes = await axios.get(`${API_URL}/products`);
    console.log(`Found ${productsRes.data.length} products.`);
    if (productsRes.data.length > 0) {
      const sampleProduct = productsRes.data[0];
      console.log(`Sample product: ${sampleProduct.name}`);
      console.log(`Category: ${sampleProduct.category}`);
      console.log(`Category ID: ${sampleProduct.categoryId}`);
      
      if (!sampleProduct.categoryId) {
        console.warn('Warning: Product is missing categoryId reference.');
      }
    } else {
      console.log('No products found (this might be normal if no items are in stock).');
    }

    console.log('\nVerification completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\nVerification failed!');
    if (error.code === 'ECONNREFUSED') {
      console.error(`Could not connect to backend at ${API_URL}. Is the server running?`);
    } else if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message || error);
    }
    process.exit(1);
  }
};

runVerification();
