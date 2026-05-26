const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3002/menu', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'menu-products.png', fullPage: true });
  console.log('Screenshot saved to menu-products.png');
  await browser.close();
})();
