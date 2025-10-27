const { testEmailConfiguration } = require('../utils/emailService');

const runTest = async () => {
  console.log('Testing email configuration...');
  const result = await testEmailConfiguration();
  if (result) {
    console.log('Email configuration test passed!');
  } else {
    console.log('Email configuration test failed!');
  }
  process.exit(result ? 0 : 1);
};

runTest();