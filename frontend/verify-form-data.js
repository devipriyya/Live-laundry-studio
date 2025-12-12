// Verify form data handling
console.log('=== VERIFYING FORM DATA HANDLING ===\n');

// Simulate the form state exactly as it would be in Login.jsx
let formState = {
  email: '',
  password: ''
};

console.log('Initial form state:', formState);

// Simulate typing "admin@gmail.com" into email field
formState.email = 'admin@gmail.com';
console.log('After typing email:', formState);

// Simulate typing "admin123" into password field
formState.password = 'admin123';
console.log('After typing password:', formState);

// Verify the data
console.log('\nVerification:');
console.log('Email:', JSON.stringify(formState.email));
console.log('Password:', JSON.stringify(formState.password));
console.log('Email length:', formState.email.length);
console.log('Password length:', formState.password.length);

// Check for hidden characters
console.log('\nHidden character check:');
console.log('Email char codes:', [...formState.email].map(c => c.charCodeAt(0)));
console.log('Password char codes:', [...formState.password].map(c => c.charCodeAt(0)));

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log('\nEmail validation:');
console.log('Valid format:', emailRegex.test(formState.email));

// Check if there are any extra spaces
console.log('\nWhitespace check:');
console.log('Email trimmed === email:', formState.email.trim() === formState.email);
console.log('Password trimmed === password:', formState.password.trim() === formState.password);

// Prepare data for API call
const apiData = {
  email: formState.email,
  password: formState.password
};

console.log('\nAPI data to be sent:');
console.log(JSON.stringify(apiData, null, 2));

console.log('\n=== VERIFICATION COMPLETE ===');
console.log('This is exactly what should be sent to the backend API.');
console.log('If the backend accepts this data directly, the issue is in the frontend.');