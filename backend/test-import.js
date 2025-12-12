try {
  console.log('Trying to import index.js');
  require('./src/index.js');
  console.log('Import successful');
} catch (error) {
  console.error('Import failed:', error);
}