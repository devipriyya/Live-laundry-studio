const axios = require('axios');

async function finalComprehensiveTest() {
  console.log('=== FINAL COMPREHENSIVE TEST ===\n');
  
  // Test 1: Stain Removal Service
  try {
    console.log('1. Testing Stain Removal Service...');
    
    const stainRemovalData = {
      items: [
        {
          name: 'Shirt',
          quantity: 2,
          price: 150,
          service: 'stain-removal'
        }
      ],
      pickupDate: '2023-12-20',
      pickupTime: '02:00 PM - 04:00 PM',
      pickupAddress: {
        street: '456 Oak Avenue',
        city: 'Testville',
        state: 'Delhi',
        zipCode: '54321',
        instructions: 'Leave at front desk'
      },
      contactInfo: {
        name: 'Jane Smith',
        phone: '9876543210',
        email: 'jane.smith@gmail.com'
      },
      totalAmount: 300
    };

    const response1 = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', stainRemovalData);
    console.log('✅ Stain Removal Order created successfully!');
    console.log('   Order Number:', response1.data.order.orderNumber);
  } catch (error) {
    console.error('❌ Stain Removal Order failed:', error.response ? error.response.data : error.message);
  }

  // Test 2: Dry Cleaning Service
  try {
    console.log('\n2. Testing Dry Cleaning Service...');
    
    const dryCleaningData = {
      items: [
        {
          name: 'Suit (2-piece)',
          quantity: 1,
          price: 600,
          service: 'dry-cleaning'
        },
        {
          name: 'Dress Shirt',
          quantity: 3,
          price: 180,
          service: 'dry-cleaning'
        }
      ],
      pickupDate: '2023-12-22',
      pickupTime: '10:00 AM - 12:00 PM',
      pickupAddress: {
        street: '789 Pine Street',
        city: 'Clean City',
        state: 'Mumbai',
        zipCode: '98765',
        instructions: 'Call upon arrival'
      },
      contactInfo: {
        name: 'Robert Johnson',
        phone: '5551234567',
        email: 'robert.johnson@gmail.com'
      },
      totalAmount: 1140  // (1 * 600) + (3 * 180)
    };

    const response2 = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', dryCleaningData);
    console.log('✅ Dry Cleaning Order created successfully!');
    console.log('   Order Number:', response2.data.order.orderNumber);
  } catch (error) {
    console.error('❌ Dry Cleaning Order failed:', error.response ? error.response.data : error.message);
  }

  // Test 3: Steam Ironing Service
  try {
    console.log('\n3. Testing Steam Ironing Service...');
    
    const steamIroningData = {
      items: [
        {
          name: 'Shirt (Cotton)',
          quantity: 5,
          price: 50,
          service: 'steam-ironing'
        },
        {
          name: 'Pants / Jeans',
          quantity: 3,
          price: 60,
          service: 'steam-ironing'
        }
      ],
      pickupDate: '2023-12-25',
      pickupTime: '04:00 PM - 06:00 PM',
      pickupAddress: {
        street: '321 Elm Boulevard',
        city: 'Press Town',
        state: 'Bangalore',
        zipCode: '11223',
        instructions: 'Ring twice'
      },
      contactInfo: {
        name: 'Emily Davis',
        phone: '4449876543',
        email: 'emily.davis@gmail.com'
      },
      totalAmount: 430  // (5 * 50) + (3 * 60)
    };

    const response3 = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', steamIroningData);
    console.log('✅ Steam Ironing Order created successfully!');
    console.log('   Order Number:', response3.data.order.orderNumber);
  } catch (error) {
    console.error('❌ Steam Ironing Order failed:', error.response ? error.response.data : error.message);
  }

  console.log('\n=== TEST COMPLETE ===');
  console.log('If all services show ✅, then the fixes are working correctly!');
}

finalComprehensiveTest();