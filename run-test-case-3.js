// Runner script for Test Case 3: Service Booking Functionality
const testServiceBookingFunctionality = require('./tests/service-booking.test.js');

console.log('🚀 Starting Test Case 3: Service Booking Functionality');
console.log('=====================================================\n');

testServiceBookingFunctionality()
  .then(() => {
    console.log('✅ Test Case 3 completed successfully!');
  })
  .catch((error) => {
    console.error('💥 Test Case 3 failed with an error:');
    console.error(error);
  });