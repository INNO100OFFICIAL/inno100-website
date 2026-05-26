const axios = require('axios');
const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./data/deduped-products.json', 'utf-8'));

// Try Youzan public goods API
async function fetchYouzanImage(goodsId) {
  const urls = [
    // Try the mobile goods API endpoint
    `https://shop187771375.m.youzan.com/v2/goods/${goodsId}?alias=iW8e0tnAN8`,
    // Try the H5 goods page
    `https://h5.youzan.com/v2/goods/${goodsId}?alias=iW8e0tnAN8`,
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Referer': 'https://shop187771375.m.youzan.com/',
        },
        timeout: 8000,
        maxRedirects: 5,
      });

      const html = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);

      // Try various patterns to find image URL
      const patterns = [
        /og:image[^>]*content="([^"]+)"/,
        /"goodsInfo".*?"image":"([^"]+)"/,
        /"cover":"([^"]+)"/,
        /yzcdn\.cn\/upload[^"'\s]+\.(jpg|jpeg|png|webp)/i,
        /img\.yzcdn\.cn[^"'\s]+\.(jpg|jpeg|png|webp)/i,
        /"thumb":"([^"]+yzcdn[^"]+)"/,
      ];

      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) {
          let imgUrl = match[1] || match[0];
          if (!imgUrl.startsWith('http')) imgUrl = 'https:' + imgUrl;
          return imgUrl;
        }
      }
    } catch (e) {
      // continue to next URL
    }
  }
  return null;
}

async function main() {
  const noImage = products.filter(p => !p.image);
  console.log(`Fetching images for ${noImage.length} products without images...\n`);

  let found = 0;
  const imageMap = {};

  for (const product of noImage.slice(0, 10)) { // test first 10
    const img = await fetchYouzanImage(product.id);
    if (img) {
      imageMap[product.id] = img;
      found++;
      console.log(`[OK] ${product.nameEn}`);
      console.log(`     ${img}`);
    } else {
      console.log(`[FAIL] ${product.nameEn} (id: ${product.id})`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nFound: ${found}/10 images`);
}

main().catch(console.error);
