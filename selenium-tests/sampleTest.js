const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function sampleTest() {
  let driver;
  
  try {
    // Setup Chrome options
    const options = new chrome.Options();
    options.addArguments('--headless'); // Run in headless mode
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    // Initialize the driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    console.log('WebDriver initialized successfully!');
    
    // Test basic navigation
    await driver.get('https://www.google.com');
    await driver.wait(until.titleContains('Google'), 5000);
    
    const title = await driver.getTitle();
    console.log('Page title:', title);
    
    if (title.includes('Google')) {
      console.log('✓ Sample test PASSED');
    } else {
      console.log('✗ Sample test FAILED');
    }
    
  } catch (error) {
    console.error('Sample test error:', error);
  } finally {
    if (driver) {
      await driver.quit();
      console.log('WebDriver closed successfully!');
    }
  }
}

// Run the sample test
sampleTest();