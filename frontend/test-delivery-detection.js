// Test script to check delivery boy email detection
console.log('Testing delivery boy email detection:');

const testEmails = [
  'route.test2@example.com',
  'mike.delivery@fabrico.com',
  'sarah.delivery@fabrico.com',
  'tom.delivery@fabrico.com',
  'delivery@test.com',
  'test@delivery.com',
  'admin@gmail.com',
  'user@example.com'
];

testEmails.forEach(email => {
  const isDeliveryBoy = email.includes('delivery');
  console.log(`${email} -> ${isDeliveryBoy ? 'DELIVERY BOY' : 'REGULAR USER'}`);
});

console.log('\nIf your email does not contain "delivery", it will not be treated as a delivery boy login.');

// Test the exact email that might be causing issues
console.log('\nTesting specific cases:');
console.log('======================');

const specificEmail = 'mike.delivery@fabrico.com';
console.log(`Email: "${specificEmail}"`);
console.log(`Length: ${specificEmail.length}`);
console.log(`Includes 'delivery': ${specificEmail.includes('delivery')}`);
console.log(`Trimmed: "${specificEmail.trim()}"`);
console.log(`Trimmed includes 'delivery': ${specificEmail.trim().includes('delivery')}`);

// Test edge cases
console.log('\nTesting edge cases:');
console.log('==================');

const edgeCases = [
  ' mike.delivery@fabrico.com ', // spaces
  'MIKE.DELIVERY@FABRICO.COM', // uppercase
  'mike.delivery@fabrico.com\n', // newline
  '\tmike.delivery@fabrico.com\t' // tabs
];

edgeCases.forEach(email => {
  const trimmed = email.trim();
  const includesDelivery = trimmed.includes('delivery');
  console.log(`"${email}" -> trim: "${trimmed}" -> includes 'delivery': ${includesDelivery}`);
});