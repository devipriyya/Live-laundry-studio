const axios = require('axios');

async function testFrontendDataSimulation() {
  try {
    console.log('Testing frontend data simulation with potentially incomplete data...');

    // Simulate what might happen if the frontend sends incomplete data
    // This is what might be happening in the actual frontend
    const potentiallyIncompleteData = {
      items: [
        {
          name: 'Shirt',
          quantity: 2,
          price: 150,
          service: 'stain-removal'
        }
      ],
      pickupDate: '2023-12-15',
      pickupTime: '10:00 AM',
      pickupAddress: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        instructions: 'Ring doorbell'
      },
      contactInfo: {
        name: 'John Doe',
        phone: '', // This might be empty if not filled by user
        email: 'john.doe@example.com'
      },
      totalAmount: 300
    };

    console.log('Sending potentially incomplete data:', JSON.stringify(potentiallyIncompleteData, null, 2));

    const response = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', potentiallyIncompleteData);

    console.log('✅ Order created successfully!');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }

  try {
    console.log('\nTesting with completely missing contact info...');

    // Simulate what might happen if contact info is completely missing
    const missingContactInfo = {
      items: [
        {
          name: 'Shirt',
          quantity: 2,
          price: 150,
          service: 'stain-removal'
        }
      ],
      pickupDate: '2023-12-15',
      pickupTime: '10:00 AM',
      pickupAddress: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        instructions: 'Ring doorbell'
      },
      contactInfo: {
        name: '', // Missing name
        phone: '', // Missing phone
        email: '' // Missing email
      },
      totalAmount: 300
    };

    console.log('Sending data with missing contact info:', JSON.stringify(missingContactInfo, null, 2));

    const response = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', missingContactInfo);

    console.log('✅ Order created successfully!');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }

  try {
    console.log('\nTesting with missing address fields...');

    // Simulate what might happen if address fields are missing
    const missingAddressFields = {
      items: [
        {
          name: 'Shirt',
          quantity: 2,
          price: 150,
          service: 'stain-removal'
        }
      ],
      pickupDate: '2023-12-15',
      pickupTime: '10:00 AM',
      pickupAddress: {
        street: '', // Missing street
        city: '', // Missing city
        state: 'CA',
        zipCode: '', // Missing zipCode
        instructions: 'Ring doorbell'
      },
      contactInfo: {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john.doe@example.com'
      },
      totalAmount: 300
    };

    console.log('Sending data with missing address fields:', JSON.stringify(missingAddressFields, null, 2));

    const response = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', missingAddressFields);

    console.log('✅ Order created successfully!');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testFrontendDataSimulation();