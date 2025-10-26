// Verify that all the imports in the Stain Removal component are valid
const fs = require('fs');

// Check if the Heroicons package is installed
try {
  const packageJson = JSON.parse(fs.readFileSync('./frontend/package.json', 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  if (dependencies['@heroicons/react']) {
    console.log('✅ @heroicons/react is installed');
  } else {
    console.log('❌ @heroicons/react is not installed');
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check if the api.js file exists
try {
  if (fs.existsSync('./frontend/src/api.js')) {
    console.log('✅ api.js file exists');
  } else {
    console.log('❌ api.js file does not exist');
  }
} catch (error) {
  console.log('❌ Error checking api.js file:', error.message);
}

// Check if the AuthContext file exists
try {
  if (fs.existsSync('./frontend/src/context/AuthContext.js') || fs.existsSync('./frontend/src/context/AuthContext.jsx')) {
    console.log('✅ AuthContext file exists');
  } else {
    console.log('❌ AuthContext file does not exist');
  }
} catch (error) {
  console.log('❌ Error checking AuthContext file:', error.message);
}

console.log('Verification complete');