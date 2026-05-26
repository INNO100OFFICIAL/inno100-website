const axios = require('axios');
const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./data/deduped-products.json', 'utf-8'));
const ALIAS = 'iW8e0tnAN8';

async function fetchProductImage(goodsId) {
  try {
    const url = `https://h5.youzan.com/v2/goods/${goodsId}?alias=${ALIAS}`;
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 10000,
    });
    const html = res.data;
    // Try og:image
    const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogMatch) return ogMatch[1];
    // Try yzcdn image
    const yzdnMatch = html.match(/https?:\/\/img\.yzcdn\.cn\/[^"'\s]+\.(jpg|png|webp)/i);
    if (yzdnMatch) return yzdnMatch[0];
    return null;
  } catch (e) {
    return null;
  }
}

async function main() {
  const results = {};
  let fetched = 0;

  for (const product of products) {
    if (product.image) {
      console.log(`[SKIP] ${product.nameEn} (already has image)`);
      continue;
    }
    const img = await fetchProductImage(product.id);
    if (img) {
      results[product.id] = img;
      console.log(`[OK] ${product.nameEn} -> ${img.slice(0, 60)}`);
    } else {
      console.log(`[FAIL] ${product.nameEn}`);
    }
    fetched++;
    await new Promise(r => setTimeout(r, 300)); // polite delay
  }

  // Merge into products
  const updated = products.map(p => ({
    ...p,
    image: results[p.id] || p.image || null,
  }));

  fs.writeFileSync('./data/deduped-products.json', JSON.stringify(updated, null, 2));
  console.log(`\nDone! Fetched ${fetched} images, total with images: ${updated.filter(p => p.image).length}`);
}

main();
