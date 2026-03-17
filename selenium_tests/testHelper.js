const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const config = require('./config');

class TestHelper {
  constructor(featureName) {
    this.featureName = featureName;
    this.results = [];
    this.startTime = new Date();
    this.driver = null;
  }

  async init() {
    const options = new chrome.Options();
    options.addArguments('--headless'); // Use headless for CI/Automation
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');

    // Explicitly set path to chromedriver
    const chromeDriverPath = 'C:\\Users\\User\\fabrico\\node_modules\\chromedriver\\lib\\chromedriver\\chromedriver.exe';
    const serviceBuilder = new chrome.ServiceBuilder(chromeDriverPath);
    
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(serviceBuilder)
      .build();
    
    await this.driver.manage().setTimeouts({ implicit: config.timeouts.implicit });
  }

  async log(step, status = 'INFO', details = '') {
    console.log(`[${new Date().toLocaleTimeString()}] ${status}: ${step} ${details}`);
    this.results.push({
      time: new Date().toLocaleTimeString(),
      step,
      status,
      details
    });
  }

  async login(email, password) {
    await this.log('Navigating to Login page');
    await this.driver.get(`${config.baseUrl}/login`);
    
    await this.log('Waiting for Login form');
    const emailField = await this.driver.wait(until.elementLocated(By.name('email')), config.timeouts.element);
    const passwordField = await this.driver.findElement(By.name('password'));
    
    await this.log('Entering credentials');
    await emailField.sendKeys(email);
    await passwordField.sendKeys(password);
    
    await this.log('Clicking Login button');
    await this.driver.findElement(By.css('button[type="submit"]')).click();
    
    await this.log('Waiting for Dashboard redirection');
    await this.driver.wait(until.urlContains('/dashboard'), config.timeouts.element);
    await this.log('Successfully logged in', 'PASS');
  }

  generateHtmlReport() {
    const duration = ((new Date() - this.startTime) / 1000).toFixed(2);
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    
    let rows = this.results.map(r => `
      <tr class="${r.status.toLowerCase()}">
        <td>${r.time}</td>
        <td>${r.step}</td>
        <td><span class="status-pill ${r.status.toLowerCase()}">${r.status}</span></td>
        <td>${r.details}</td>
      </tr>
    `).join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${this.featureName} Test Report</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7f6; margin: 0; padding: 40px; }
    .container { max-width: 1000px; margin: auto; background: white; padding: 30px; border-radius: 20px; shadow: 0 10px 30px rgba(0,0,0,0.05); }
    h1 { color: #0f172a; margin-top: 0; }
    .summary { display: flex; gap: 20px; margin-bottom: 30px; }
    .stat-card { flex: 1; padding: 20px; border-radius: 15px; text-align: center; color: white; }
    .stat-card.duration { background: #6366f1; }
    .stat-card.passed { background: #10b981; }
    .stat-card.failed { background: #ef4444; }
    .stat-value { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
    .stat-label { font-size: 14px; opacity: 0.9; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { text-align: left; padding: 15px; background: #f8fafc; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; }
    tr.fail { background: #fef2f2; }
    .status-pill { padding: 4px 10px; border-radius: 100px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
    .status-pill.pass { background: #d1fae5; color: #065f46; }
    .status-pill.fail { background: #fee2e2; color: #991b1b; }
    .status-pill.info { background: #e0f2fe; color: #075985; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${this.featureName} Automation Report</h1>
    <div class="summary">
      <div class="stat-card duration">
        <div class="stat-value">${duration}s</div>
        <div class="stat-label">Duration</div>
      </div>
      <div class="stat-card passed">
        <div class="stat-value">${passCount}</div>
        <div class="stat-label">Steps Passed</div>
      </div>
      <div class="stat-card failed">
        <div class="stat-value">${failCount}</div>
        <div class="stat-label">Steps Failed</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Test Step</th>
          <th>Status</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
</body>
</html>`;

    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
    
    const fileName = this.featureName.toLowerCase().replace(/\s+/g, '_') + '_report.html';
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, html);
    console.log(`Report generated: ${filePath}`);
    return filePath;
  }

  async quit() {
    if (this.driver) await this.driver.quit();
  }
}

module.exports = TestHelper;
