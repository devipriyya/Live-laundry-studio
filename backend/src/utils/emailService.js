// Load environment variables
require('dotenv').config({ path: __dirname + '/../../.env' });

const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const createTransporter = () => {
  // Check if we have SMTP configuration in environment variables
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    console.log('Using custom SMTP configuration');
    // Use custom SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Set to true in production with proper certificates
      }
    });
  } else {
    console.log('Using Gmail service configuration');
    // Fall back to Gmail service (current configuration)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }
};

// Create transporter instance
const transporter = createTransporter();

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.warn('Email transporter configuration warning:', error.message);
    console.warn('Email notifications may not work properly. Please check your SMTP configuration.');
  } else {
    console.log('Email transporter is ready to send emails');
  }
});

/**
 * Send order status update email to customer
 * @param {Object} order - The order object
 * @param {String} newStatus - The new status of the order
 * @param {String} serviceName - The name of the service
 */
const sendOrderStatusUpdateEmail = async (order, newStatus, serviceName) => {
  try {
    // Format the status for better readability
    const statusLabels = {
      'order-placed': 'Order Placed',
      'order-accepted': 'Order Accepted',
      'out-for-pickup': 'Out for Pickup',
      'pickup-completed': 'Pickup Completed',
      'wash-in-progress': 'Wash in Progress',
      'wash-completed': 'Wash Completed',
      'drying': 'Drying',
      'quality-check': 'Quality Check',
      'out-for-delivery': 'Out for Delivery',
      'delivery-completed': 'Delivery Completed',
      'cancelled': 'Cancelled'
    };

    const statusLabel = statusLabels[newStatus] || newStatus;

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || process.env.EMAIL_USER || 'your-email@gmail.com',
      to: order.customerInfo.email,
      subject: `Order Status Update - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Status Update</h2>
          <p>Hello ${order.customerInfo.name},</p>
          <p>We're writing to inform you that the status of your order has been updated.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${order.orderNumber}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>New Status:</strong> ${statusLabel}</p>
            <p><strong>Updated at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>You can check the full status of your order by logging into your account or visiting our website.</p>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          
          <p>Thank you for choosing our service!</p>
          <p>Best regards,<br/>Fabrico Laundry Services Team</p>
        </div>
      `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw the error to prevent order status updates from failing
    return null;
  }
};

/**
 * Test email configuration
 */
const testEmailConfiguration = async () => {
  try {
    const testMailOptions = {
      from: process.env.SMTP_FROM_EMAIL || process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.SMTP_FROM_EMAIL || process.env.EMAIL_USER || 'your-email@gmail.com',
      subject: 'Test Email Configuration',
      text: 'This is a test email to verify the email configuration is working properly.'
    };

    const info = await transporter.sendMail(testMailOptions);
    console.log('Test email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
};

module.exports = {
  sendOrderStatusUpdateEmail,
  testEmailConfiguration
};