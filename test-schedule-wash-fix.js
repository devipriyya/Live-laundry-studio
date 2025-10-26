// Test script to verify the schedule wash order creation fix
const axios = require('axios');

async function testScheduleWashOrderCreation() {
  try {
    console.log('=== TESTING SCHEDULE WASH ORDER CREATION FIX ===');
    
    // Test admin login
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Test creating a schedule wash order
    console.log('\n2. Creating schedule wash order...');
    const orderData = {
      items: [
        {
          name: 'Shirt (Cotton)',
          quantity: 2,
          price: 25,
          service: 'wash-and-press'
        },
        {
          name: 'Pants / Jeans',
          quantity: 1,
          price: 30,
          service: 'wash-and-press'
        }
      ],
      pickupDate: '2023-12-20',
      pickupTime: '10:00 AM - 12:00 PM',
      pickupAddress: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        instructions: 'Ring doorbell'
      },
      contactInfo: {
        name: 'John Doe',
        phone: '1234567890',
        email: 'john.doe@gmail.com'
      },
      totalAmount: 80
    };
    
    console.log('Order data:', JSON.stringify(orderData, null, 2));
    
    const orderResponse = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Schedule wash order created successfully');
    console.log('Order ID:', orderResponse.data.order._id);
    console.log('Order number:', orderResponse.data.order.orderNumber);
    
    // Test fetching the order
    console.log('\n3. Fetching the created order...');
    const fetchResponse = await axios.get(`http://localhost:5000/api/orders/my?email=${orderData.contactInfo.email}`);
    
    console.log('✅ Order fetch successful');
    console.log('Total orders found:', fetchResponse.data.length);
    
    if (fetchResponse.data.length > 0) {
      const order = fetchResponse.data[0];
      console.log('First order details:');
      console.log('  Order Number:', order.orderNumber);
      console.log('  Status:', order.status);
      console.log('  Total Amount:', order.totalAmount);
      console.log('  Items:', order.items.length);
    }
    
    console.log('\n🎉 SCHEDULE WASH ORDER CREATION TEST PASSED');
    console.log('   The fix is working correctly.');
    
  } catch (error) {
    console.error('❌ SCHEDULE WASH ORDER CREATION TEST FAILED');
    console.error('   Message:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testScheduleWashOrderCreation();