// Debug script to test delivery boy email detection logic
function testEmailDetection(email) {
  console.log(`\nTesting email: ${email}`);
  
  // Enhanced detection that works with various email formats for delivery boys
  const emailLower = email.toLowerCase();
  const isDeliveryBoyLogin = emailLower.includes('delivery') || 
                            emailLower.endsWith('@delivery.com') ||
                            emailLower.includes('.delivery@') ||
                            emailLower.startsWith('delivery.') ||
                            // Additional patterns for delivery boy emails
                            emailLower.includes('deliveryboy') ||
                            emailLower.includes('delivery-boy') ||
                            emailLower.includes('courier') ||
                            emailLower.includes('driver');
                            
  console.log(`  Contains 'delivery': ${emailLower.includes('delivery')}`);
  console.log(`  Ends with '@delivery.com': ${emailLower.endsWith('@delivery.com')}`);
  console.log(`  Contains '.delivery@': ${emailLower.includes('.delivery@')}`);
  console.log(`  Starts with 'delivery.': ${emailLower.startsWith('delivery.')}`);
  console.log(`  Contains 'deliveryboy': ${emailLower.includes('deliveryboy')}`);
  console.log(`  Contains 'delivery-boy': ${emailLower.includes('delivery-boy')}`);
  console.log(`  Contains 'courier': ${emailLower.includes('courier')}`);
  console.log(`  Contains 'driver': ${emailLower.includes('driver')}`);
  console.log(`  Result: ${isDeliveryBoyLogin ? 'DELIVERY BOY' : 'REGULAR USER'}`);
}

// Test various email formats
console.log('=== EMAIL DETECTION TEST ===');

testEmailDetection('test.created@example.com'); // This is the one we tested successfully via API
testEmailDetection('john.delivery@example.com');
testEmailDetection('delivery.john@company.com');
testEmailDetection('john@example.com');
testEmailDetection('mike.delivery@fabrico.com');
testEmailDetection('admin@gmail.com');
testEmailDetection('customer@example.com');
testEmailDetection('john.deliveryboy@example.com');
testEmailDetection('delivery-boy@test.com');
testEmailDetection('courier.john@company.com');
testEmailDetection('driver.mike@logistics.com');

console.log('\n=== TEST COMPLETE ===');