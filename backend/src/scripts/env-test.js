// Test script to check environment variables
require('dotenv').config({ path: __dirname + '/../../.env' });

console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS);
console.log('SMTP_FROM_EMAIL:', process.env.SMTP_FROM_EMAIL);