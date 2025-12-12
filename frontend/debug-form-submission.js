// Debug form submission to see what data is being sent
console.log('=== DEBUGGING FORM SUBMISSION ===\n');

// Simulate form data exactly as it would come from the frontend
function simulateFormData() {
  console.log('Simulating form data submission...\n');
  
  // This is what the form data looks like
  const formData = {
    email: 'admin@gmail.com',
    password: 'admin123'
  };
  
  console.log('Form data being submitted:');
  console.log('Email:', JSON.stringify(formData.email));
  console.log('Password:', JSON.stringify(formData.password));
  console.log('Email length:', formData.email.length);
  console.log('Password length:', formData.password.length);
  
  // Check for hidden characters
  console.log('\nChecking for hidden characters:');
  console.log('Email char codes:', [...formData.email].map(c => c.charCodeAt(0)));
  console.log('Password char codes:', [...formData.password].map(c => c.charCodeAt(0)));
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  console.log('\nEmail validation:');
  console.log('Valid format:', emailRegex.test(formData.email));
  
  // Check if there are any extra spaces
  console.log('\nWhitespace check:');
  console.log('Email trimmed === email:', formData.email.trim() === formData.email);
  console.log('Password trimmed === password:', formData.password.trim() === formData.password);
  
  return formData;
}

// Simulate the API call
async function simulateApiCall(formData) {
  console.log('\n--- Simulating API Call ---');
  console.log('Sending data to http://localhost:5000/api/auth/login');
  console.log('Request body:', JSON.stringify(formData, null, 2));
  
  // In a real scenario, this would be:
  /*
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
    } else {
      const error = await response.json();
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('Network error:', error);
  }
  */
}

// Run the simulation
const formData = simulateFormData();
simulateApiCall(formData);

console.log('\n=== DEBUG COMPLETE ===');
console.log('To troubleshoot admin login issues:');
console.log('1. Make sure there are no extra spaces in email or password');
console.log('2. Ensure exact case sensitivity (admin@gmail.com, not ADMIN@GMAIL.COM)');
console.log('3. Check browser developer tools Network tab to see actual request');
console.log('4. Verify both backend and frontend servers are running');