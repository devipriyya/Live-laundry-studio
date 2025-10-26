function sanitizePhoneNumber(value) {
  return value.replace(/\D/g, '').slice(0, 10);
}

function validatePhone(value) {
  if (!value) {
    return { isValid: false, error: 'Phone number is required.' };
  }

  if (value.length !== 10) {
    return { isValid: false, error: 'Phone number must be exactly 10 digits.' };
  }

  return { isValid: true, error: '' };
}

// Test cases
const testCases = [
  '', // Empty string
  '1234567890', // Valid 10 digits
  '123-456-7890', // With dashes
  '(123) 456-7890', // With parentheses and dashes
  '12345678901', // 11 digits
  '12345', // 5 digits
  'abc123def456', // With letters
  '+1234567890', // With plus sign
];

testCases.forEach((testCase, index) => {
  const sanitized = sanitizePhoneNumber(testCase);
  const validation = validatePhone(sanitized);
  
  console.log(`Test ${index + 1}: "${testCase}"`);
  console.log(`  Sanitized: "${sanitized}"`);
  console.log(`  Valid: ${validation.isValid}`);
  console.log(`  Error: ${validation.error}`);
  console.log('');
});