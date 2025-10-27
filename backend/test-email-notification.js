const { sendOrderStatusUpdateEmail } = require('./src/utils/emailService');

// Sample order data for testing
const sampleOrder = {
  orderNumber: 'ORD-TEST-001',
  customerInfo: {
    name: 'John Doe',
    email: 'johndoe@example.com'
  },
  items: [
    {
      name: 'Shirt Wash & Press',
      quantity: 5,
      price: 15.99
    }
  ]
};

// Test the email sending functionality
async function testEmailNotification() {
  try {
    console.log('Testing email notification...');
    
    // Send a test email
    await sendOrderStatusUpdateEmail(sampleOrder, 'order-accepted', 'Shirt Wash & Press');
    
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// Run the test
testEmailNotification();