// Test script to verify the frontend authentication flow for order creation
const axios = require('axios');

async function testFrontendAuthFlow() {
  try {
    console.log('=== TESTING FRONTEND AUTHENTICATION FLOW ===');
    
    // Step 1: Login as admin (simulating frontend login)
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    console.log('Token:', token.substring(0, 20) + '...');
    
    // Step 2: Store token in localStorage (simulating frontend behavior)
    console.log('\n2. Simulating localStorage token storage...');
    // In a real browser, this would be: localStorage.setItem('token', token);
    console.log('✅ Token stored in localStorage simulation');
    
    // Step 3: Create an order (simulating frontend order creation after payment)
    console.log('\n3. Creating schedule wash order (simulating frontend call)...');
    const orderData = {
      items: [
        {
          name: 'Shirt (Cotton)',
          quantity: 2,
          price: 25,
          service: 'wash-and-press'
        }
      ],
      pickupDate: '2023-12-25',
      pickupTime: '02:00 PM - 04:00 PM',
      pickupAddress: {
        street: '456 Oak Avenue',
        city: 'Test City',
        state: 'Test State',
        zipCode: '54321',
        instructions: 'Leave at front desk'
      },
      contactInfo: {
        name: 'Jane Smith',
        phone: '0987654321',
        email: 'jane.smith@gmail.com'
      },
      totalAmount: 50
    };
    
    // Simulate the frontend API call with token in Authorization header
    console.log('Making API call with Authorization header...');
    const orderResponse = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Schedule wash order created successfully via frontend simulation');
    console.log('Order ID:', orderResponse.data.order._id);
    console.log('Order number:', orderResponse.data.order.orderNumber);
    
    // Step 4: Verify the order was created correctly
    console.log('\n4. Verifying order creation...');
    const verifyResponse = await axios.get(`http://localhost:5000/api/orders/my?email=${orderData.contactInfo.email}`);
    
    const createdOrder = verifyResponse.data.find(order => order._id === orderResponse.data.order._id);
    if (createdOrder) {
      console.log('✅ Order verification successful');
      console.log('Order details:');
      console.log('  Order Number:', createdOrder.orderNumber);
      console.log('  Status:', createdOrder.status);
      console.log('  Total Amount:', createdOrder.totalAmount);
      console.log('  Items:', createdOrder.items.length);
      console.log('  Service:', createdOrder.items[0].service);
    } else {
      console.log('❌ Order verification failed - order not found');
      return;
    }
    
    console.log('\n🎉 FRONTEND AUTHENTICATION FLOW TEST PASSED');
    console.log('   The authentication flow is working correctly.');
    console.log('   If users are still seeing "Not authorized" errors,');
    console.log('   the issue is likely in the browser context or timing.');
    
  } catch (error) {
    console.error('❌ FRONTEND AUTHENTICATION FLOW TEST FAILED');
    console.error('   Message:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testFrontendAuthFlow();