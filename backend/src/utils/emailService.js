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

/**
 * Send Delivery OTP email to customer
 * @param {Object} order - The order object
 * @param {String} otp - The plain text OTP to send
 * @param {Number} expiryMinutes - OTP expiry time in minutes
 */
const sendDeliveryOTPEmail = async (order, otp, expiryMinutes = 30) => {
  try {
    // Format OTP for better readability
    const formattedOTP = `${otp.slice(0, 3)} ${otp.slice(3)}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || process.env.EMAIL_USER || 'your-email@gmail.com',
      to: order.customerInfo.email,
      subject: `🔐 Delivery OTP for Order ${order.orderNumber} - Fabrico`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin: 0; font-size: 24px;">📦 Delivery Verification</h1>
              <p style="color: #6b7280; margin-top: 10px;">Your order is ready for delivery!</p>
            </div>
            
            <p style="color: #374151; font-size: 16px;">Hello <strong>${order.customerInfo.name}</strong>,</p>
            
            <p style="color: #374151; font-size: 16px;">
              Your order <strong>#${order.orderNumber}</strong> is out for delivery. Please share the following OTP with our delivery partner to confirm receipt:
            </p>
            
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
              <p style="color: rgba(255,255,255,0.9); margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                Your Delivery OTP
              </p>
              <div style="background: white; border-radius: 8px; padding: 15px 30px; display: inline-block;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1f2937; font-family: 'Courier New', monospace;">
                  ${formattedOTP}
                </span>
              </div>
              <p style="color: rgba(255,255,255,0.8); margin: 15px 0 0 0; font-size: 12px;">
                ⏰ Valid for ${expiryMinutes} minutes
              </p>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>⚠️ Important Security Notice:</strong><br/>
                Do not share this OTP with anyone except our authorized delivery partner. Our team will never call you asking for this OTP over phone.
              </p>
            </div>
            
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">Order Summary:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #6b7280; padding: 5px 0;">Order Number:</td>
                  <td style="color: #1f2937; text-align: right; font-weight: 500;">${order.orderNumber}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 5px 0;">Total Amount:</td>
                  <td style="color: #1f2937; text-align: right; font-weight: 500;">₹${order.totalAmount}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 5px 0;">Items:</td>
                  <td style="color: #1f2937; text-align: right; font-weight: 500;">${order.items?.length || 0} items</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 25px; text-align: center;">
              Thank you for choosing Fabrico Laundry Services!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Delivery OTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending delivery OTP email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send OTP via SMS (placeholder for SMS integration)
 * @param {String} phone - Customer phone number
 * @param {String} otp - The OTP to send
 * @param {String} orderNumber - Order number for reference
 */
const sendDeliveryOTPSMS = async (phone, otp, orderNumber) => {
  try {
    // TODO: Integrate with SMS provider (Twilio, MSG91, etc.)
    // For now, log the OTP for testing purposes
    console.log(`[SMS PLACEHOLDER] Sending OTP ${otp} to ${phone} for order ${orderNumber}`);
    
    // Uncomment and configure when SMS provider is set up:
    /*
    const twilioClient = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    const message = await twilioClient.messages.create({
      body: `Your Fabrico delivery OTP is: ${otp}. Share this with our delivery partner to confirm receipt of order #${orderNumber}. Valid for 30 mins.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    
    return { success: true, messageId: message.sid };
    */
    
    return { success: true, messageId: 'sms-placeholder' };
  } catch (error) {
    console.error('Error sending delivery OTP SMS:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderStatusUpdateEmail,
  testEmailConfiguration,
  sendDeliveryOTPEmail,
  sendDeliveryOTPSMS
};