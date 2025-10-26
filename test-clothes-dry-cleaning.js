const axios = require('axios');

async function testClothesDryCleaningOrder() {
  try {
    console.log('Testing clothes dry cleaning order creation...');

    const orderData = {
      items: [
        {
          name: 'Dress Shirt',
          quantity: 2,
          price: 12.99,
          service: 'dry-clean'
        },
        {
          name: 'Blouse',
          quantity: 1,
          price: 12.99,
          service: 'dry-clean'
        }
      ],
      pickupDate: '2023-12-15',
      pickupTime: '10:00 AM',
      pickupAddress: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        instructions: 'Leave at front desk'
      },
      contactInfo: {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john.doe@example.com'
      },
      totalAmount: 38.97
    };

    const response = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', orderData);

    console.log('✅ Clothes dry cleaning order created successfully!');
    console.log('Response:', response.data);

    // Now test fetching the order
    console.log('\nTesting order retrieval...');
    const fetchResponse = await axios.get(`http://localhost:5000/api/orders/my?email=${orderData.contactInfo.email}`);
    console.log('Orders found:', fetchResponse.data.length);
    console.log('Orders:', fetchResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

testClothesDryCleaningOrder();