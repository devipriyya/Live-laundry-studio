const axios = require('axios');

async function testShoePolishingOrder() {
  try {
    console.log('Testing shoe polishing order creation...');
    
    // First, let's simulate a Firebase login to get a token
    console.log('Step 1: Getting authentication token...');
    
    const firebaseLoginResponse = await axios.post('http://localhost:5000/api/auth/firebase-login', {
      uid: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User'
    });
    
    const token = firebaseLoginResponse.data.token;
    console.log('✅ Got authentication token:', token.substring(0, 20) + '...');
    
    // Now create a shoe polishing order
    console.log('Step 2: Creating shoe polishing order...');
    
    const orderData = {
      orderNumber: `SHOE-${Date.now()}`,
      customerInfo: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        address: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'TS',
          zipCode: '123456'
        }
      },
      items: [{
        name: 'Formal Leather Shoes',
        quantity: 2,
        price: 300,
        service: 'shoe-care'
      }],
      totalAmount: 300,
      totalItems: 2,
      pickupDate: '2023-12-15',
      timeSlot: '10:00 AM',
      specialInstructions: 'Please polish carefully',
      status: 'order-placed',
      paymentStatus: 'paid',
      paymentId: 'test-payment-id-123',
      paymentMethod: 'razorpay'
    };
    
    const orderResponse = await axios.post('http://localhost:5000/api/orders', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Order created successfully!');
    console.log('Order ID:', orderResponse.data.order._id);
    console.log('Order Number:', orderResponse.data.order.orderNumber);
    
    // Test fetching the order
    console.log('\nStep 3: Fetching order by email...');
    const fetchResponse = await axios.get(`http://localhost:5000/api/orders/my?email=test@example.com`);
    console.log('Orders found:', fetchResponse.data.length);
    
  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

testShoePolishingOrder();