const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('./config');
const ReportGenerator = require('./reportGenerator');

async function runLoginTests() {
  const report = new ReportGenerator();
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

    // Set timeouts
    await driver.manage().setTimeouts({ implicit: config.timeouts.implicit });

    console.log('Starting Login Tests...');

    // Test 1: Successful Login
    try {
      const startTime = Date.now();
      console.log('Test 1: Successful Login');
      
      // Navigate to login page
      await driver.get(`${config.baseUrl}/login`);
      
      // Wait for page to load
      await driver.wait(until.elementLocated(By.css('input[name="email"]')), 10000);
      
      // Fill in login form
      await driver.findElement(By.css('input[name="email"]')).sendKeys(config.credentials.validUser.email);
      await driver.findElement(By.css('input[name="password"]')).sendKeys(config.credentials.validUser.password);
      
      // Submit form
      await driver.findElement(By.css('button[type="submit"]')).click();
      
      // Wait for navigation or success message
      try {
        await driver.wait(until.urlContains('/dashboard'), 10000);
        const endTime = Date.now();
        report.addTestResult('Successful Login', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 1 PASSED: Successful Login');
      } catch (e) {
        // Alternative check for success message
        await driver.wait(until.elementLocated(By.css('.success-message')), 5000);
        const endTime = Date.now();
        report.addTestResult('Successful Login', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 1 PASSED: Successful Login');
      }
    } catch (error) {
      // Define startTime here as well to avoid reference error
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Successful Login', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 1 FAILED: Successful Login -', error.message);
    }

    // Test 2: Invalid Credentials
    try {
      const startTime = Date.now();
      console.log('Test 2: Invalid Credentials');
      
      // Navigate to login page
      await driver.get(`${config.baseUrl}/login`);
      
      // Wait for page to load
      await driver.wait(until.elementLocated(By.css('input[name="email"]')), 10000);
      
      // Fill in login form with invalid credentials
      await driver.findElement(By.css('input[name="email"]')).sendKeys(config.credentials.invalidUser.email);
      await driver.findElement(By.css('input[name="password"]')).sendKeys(config.credentials.invalidUser.password);
      
      // Submit form
      await driver.findElement(By.css('button[type="submit"]')).click();
      
      // Wait for error message
      await driver.wait(until.elementLocated(By.css('.text-red-200')), 10000);
      
      const errorMessage = await driver.findElement(By.css('.text-red-200')).getText();
      if (errorMessage) {
        const endTime = Date.now();
        report.addTestResult('Invalid Credentials', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 2 PASSED: Invalid Credentials');
      } else {
        throw new Error('Error message not displayed');
      }
    } catch (error) {
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Invalid Credentials', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 2 FAILED: Invalid Credentials -', error.message);
    }

    // Test 3: Empty Form Submission
    try {
      const startTime = Date.now();
      console.log('Test 3: Empty Form Submission');
      
      // Navigate to login page
      await driver.get(`${config.baseUrl}/login`);
      
      // Wait for page to load
      await driver.wait(until.elementLocated(By.css('input[name="email"]')), 10000);
      
      // Submit empty form
      await driver.findElement(By.css('button[type="submit"]')).click();
      
      // Wait for error messages
      await driver.wait(until.elementLocated(By.css('.text-red-200')), 10000);
      
      const errorMessages = await driver.findElements(By.css('.text-red-200'));
      if (errorMessages.length > 0) {
        const endTime = Date.now();
        report.addTestResult('Empty Form Submission', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 3 PASSED: Empty Form Submission');
      } else {
        throw new Error('Error messages not displayed');
      }
    } catch (error) {
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Empty Form Submission', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 3 FAILED: Empty Form Submission -', error.message);
    }

    // Test 4: Navigation to Registration Page
    try {
      const startTime = Date.now();
      console.log('Test 4: Navigation to Registration Page');
      
      // Navigate to login page
      await driver.get(`${config.baseUrl}/login`);
      
      // Wait for page to load
      await driver.wait(until.elementLocated(By.css('input[name="email"]')), 10000);
      
      // Click on registration link
      await driver.findElement(By.css('a[href="/register"]')).click();
      
      // Wait for navigation
      await driver.wait(until.urlContains('/register'), 10000);
      
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('/register')) {
        const endTime = Date.now();
        report.addTestResult('Navigation to Registration Page', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 4 PASSED: Navigation to Registration Page');
      } else {
        throw new Error('Navigation to registration page failed');
      }
    } catch (error) {
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Navigation to Registration Page', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 4 FAILED: Navigation to Registration Page -', error.message);
    }

  } catch (error) {
    console.error('Error during test execution:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
    
    // Generate HTML report
    const htmlReport = report.generateHTMLReport();
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, 'reports', 'login-test-report.html');
    fs.writeFileSync(reportPath, htmlReport);
    console.log(`\nHTML report generated at: ${reportPath}`);
    
    return report;
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runLoginTests().then(() => {
    console.log('Login tests completed');
  }).catch((error) => {
    console.error('Error running login tests:', error);
  });
}

module.exports = runLoginTests;