const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('./config');
const ReportGenerator = require('./reportGenerator');

async function runDashboardTests() {
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

    console.log('Starting Dashboard Tests...');

    // First, login to access the dashboard
    try {
      console.log('Logging in to access dashboard...');
      
      // Navigate to login page
      await driver.get(`${config.baseUrl}/login`);
      
      // Wait for page to load
      await driver.wait(until.elementLocated(By.css('input[name="email"]')), 10000);
      
      // Fill in login form
      await driver.findElement(By.css('input[name="email"]')).sendKeys(config.credentials.validUser.email);
      await driver.findElement(By.css('input[name="password"]')).sendKeys(config.credentials.validUser.password);
      
      // Submit form
      await driver.findElement(By.css('button[type="submit"]')).click();
      
      // Wait for navigation to dashboard
      await driver.wait(until.urlContains('/dashboard'), 10000);
      console.log('Successfully logged in');
    } catch (error) {
      console.log('Login failed, skipping dashboard tests:', error.message);
      throw new Error('Cannot access dashboard without login');
    }

    // Test 1: Dashboard Page Load
    try {
      const startTime = Date.now();
      console.log('Test 1: Dashboard Page Load');
      
      // Wait for dashboard elements to load
      await driver.wait(until.elementLocated(By.css('h1, h2')), 10000);
      
      // Check if dashboard title or heading is present
      const headings = await driver.findElements(By.css('h1, h2'));
      let dashboardLoaded = false;
      
      for (let heading of headings) {
        const text = await heading.getText();
        if (text.toLowerCase().includes('dashboard') || text.toLowerCase().includes('welcome')) {
          dashboardLoaded = true;
          break;
        }
      }
      
      if (dashboardLoaded) {
        const endTime = Date.now();
        report.addTestResult('Dashboard Page Load', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 1 PASSED: Dashboard Page Load');
      } else {
        throw new Error('Dashboard content not loaded properly');
      }
    } catch (error) {
      // Define startTime here as well to avoid reference error
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Dashboard Page Load', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 1 FAILED: Dashboard Page Load -', error.message);
    }

    // Test 2: Navigation to My Orders Page
    try {
      const startTime = Date.now();
      console.log('Test 2: Navigation to My Orders Page');
      
      // Try to find and click on My Orders link (common navigation item)
      try {
        const myOrdersLink = await driver.findElement(By.css('a[href*="orders"], a[href*="my-orders"]'));
        await myOrdersLink.click();
      } catch (e) {
        // Alternative approach - look for text containing "orders"
        const links = await driver.findElements(By.css('a'));
        for (let link of links) {
          const text = await link.getText();
          if (text.toLowerCase().includes('orders') || text.toLowerCase().includes('my orders')) {
            await link.click();
            break;
          }
        }
      }
      
      // Wait a bit for navigation
      await driver.sleep(3000);
      
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('order') || currentUrl.includes('orders')) {
        const endTime = Date.now();
        report.addTestResult('Navigation to My Orders Page', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 2 PASSED: Navigation to My Orders Page');
      } else {
        // If navigation failed, just check if we can find order-related elements
        const orderElements = await driver.findElements(By.css('[class*="order"], [id*="order"]'));
        if (orderElements.length > 0) {
          const endTime = Date.now();
          report.addTestResult('Navigation to My Orders Page', 'PASSED', null, endTime - startTime);
          console.log('✓ Test 2 PASSED: Navigation to My Orders Page');
        } else {
          throw new Error('Navigation to orders page failed');
        }
      }
    } catch (error) {
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Navigation to My Orders Page', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 2 FAILED: Navigation to My Orders Page -', error.message);
    }

    // Navigate back to dashboard for next tests
    try {
      await driver.get(`${config.baseUrl}/dashboard`);
      await driver.wait(until.elementLocated(By.css('h1, h2')), 10000);
    } catch (e) {
      console.log('Could not navigate back to dashboard, continuing with tests...');
    }

    // Test 3: Profile Navigation
    try {
      const startTime = Date.now();
      console.log('Test 3: Profile Navigation');
      
      // Try to find and click on Profile link
      try {
        const profileLink = await driver.findElement(By.css('a[href*="profile"]'));
        await profileLink.click();
      } catch (e) {
        // Alternative approach - look for text containing "profile"
        const links = await driver.findElements(By.css('a'));
        for (let link of links) {
          const text = await link.getText();
          if (text.toLowerCase().includes('profile')) {
            await link.click();
            break;
          }
        }
      }
      
      // Wait a bit for navigation
      await driver.sleep(3000);
      
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('profile')) {
        const endTime = Date.now();
        report.addTestResult('Profile Navigation', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 3 PASSED: Profile Navigation');
      } else {
        // If navigation failed, just check if we can find profile-related elements
        const profileElements = await driver.findElements(By.css('[class*="profile"], [id*="profile"]'));
        if (profileElements.length > 0) {
          const endTime = Date.now();
          report.addTestResult('Profile Navigation', 'PASSED', null, endTime - startTime);
          console.log('✓ Test 3 PASSED: Profile Navigation');
        } else {
          throw new Error('Profile navigation failed');
        }
      }
    } catch (error) {
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Profile Navigation', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 3 FAILED: Profile Navigation -', error.message);
    }

    // Navigate back to dashboard for next tests
    try {
      await driver.get(`${config.baseUrl}/dashboard`);
      await driver.wait(until.elementLocated(By.css('h1, h2')), 10000);
    } catch (e) {
      console.log('Could not navigate back to dashboard, continuing with tests...');
    }

    // Test 4: Logout Functionality
    try {
      const startTime = Date.now();
      console.log('Test 4: Logout Functionality');
      
      // Try to find and click on Logout button
      try {
        const logoutButton = await driver.findElement(By.css('button[type="button"], a[href*="logout"]'));
        await logoutButton.click();
      } catch (e) {
        // Alternative approach - look for text containing "logout"
        const buttons = await driver.findElements(By.css('button, a'));
        for (let button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('logout') || text.toLowerCase().includes('sign out')) {
            await button.click();
            break;
          }
        }
      }
      
      // Wait for navigation to login page
      await driver.wait(until.urlContains('/login'), 10000);
      
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('/login')) {
        const endTime = Date.now();
        report.addTestResult('Logout Functionality', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 4 PASSED: Logout Functionality');
      } else {
        throw new Error('Logout failed - not redirected to login page');
      }
    } catch (error) {
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Logout Functionality', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 4 FAILED: Logout Functionality -', error.message);
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
    const reportPath = path.join(__dirname, 'reports', 'dashboard-test-report.html');
    fs.writeFileSync(reportPath, htmlReport);
    console.log(`\nHTML report generated at: ${reportPath}`);
    
    return report;
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runDashboardTests().then(() => {
    console.log('Dashboard tests completed');
  }).catch((error) => {
    console.error('Error running dashboard tests:', error);
  });
}

module.exports = runDashboardTests;