# Email Configuration Guide

This document explains how to configure email notifications for the Fabrico Laundry Services application.

## Current Implementation

The application uses Nodemailer for sending email notifications. The current implementation supports both:
1. Gmail service configuration (default)
2. Custom SMTP configuration

## Environment Variables

The email service reads configuration from the following environment variables in the `backend/.env` file:

### Gmail Configuration (Default)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Custom SMTP Configuration
```
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM_EMAIL=notifications@yourdomain.com
```

## Setting up Gmail

To use Gmail for email notifications:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to your Google Account settings
   - Navigate to Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
3. Add the credentials to your `.env` file:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

## Setting up Custom SMTP

To use a custom SMTP provider (e.g., SendGrid, Mailgun, AWS SES):

1. Obtain SMTP credentials from your provider
2. Add the configuration to your `.env` file:
   ```
   SMTP_HOST=smtp.your-provider.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-smtp-username
   SMTP_PASS=your-smtp-password
   SMTP_FROM_EMAIL=notifications@yourdomain.com
   ```

## Testing Email Configuration

You can test the email configuration using the provided test script:

```bash
cd backend
npm run test-email
```

Or through the admin interface:
1. Navigate to Admin Order Management
2. Click "Test Email" button to verify basic email functionality
3. Click "Test Order Email" button to test order notification emails

## Troubleshooting

### Common Issues

1. **Invalid login credentials**:
   - For Gmail, ensure you're using an App Password, not your regular password
   - For custom SMTP, verify your credentials with your provider

2. **TLS/SSL errors**:
   - Try setting `SMTP_SECURE=false` for port 587
   - Set `SMTP_SECURE=true` for port 465

3. **Emails not sending**:
   - Check server logs for error messages
   - Verify firewall settings allow outbound SMTP connections
   - Ensure your SMTP provider allows sending from your server's IP

### Logs

Email sending attempts are logged in the backend console:
- Successful sends: "Email sent successfully: [message-id]"
- Failures: "Error sending email:" followed by error details

Even if email sending fails, order status updates will still be processed successfully.