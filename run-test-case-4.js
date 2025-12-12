// Runner script for Test Case 4: Order Management Functionality
const testOrderManagementFunctionality = require('./tests/order-management.test.js');

console.log('🚀 Starting Test Case 4: Order Management Functionality');
console.log('=====================================================\n');

testOrderManagementFunctionality()
  .then(() => {
    console.log('✅ Test Case 4 completed successfully!');
  })
  .catch((error) => {
    console.error('💥 Test Case 4 failed with an error:');
    console.error(error);
  });