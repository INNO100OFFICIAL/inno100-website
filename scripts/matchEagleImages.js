const https = require('https');
const fs = require('fs');
const path = require('path');

const EAGLE_API = 'http://localhost:41595';
const FOLDER_ID = 'MKEWD584E5IXS'; // 年会礼品合计1
const DEST = 'C:/Users/Administrator/inno100-website/public/images/products';
const PRODUCTS_FILE = 'C:/Users/Administrator/inno100-website/data/deduped-products.json';

// Ensure destination exists
fs.mkdirSync(DEST, { recursive: true });

// Load products
const products = require(PRODUCTS_FILE);

// Fetch Eagle items
async function fetchEagleItems() {
  return new Promise((resolve, reject) => {
    const url = `${EAGLE_API}/api/item/list?folderId=${FOLDER_ID}&limit=500`;
    const req = require('http').get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.data || []);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

// Match product name to Eagle item name (fuzzy)
function matchName(productName, eagleName) {
  const p = productName.toLowerCase().replace(/[^a-z0-9一-龥]/g, '');
  const e = eagleName.toLowerCase().replace(/[^a-z0-9一-龥]/g, '');

  // Exact match
  if (p === e) return 100;

  // Contains
  if (e.includes(p) || p.includes(e)) return 80;

  // Word overlap
  const pWords = p.match(/[一-龥]+|[a-z0-9]+/g) || [];
  const eWords = e.match(/[一-龥]+|[a-z0-9]+/g) || [];
  const overlap = pWords.filter(w => eWords.some(ew => ew.includes(w) || w.includes(ew))).length;
  if (overlap > 0) return 50 + overlap * 10;

  return 0;
}

(async () => {
  console.log('Fetching Eagle items...');
  const items = await fetchEagleItems();
  console.log(`Found ${items.length} items in Eagle`);

  // Filter image items only
  const imageItems = items.filter(item =>
    ['jpg', 'jpeg', 'png', 'webp'].includes((item.ext || '').toLowerCase())
  );
  console.log(`${imageItems.length} are images`);

  // Match products without images
  const productsWithoutImage = products.filter(p => !p.image);
  console.log(`${productsWithoutImage.length} products need images`);

  const matched = [];
  const copied = {};

  for (const product of productsWithoutImage) {
    let bestMatch = null;
    let bestScore = 0;

    // Try matching with Chinese name
    for (const item of imageItems) {
      const score = matchName(product.name, item.name);
      if (score > bestScore && score >= 50) {
        bestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch) {
      matched.push({
        productId: product.id,
        productName: product.name,
        eagleName: bestMatch.name,
        eaglePath: bestMatch.filePath,
        score: bestScore
      });
    }
  }

  console.log(`\nMatched ${matched.length} products:`);

  // Copy files
  let copyCount = 0;
  for (const m of matched) {
    const srcPath = m.eaglePath;
    if (!fs.existsSync(srcPath)) {
      console.log(`[MISS] ${m.productId} - file not found: ${srcPath}`);
      continue;
    }

    const ext = path.extname(srcPath).toLowerCase();
    const destPath = path.join(DEST, `${m.productId}${ext}`);

    if (fs.existsSync(destPath)) {
      console.log(`[EXIST] ${m.productId} - ${m.productName}`);
      copied[m.productId] = `/images/products/${m.productId}${ext}`;
      continue;
    }

    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[OK] ${m.productId} - ${m.productName} (score: ${m.score})`);
      console.log(`     Eagle: ${m.eagleName}`);
      copied[m.productId] = `/images/products/${m.productId}${ext}`;
      copyCount++;
    } catch (e) {
      console.log(`[ERR] ${m.productId} - ${e.message}`);
    }
  }

  console.log(`\nCopied ${copyCount} new images from Eagle`);

  // Update products.json
  const updated = products.map(p => ({
    ...p,
    image: copied[p.id] || p.image || null
  }));

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updated, null, 2));

  const withImage = updated.filter(p => p.image).length;
  const withoutImage = updated.filter(p => !p.image).length;
  console.log(`\nUpdated deduped-products.json`);
  console.log(`  With image:    ${withImage}`);
  console.log(`  Without image: ${withoutImage}`);
})();
