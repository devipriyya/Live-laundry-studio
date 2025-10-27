# Email Notification Feature

This document explains how to set up and use the email notification feature for the Admin Order Management page.

## Overview

The email notification feature automatically sends an email to customers whenever an admin approves, updates, or cancels an order. The email includes:
- Order ID
- Service name
- New status

## Setup Instructions

### 1. Install Dependencies

The feature requires Nodemailer which should already be installed:

```
npm install nodemailer --save
```

### 2. Configure Email Settings

Add the following to your `.env` file:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note**: For Gmail, you need to use an App Password, not your regular password. 
To generate an App Password:
1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings
3. Navigate to Security > App passwords
4. Generate a new app password for "Mail"

### 3. Email Service Configuration

The current implementation uses Gmail as the email service. To use a different service, modify the transporter configuration in `src/utils/emailService.js`.

Supported services include:
- Gmail
- Outlook/Hotmail
- Yahoo
- SendGrid
- Amazon SES
- And many more

## How It Works

The email notification feature is integrated into the following order management endpoints:

1. **Update Order Status** (`PATCH /api/orders/:id/status`)
2. **Bulk Status Update** (`PATCH /api/orders/bulk/status`)
3. **Cancel Order** (`PATCH /api/orders/:id/cancel`)
4. **Update Delivery Status** (`PATCH /api/orders/:id/delivery-status`)

Whenever any of these endpoints are called and the order status is changed, an email is automatically sent to the customer.

## Customization

### Email Template

The email template can be customized in `src/utils/emailService.js` in the `sendOrderStatusUpdateEmail` function.

### Status Labels

Status labels can be customized in the `statusLabels` object in `src/utils/emailService.js`.

## Testing

To test the email functionality, run:

```
node test-email-notification.js
```

## Error Handling

Email sending failures are logged but do not cause the API request to fail. This ensures that order management operations continue to work even if there are issues with the email service.

## Troubleshooting

### Emails Not Sending

1. Check that EMAIL_USER and EMAIL_PASS are correctly set in `.env`
2. Verify that the email credentials are correct
3. Ensure that the email service is not blocking the connection
4. Check the console logs for error messages

### Gmail Specific Issues

1. Make sure you're using an App Password, not your regular password
2. Verify that 2-factor authentication is enabled
3. Check that Gmail isn't blocking the sign-in attempt (check your Gmail activity)

## Security Considerations

- Never commit your `.env` file to version control
- Use strong, unique passwords for email accounts
- Regularly rotate App Passwords
- Monitor email sending logs for unusual activity