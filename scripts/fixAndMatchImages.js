/**
 * Step 1: Remove wrong images (all same "开盖-正.png" file)
 * Step 2: Scan Eagle library filesystem directly, match folders to products
 * Step 3: Copy correct images
 */
const fs = require('fs');
const path = require('path');

const LIBRARY = 'D:/1.library/images';
const DEST = 'C:/Users/Administrator/inno100-website/public/images/products';
const PRODUCTS_FILE = 'C:/Users/Administrator/inno100-website/data/deduped-products.json';

// The bad file to detect wrong copies (same filename pattern from eagle)
// File size of 开盖-正.png
const BAD_EAGLE_ID = 'MP2DWHDLZS3Q3';
const badFilePath = path.join(LIBRARY, BAD_EAGLE_ID + '.info').replace(/\//g, '\\');
let badFileSize = null;
try {
  const files = fs.readdirSync(badFilePath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  if (files[0]) badFileSize = fs.statSync(path.join(badFilePath, files[0])).size;
} catch(e) {}
console.log('Bad file size:', badFileSize);

// Load products
const products = require(PRODUCTS_FILE);

// Step 1: Find and remove wrong images
let removedCount = 0;
const cleanedProducts = products.map(p => {
  if (!p.image) return p;
  const imgPath = path.join(DEST, path.basename(p.image)).replace(/\//g, '\\');
  if (fs.existsSync(imgPath) && badFileSize) {
    const size = fs.statSync(imgPath).size;
    if (size === badFileSize) {
      // Remove wrong image file
      try { fs.unlinkSync(imgPath); } catch(e) {}
      removedCount++;
      return { ...p, image: null };
    }
  }
  return p;
});
console.log(`Removed ${removedCount} wrong images`);

// Step 2: Build folder->items map by reading Eagle metadata files
console.log('\nScanning Eagle library...');
const folderItems = {}; // folderId -> [{ id, name, ext, filePath }]

const infoDirs = fs.readdirSync(LIBRARY.replace(/\//g, '\\')).filter(d => d.endsWith('.info'));
let scanned = 0;
for (const dir of infoDirs) {
  const metaPath = path.join(LIBRARY, dir, 'metadata.json').replace(/\//g, '\\');
  if (!fs.existsSync(metaPath)) continue;
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const ext = (meta.ext || '').toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) continue;
    if (meta.isDeleted) continue;

    // Find the actual image file
    const dirPath = path.join(LIBRARY, dir).replace(/\//g, '\\');
    const files = fs.readdirSync(dirPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    if (!files.length) continue;

    const filePath = path.join(dirPath, files[0]);

    for (const folderId of (meta.folders || [])) {
      if (!folderItems[folderId]) folderItems[folderId] = [];
      folderItems[folderId].push({
        id: meta.id,
        name: meta.name,
        ext,
        filePath,
        btime: meta.btime || 0
      });
    }
    scanned++;
  } catch(e) {}
}
console.log(`Scanned ${scanned} image items`);
console.log(`Found items in ${Object.keys(folderItems).length} folders`);

// Eagle folder ID -> product IDs mapping
const FOLDER_TO_PRODUCTS = {
  'MKFIDVEEPT2O7': ['5270292961', '4447619730'],   // DWARF
  'MMWWPQUVFL8XW': ['5270292961', '4447619730'],   // DWARF 3 Photos
  'MKFKAY6UBF1FG': ['5428392953', '5428394637'],   // 重力星球
  'MKF293U175RTQ': ['5295798098', '5295875221'],    // Aeroband
  'MKFJ1S4FN8CIC': ['5295983758'],                  // 拿火 Nafire
  'MKFBP88O4JE5S': ['5396685490'],                  // 哈曼卡顿 Harman Kardon
  'MKFIF6J7V3BP3': ['5295476585', '4465046212'],    // moft
  'MKFIMSCEFNAAG': ['5396687350'],                  // VITURE
  'MKF2BYCSRWNS0': ['5396687350'],                  // VITURE (2nd)
  'MKFHT97ZX0KON': ['4516639446'],                  // LOOI
  'MKF14HC4X1K8K': ['5396687838'],                  // RingConn
  'MOKVIQAI605DB': ['5396687838'],                  // RingConn main folder
  'MOKVJH3H8MPX0': ['5396687838'],                  // RingConn product photos
  'MKF0WZ2RL7H7G': ['5395680405', '4516324646'],    // Rokid
  'MKFHQZNAB24TC': ['5371898252'],                  // 芙崽 Fuzozo
  'MKFHOATS4P0PA': ['5297981662'],                  // Musspark
  'MKFHVAK95JALU': ['4472426178'],                  // 极械魔鬼鱼
  'MKF24C3QTLTSM': ['5348186078'],                  // Phantom chess
  'MKFIPX1RMKZR8': ['5268775838', '5254890207'],    // 清闲 ergonomic chair
  'MJ8DYKVS7YHU5': ['5268775838', '5254890207'],    // 清闲产品图
  'MKFKMLRUZ0MO6': ['4468548235'],                  // 图拉斯 Keychron
  'MKEWU41EXL1CW': ['5394779080'],                  // 怒喵 mouse
  'MKEWL2JRAXCXV': ['5254391058'],                  // Snapmaker
  'MJBEFF69TZ0UX': ['5254391058'],                  // snapmaker (2nd)
  'MKEWFRIEFFKMO': ['4467040268', '5270699815'],    // Pluad
  'MKEWWKQPWQEZN': ['4453526815'],                  // 音诺 InnAIO
  'MKEX9T3Z4L1OO': ['5302999433'],                  // Babycare luggage
  'MKF0QT86LBXCL': ['5395581431'],                  // 耐尔金 keyboard
  'MKEZQIXES1NLA': ['5268890566', '5268877360', '4452430652', '5268995604', '4452424905', '5268985136', '5268696296', '4452304103', '5268599229', '5261096838', '4448749084', '4448738750', '5632979576'],
  'MNY0YU37MQXCX': ['4452430652', '5268995604'],   // PGY首发
  'MMOS8EKO1F5TV': ['4448738750'],                  // 摄影手柄
  'MMMTYXTZI0YVT': ['4614329673', '5603376144', '4614328977', '5603390408'], // HOTO小猴
  'MMMU0NQ32COQD': ['4614329673'],                  // HOTO V1
  'MMMU0JIJLB1ZV': ['5603376144'],                  // HOTO P2
  'MMMU06D4DP7C3': ['4614328977'],                  // HOTO P1
  'MM5SCUOLCFMJN': ['5271486350'],                  // SANDSARA
  'MM4ECF6694C8U': ['4472548262', '5295285297'],    // CNC
  'MLHOMAZGCY5BZ': ['4611929521'],                  // xTool F2 Ultra UV
  'MLF27MTBABRBV': ['5296098970', '5296092550', '5296290516'], // Xtool general
  'ML4XWJ750EYFB': ['4468435911', '5295576404', '5503184178'], // 恩雅 piano
  'MKKXF1DJG59FA': ['5363196443'],                  // 极哲 projector
  'MKKVOJDIYYDKT': ['4479132326', '5492597392'],    // iKKO
  'MKF3RFXW6KYXE': ['5396689717'],                  // 原子制造 AtomStack
  'MKF2TA74RICNW': ['5396688635'],                  // Insta360 Ace Pro 2
  'MKF2R0APVWQJQ': ['5396688635'],                  // 影石Insta
  'MKF16SPJ7PAQZ': ['5396688618', '5503386683'],    // hypershell
  'MKF2B81MGP63M': ['4516719670'],                  // loona -> Ivy robot
  'MMVQPQVIIQHI3': ['5297984215'],                  // eufyMake
  'MKGGSF9WR22SC': ['4492932227'],                  // 企业定制 Creality
  'MKF2HKUUVQCK6': ['5392498034'],                  // 惊奇屋 Wunderkammer
  'MJA312ZV1SI87': ['4445920717'],                  // Livtab standing desk
  'MJA5OHIDH2994': ['5254397965'],                  // LAVA STUDIO
  'MJA5OI8VW6BT2': ['5254397965'],                  // 超能音乐工作站
  'MKF2BNNTBB11V': ['5344275528'],                  // 啄木鸟 LaserPecker
  'MOWQ6THOFRPCE': ['5276687546', '5276682530'],    // 如意葫芦 Wright glass
  'MOL1XHG7IG6T9': ['4696817518'],                  // ViewX
  'MMWX1A2BUR99P': ['4616106141', '4616127943', '5607098009', '5607097909', '4616102245', '5606896096'], // Cocinare
  'MN5GC7NBX6SOX': ['4616106141'],                  // Cocinare preview
  'MN2RFB2YOSV4T': ['4690518214'],                  // eight sleep -> RingConn Gen3?
  'MKF25HM1LQO75': ['4516819982'],                  // Ropet robot
  'MKFIM9BCDHSCB': ['4465023100'],                  // 哈浮 HOVER camera
  'MKFJMDXM7CBFQ': ['4532434893', '5428589037'],    // nothing earbuds
  'MKF1SP3ASEAS8': ['5276293934', '4455633767', '5276281677'], // PLANTSIO -> PETKIT
  'MOGWF7QT037YZ': ['5275585211', '5275290119', '4455221862'], // 维他动力 -> TINY
  'MKF0SSA7R0H8O': ['5258486984', '4530802374'],    // 制糖工厂
  'MKF1AU9BG4F3J': ['4465023100'],                  // xpro -> hafu
  'MKGI199CZ8DD0': ['5297984215'],                  // 滚动轮播图
  'MK2E4NDTYY6T2': ['5472075080'],                  // 央视截图 -> revopoint
  'MOWR1OOO3252U': ['5392498034'],                  // 阿米纳艺术音响 -> Wunderkammer?
  'MN32VXK8GPY7S': ['4620835818'],                  // 120W充电站 -> Anker
  'MN32VBJVGGY6G': ['5616675437'],                  // 花线 -> Anker Ruyi
  'MN32V146KC1YM': ['4621131070'],                  // 100cc -> Soundcore recorder?
  'MN32UNKKC7RIX': ['4620826680', '4621029200'],    // 40w充电器 -> Anker
  'MN32U9X328SLP': ['4620826680'],                  // 67w充电器 -> Anker
  'MN32T7ZYU21YC': ['4447601205', '4447548380', '5258582521'], // o线 -> 闪极
  'MN2ZTCPPIT5TI': ['4530802374'],                  // 小电拼套装
  'MP2DJHIIAMTTL': ['4719205648', '5529283970'],    // 造物时代 (TGIF chair, Livtab)
  'MP2DPV84DU2DN': ['4719205648'],                  // Z1 场景图 -> 造物时代
};

// Step 3: Copy images
console.log('\nCopying images...');
const newImages = {};
let copyCount = 0;

for (const [folderId, productIds] of Object.entries(FOLDER_TO_PRODUCTS)) {
  const items = folderItems[folderId];
  if (!items || !items.length) continue;

  // Sort by btime (oldest first = usually the main product shot)
  const sorted = items.sort((a, b) => a.btime - b.btime);
  const item = sorted[0];

  for (const productId of productIds) {
    const product = cleanedProducts.find(p => p.id === productId);
    if (!product || product.image || newImages[productId]) continue;

    const ext = '.' + item.ext.toLowerCase();
    const destPath = path.join(DEST, `${productId}${ext}`).replace(/\//g, '\\');

    if (fs.existsSync(destPath)) {
      newImages[productId] = `/images/products/${productId}${ext}`;
      continue;
    }

    try {
      fs.copyFileSync(item.filePath, destPath);
      console.log(`[OK] ${productId} <- folder ${folderId} (${item.name}.${item.ext})`);
      newImages[productId] = `/images/products/${productId}${ext}`;
      copyCount++;
    } catch (e) {
      console.log(`[ERR] ${productId}: ${e.message}`);
    }
  }
}

console.log(`\nCopied ${copyCount} new images`);

// Update products.json
const updated = cleanedProducts.map(p => ({
  ...p,
  image: newImages[p.id] || p.image || null,
}));

fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updated, null, 2));

const withImg = updated.filter(p => p.image).length;
const withoutImg = updated.filter(p => !p.image).length;
console.log(`\nWith image: ${withImg}`);
console.log(`Without image: ${withoutImg}`);
console.log('\nProducts STILL without image:');
updated.filter(p => !p.image).forEach(p => console.log('  ' + p.id + ' | ' + p.nameEn));
