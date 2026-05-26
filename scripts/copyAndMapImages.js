const fs = require('fs');
const path = require('path');

const DEST = 'C:/Users/Administrator/inno100-website/public/images/products';

// Ensure destination folder exists
fs.mkdirSync(DEST, { recursive: true });

// Helper: get first image from a folder
function firstImg(dir, preferSKU = false) {
  try {
    // If prefer SKU subfolder
    if (preferSKU) {
      const skuDir = path.join(dir, 'SKU图');
      if (fs.existsSync(skuDir)) {
        const files = fs.readdirSync(skuDir)
          .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith('.'))
          .sort();
        if (files.length) return path.join(skuDir, files[0]);
      }
      const mainDir = path.join(dir, '产品高清主图');
      if (fs.existsSync(mainDir)) {
        const files = fs.readdirSync(mainDir)
          .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith('.'))
          .sort();
        if (files.length) return path.join(mainDir, files[0]);
      }
      const mainDir2 = path.join(dir, '800主图');
      if (fs.existsSync(mainDir2)) {
        const files = fs.readdirSync(mainDir2)
          .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith('.'))
          .sort();
        if (files.length) return path.join(mainDir2, files[0]);
      }
      const mainDir3 = path.join(dir, '主图');
      if (fs.existsSync(mainDir3)) {
        const files = fs.readdirSync(mainDir3)
          .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith('.'))
          .sort();
        if (files.length) return path.join(mainDir3, files[0]);
      }
    }
    const files = fs.readdirSync(dir)
      .filter(f => /\.(jpg|jpeg|png|webp|jpeg)$/i.test(f) && !f.startsWith('.'))
      .sort();
    if (files.length) return path.join(dir, files[0]);
  } catch (e) {}
  return null;
}

// Map: product id -> source image path
const ID_TO_SRC = {
  // OXS Thunder Pro+ gaming speaker
  '4455703221': firstImg('E:/官网产品/OXS傲希-Thunder Pro+/产品高清主图'),

  // Haloasis A1 holographic speaker
  '4516647218': 'E:/官网产品/HALOASIS A1/12191248_00.jpg',

  // FUN TECH LAB Wind Tunnel
  '4592348545': 'E:/官网产品/FUN  TECH LAB/202512191610226913616763.png',

  // 轰炸机咖啡 products
  '5276482592': 'E:/官网产品/轰炸机咖啡/X-press58意式咖啡机/SKU图/202512231308235119798259.jpg',  // X-press 58 Espresso Machine
  '4455829091': 'E:/官网产品/轰炸机咖啡/小魔方3.0Micro/SKU图/202512231353587148622600.jpg',      // Mini Cube Coffee Scale
  '4455748955': 'E:/官网产品/轰炸机咖啡/旗舰版-拉花缸5.0-磨砂黑/SKU图/202512231326171852790427.jpg', // Flagship Latte Art Pitcher
  '5276478692': 'E:/官网产品/轰炸机咖啡/航海家F74磨豆机/SKU图/202512231318194723814357.jpg',      // Navigator F74 Grinder
  '5276679444': 'E:/官网产品/轰炸机咖啡/驭.旋风搅粉针/SKU图/202512231334113724954094.jpg',       // YU Distribution Needle
  '4455825706': 'E:/官网产品/轰炸机咖啡/驭.系列无极布粉器/SKU图/202512231335567284354835.jpg',    // YU Distributor
  '5276584414': 'E:/官网产品/轰炸机咖啡/骑士冲击粉锤/SKU图/202512231341338724462286.jpg',        // Knight Coffee Tamper

  // 重力星球 (Pojun) products
  '5428392953': firstImg('E:/官网产品/重力星球/破茧75 K1 PRO 赛博朋克机械键盘/800主图'),        // Pojun 75 K1 Pro Keyboard
  '5428394637': firstImg('E:/官网产品/重力星球/破茧X 三模电竞游戏鼠标-黑色/800主图'),           // Pojun X Mouse

  // 极印 (Jiyin) photo printers
  '5319090181': firstImg('E:/官网产品/极印/N2产品高清主图'),   // Jiyin Photo Printer N2
  '5319178128': firstImg('E:/官网产品/极印/极印口袋照片打印机N1/主图'), // Jiyin Pocket Photo Printer N1

  // AeroBand / Nafire guitar
  '5295798098': 'E:/官网产品/万物定制工坊资料/AEROBAND吉他/AEROBAND吉他.png',  // Aeroband PocketGuitar
  '5295983758': 'E:/官网产品/万物定制工坊资料/AEROBAND吉他/AEROBAND吉他.png',  // Nafire Spirit Air Guitar

  // Xhorse CNC products (use same CNC image)
  '4472548262': 'E:/官网产品/万物定制工坊资料/CNC五轴/12191909_00.jpg',   // Xhorse 3D Desktop 5-Axis CNC
  '5295285297': 'E:/官网产品/万物定制工坊资料/CNC五轴/12191909_00.jpg',   // Xhorse 3D Xmachine XM-100

  // DWARF telescope (two separate products use same image)
  '5270292961': 'E:/官网产品/万物定制工坊资料/DWARFLAB望远镜/DWARFLAB望远镜.png',  // DWARF 3 Smart Telescope
  '4447619730': 'E:/官网产品/万物定制工坊资料/DWARFLAB望远镜/DWARFLAB望远镜.png',  // DWARF 3 Smart Astronomy Telescope

  // UV Custom Fridge Magnets
  '5259876817': 'E:/官网产品/万物定制工坊资料/UV打印/UV打印.png',

  // HOZO Ultrasonic Cutter
  '5271289367': 'E:/官网产品/万物定制工坊资料/HOZO超声波切割刀小课堂/Hozo超声波切割刀_SOP.png',  // HOZO Ultrasonic Cutter
  '5271296577': 'E:/官网产品/万物定制工坊资料/HOZO超声波切割刀小课堂/Hozo超声波切割刀_SOP.png',  // HOZO Dock
  '5271383059': 'E:/官网产品/万物定制工坊资料/HOZO超声波切割刀小课堂/Hozo超声波切割刀_SOP.png',  // HOZO Blades
};

// Copy files and build result map
const copied = {};
let count = 0;

for (const [id, src] of Object.entries(ID_TO_SRC)) {
  if (!src) {
    console.log(`[SKIP] ${id} — no source path computed`);
    continue;
  }

  // Normalize path separators
  const srcNorm = src.replace(/\//g, path.sep);

  if (!fs.existsSync(srcNorm)) {
    console.log(`[MISS] ${id} — ${src}`);
    continue;
  }

  const ext = path.extname(srcNorm).toLowerCase();
  const destFile = path.join(DEST, `${id}${ext}`);

  // Don't re-copy if already done
  if (fs.existsSync(destFile)) {
    console.log(`[EXIST] ${id}${ext}`);
    copied[id] = `/images/products/${id}${ext}`;
    continue;
  }

  try {
    fs.copyFileSync(srcNorm, destFile);
    console.log(`[OK] ${id}${ext} ← ${src.split('/').slice(-2).join('/')}`);
    copied[id] = `/images/products/${id}${ext}`;
    count++;
  } catch (e) {
    console.log(`[ERR] ${id} — ${e.message}`);
  }
}

console.log(`\nCopied: ${count} new images`);
console.log(`Total with image: ${Object.keys(copied).length}`);

// Update deduped-products.json
const products = require('C:/Users/Administrator/inno100-website/data/deduped-products.json');
const updated = products.map(p => ({
  ...p,
  image: copied[p.id] || p.image || null,
}));

fs.writeFileSync(
  'C:/Users/Administrator/inno100-website/data/deduped-products.json',
  JSON.stringify(updated, null, 2)
);

const withImage = updated.filter(p => p.image).length;
const withoutImage = updated.filter(p => !p.image).length;
console.log(`\nUpdated deduped-products.json`);
console.log(`  With image:    ${withImage}`);
console.log(`  Without image: ${withoutImage}`);
