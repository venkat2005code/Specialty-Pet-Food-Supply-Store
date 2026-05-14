const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 640 });
  await page.goto('http://localhost:8080/home2.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'home2-mobile.png', fullPage: true });
  
  await page.goto('http://localhost:8080/dashboard.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'dashboard-mobile.png', fullPage: true });
  
  await browser.close();
})();
