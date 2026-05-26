const http = require('http');
const fs = require('fs');
const path = require('path');

const EAGLE_API = 'http://localhost:41595';
const LIBRARY_PATH = 'D:/1.library/images';
const DEST = 'C:/Users/Administrator/inno100-website/public/images/products';
const PRODUCTS_FILE = 'C:/Users/Administrator/inno100-website/data/deduped-products.json';

fs.mkdirSync(DEST, { recursive: true });

function apiGet(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(EAGLE_API + urlPath, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// Get first image from a folder
async function getFirstImage(folderId) {
  const res = await apiGet(`/api/item/list?folderId=${folderId}&limit=50`);
  const items = (res.data || []).filter(i =>
    ['jpg', 'jpeg', 'png', 'webp'].includes((i.ext || '').toLowerCase()) &&
    !i.noPreview
  );
  if (!items.length) return null;
  // Prefer items with product-looking names (shorter, no "副本")
  const sorted = items.sort((a, b) => {
    const aScore = (a.name.includes('副本') ? -10 : 0) + (a.name.length < 30 ? 5 : 0);
    const bScore = (b.name.includes('副本') ? -10 : 0) + (b.name.length < 30 ? 5 : 0);
    return bScore - aScore;
  });
  return sorted[0];
}

// Eagle subfolder name -> product IDs mapping
// Based on products list and Eagle folder names
const FOLDER_TO_PRODUCT = {
  // Eagle folder ID -> array of product IDs
  'MKFIDVEEPT2O7': ['5270292961', '4447619730'],   // DWARF -> DWARF 3
  'MKFKAY6UBF1FG': ['5428392953', '5428394637'],   // 重力星球 -> Pojun keyboard/mouse
  'MKF293U175RTQ': ['5295798098', '5295875221'],    // Aeroband -> guitar/drum
  'MKFJ1S4FN8CIC': ['5295983758'],                  // 拿火 -> Nafire
  'MKFBP88O4JE5S': ['5396685490'],                  // 哈曼卡顿 -> Harman Kardon
  'MKFIF6J7V3BP3': ['5295476585', '4465046212'],    // moft -> MOFT
  'MKFIMSCEFNAAG': ['5396687350'],                  // VITURE -> VITURE glasses (first)
  'MKF2BYCSRWNS0': ['5396687350'],                  // VITURE (second)
  'MKFHT97ZX0KON': ['4516639446'],                  // LOOI -> LOOI robot
  'MKF14HC4X1K8K': ['5396687838'],                  // RingConn -> RingConn ring
  'MKF0WZ2RL7H7G': ['5395680405', '4516324646'],    // Rokid -> AR glasses
  'MKFHQZNAB24TC': ['5371898252'],                  // 芙崽 -> Fuzozo robot
  'MKFHOATS4P0PA': ['5297981662'],                  // Musspark -> AI guitar
  'MKF25HM1LQO75': ['4500345049'],                  // Ropet -> (check)
  'MKFHVAK95JALU': ['4472426178'],                  // 极械魔鬼鱼 -> mechanical art
  'MKF24C3QTLTSM': ['5348186078'],                  // Phantom -> chess
  'MKFIPX1RMKZR8': ['5268775838', '5254890207'],    // 清闲 -> ergonomic chair
  'MJ8DYKVS7YHU5': ['5268775838', '5254890207'],    // 清闲产品图
  'MKFKMLRUZ0MO6': ['4468548235'],                  // 图拉斯 -> (Keychron related?)
  'MKEWU41EXL1CW': ['5394779080'],                  // 怒喵 -> mouse
  'MKEWQQWILYQH6': ['4516647218'],                  // Haloasis -> speaker (already mapped)
  'MKEWL2JRAXCXV': ['5254391058'],                  // Snapmaker -> U1
  'MKEWFRIEFFKMO': ['4467040268'],                  // Pluad -> Plaud Note
  'MKEWDKP9ZOROM': ['5319090181', '5319178128'],    // 极印 -> photo printers (already mapped)
  'MKEWWKQPWQEZN': ['4453526815'],                  // 音诺 -> InnAIO translator
  'MKEX9T3Z4L1OO': ['5302999433'],                  // Babycare -> luggage
  'MKF0QT86LBXCL': ['5395581431'],                  // 耐尔金 -> keyboard
  'MKEZQIXES1NLA': ['5268890566', '5268877360', '4452430652', '5268995604', '4452424905', '5268985136', '5268696296', '4452304103', '5268599229', '5261096838', '4448749084', '4448738750'], // PGY -> PGYTECH products
  'MKFIPX1RMKZR8': ['5268775838', '5254890207'],    // 清闲
  'MMMTYXTZI0YVT': ['4592348545'],                  // HOTO -> FUN TECH LAB? (check name)
  'MM5SCUOLCFMJN': ['5271486350'],                  // SANDSARA -> sand art
  'MM4ECF6694C8U': ['4472548262', '5295285297'],    // CNC
  'MLF27MTBABRBV': ['5296098970', '5296092550'],    // Xtool
  'ML4XWJ750EYFB': ['4468435911', '5295576404'],    // 恩雅 -> piano
  'MKKXF1DJG59FA': ['5363196443'],                  // 极哲 -> projector
  'MKKVOJDIYYDKT': ['4479132326'],                  // iKKO -> phone
  'MKFJ1S4FN8CIC': ['5295983758'],                  // 拿火
  'MKF3RFXW6KYXE': ['5396689717'],                  // 原子制造 -> AtomStack
  'MKF2R0APVWQJQ': ['5396688635'],                  // 影石Insta -> Ace Pro 2
  'MKF16SPJ7PAQZ': ['5396688618'],                  // hypershell -> exoskeleton
  'MKF2B81MGP63M': ['4516719670'],                  // loona -> Ivy robot?
  'MKF1SP3ASEAS8': ['5276293934', '4455633767', '5276281677'],  // PLANTSIO -> PETKIT?
  'MKF0SSA7R0H8O': ['5271486350'],                  // 制糖工厂 -> sand art?
  'MKGI199CZ8DD0': ['5297984215'],                  // 滚动轮播图 -> eufyMake
  'MKGGSF9WR22SC': ['4492932227'],                  // 企业定制 -> Creality
  'MKF2HKUUVQCK6': ['5392498034'],                  // 惊奇屋 -> Wunderkammer
  'MJA312ZV1SI87': ['4445920717'],                  // Livtab -> standing desk
  'MJA5OHIDH2994': ['5254397965'],                  // LAVA STUDIO -> music workstation
  'MKFHVAK95JALU': ['4472426178'],                  // 极械
  'MKF2BNNTBB11V': ['5344275528'],                  // 啄木鸟 -> LaserPecker
  'MKFHT97ZX0KON': ['4516639446'],                  // LOOI
  'MKF0SSA7R0H8O': ['5258486984'],                  // 制糖工厂 -> Curious Rabbit?
  'MOWQ6THOFRPCE': ['5276687546', '5276682530'],    // 如意葫芦 -> Wright glass?
  'MOL1XHG7IG6T9': ['5275585211', '5275290119', '4455221862'],  // ViewX -> TINY SHOWER/PUMP?
};

(async () => {
  const products = require(PRODUCTS_FILE);
  const productsWithoutImg = products.filter(p => !p.image);
  console.log(`Products without images: ${productsWithoutImg.length}`);

  const copied = {};
  let count = 0;

  for (const [folderId, productIds] of Object.entries(FOLDER_TO_PRODUCT)) {
    // Get first image from this Eagle folder
    let item = null;
    try {
      item = await getFirstImage(folderId);
    } catch (e) {
      console.log(`[ERR] Folder ${folderId}: ${e.message}`);
      continue;
    }

    if (!item) {
      console.log(`[SKIP] No image in folder ${folderId}`);
      continue;
    }

    // Construct source path
    const srcPath = path.join(LIBRARY_PATH, `${item.id}.info`, `${item.name}.${item.ext}`).replace(/\//g, '\\');

    if (!fs.existsSync(srcPath)) {
      // Try without special chars
      console.log(`[MISS] ${srcPath}`);
      continue;
    }

    for (const productId of productIds) {
      // Skip products that already have images
      const product = products.find(p => p.id === productId);
      if (!product) continue;
      if (product.image) {
        console.log(`[SKIP-HAS] ${productId} already has image`);
        continue;
      }

      const ext = '.' + item.ext.toLowerCase();
      const destPath = path.join(DEST, `${productId}${ext}`).replace(/\//g, '\\');

      if (fs.existsSync(destPath)) {
        console.log(`[EXIST] ${productId}`);
        copied[productId] = `/images/products/${productId}${ext}`;
        continue;
      }

      try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`[OK] ${productId} (${product.name}) <- ${item.name}.${item.ext}`);
        copied[productId] = `/images/products/${productId}${ext}`;
        count++;
      } catch (e) {
        console.log(`[ERR] ${productId}: ${e.message}`);
      }
    }
  }

  console.log(`\nCopied ${count} new images`);

  // Update products.json
  const updated = products.map(p => ({
    ...p,
    image: copied[p.id] || p.image || null
  }));

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updated, null, 2));

  const withImg = updated.filter(p => p.image).length;
  const withoutImg = updated.filter(p => !p.image).length;
  console.log(`With image: ${withImg}`);
  console.log(`Without image: ${withoutImg}`);
  console.log('\nProducts still without image:');
  updated.filter(p => !p.image).forEach(p => console.log(`  ${p.id} | ${p.name}`));
})();
