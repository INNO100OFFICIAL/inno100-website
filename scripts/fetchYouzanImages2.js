const axios = require('axios');
const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./data/deduped-products.json', 'utf-8'));

// Clear fake Amazon URLs (all 404)
const cleaned = products.map(p => ({ ...p, image: null }));

async function fetchYouzanImage(goodsId) {
  // Try Youzan's internal goods detail JSON API
  const attempts = [
    // Direct goods JSON endpoint
    {
      url: `https://shop187771375.m.youzan.com/api/goods/detail.json?goods_id=${goodsId}&alias=iW8e0tnAN8`,
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Mobile Safari/604.1' }
    },
    // Try fetching the goods page HTML and parsing OG image
    {
      url: `https://shop187771375.m.youzan.com/v2/goods/${goodsId}?alias=iW8e0tnAN8`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      }
    },
  ];

  for (const attempt of attempts) {
    try {
      const res = await axios.get(attempt.url, {
        headers: attempt.headers,
        timeout: 10000,
        maxRedirects: 5,
      });

      const content = typeof res.data === 'object' ? JSON.stringify(res.data) : res.data;

      // Search for yzcdn image URLs
      const patterns = [
        /https?:\/\/img\.yzcdn\.cn\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi,
        /https?:\/\/[^"'\s]+yzcdn\.cn\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi,
        /"cover":"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"/i,
        /"image_url":"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"/i,
        /<meta property="og:image" content="([^"]+)"/i,
      ];

      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match) {
          let imgUrl = match[1] || match[0];
          if (imgUrl && imgUrl.length > 10) return imgUrl;
        }
      }
    } catch (e) {
      // continue
    }
  }
  return null;
}

async function main() {
  console.log(`Fetching images for ${cleaned.length} products...\n`);
  const imageMap = {};
  let found = 0;

  // Test with first 5 products
  for (const product of cleaned.slice(0, 5)) {
    const img = await fetchYouzanImage(product.id);
    if (img) {
      imageMap[product.id] = img;
      found++;
      console.log(`[OK]   ${product.nameEn}`);
      console.log(`       ${img}\n`);
    } else {
      console.log(`[FAIL] ${product.nameEn} (id: ${product.id})\n`);
    }
    await new Promise(r => setTimeout(r, 800));
  }
  console.log(`Found: ${found}/5`);
}

main().catch(console.error);
