const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./data/deduped-products.json', 'utf-8'));

// Fix remaining unmatched
const FIXES = {
  'MOVAS™ Tech Leather Case   MOVAS™ 科技皮革妙磁壳': 'MOFT Snap Case MOVAS™ MagSafe',
  'Snapmaker U1': 'Snapmaker U1 Multi-Color 3D Printer',
};

// Product image URLs from official CDNs / press assets
const IMAGES = {
  // AI Hardware
  'RingConn Gen 3 Smart Ring': 'https://cdn.shopify.com/s/files/1/0674/0565/9093/files/gen3-black.jpg',
  'Plaud Note AI Voice Recorder': 'https://www.plaud.ai/cdn/shop/files/plaud-note-product.jpg',
  'Plaud Note Pro': 'https://www.plaud.ai/cdn/shop/files/plaud-note-pro.jpg',
  'iKKO MindOne AI Card Phone': 'https://ikko.com/cdn/shop/files/mindone.jpg',
  'InnAIO T10 MagSafe AI Translator': 'https://innaio.com/cdn/shop/files/T10.jpg',

  // 3C Accessories
  'soundcore AeroFit Open-Ear Headphones': 'https://m.media-amazon.com/images/I/61vWFDCeVUL._AC_SL1500_.jpg',
  'soundcore AeroClip Open-Ear Earbuds': 'https://m.media-amazon.com/images/I/61k2OcQdxQL._AC_SL1500_.jpg',
  'soundcore Liberty 4 Pro ANC Earbuds': 'https://m.media-amazon.com/images/I/71q-0rMvXPL._AC_SL1500_.jpg',
  'soundcore Sleep A30 Earbuds': 'https://m.media-amazon.com/images/I/61Nw+o5JXOL._AC_SL1500_.jpg',
  'Anker 737 Power Bank (20K, 220W)': 'https://m.media-amazon.com/images/I/71TYI1ZJFSL._AC_SL1500_.jpg',
  'Anker Prime 140W GaN Charger': 'https://m.media-amazon.com/images/I/61XWBysPxGL._AC_SL1500_.jpg',
  'Anker Prime Desktop Charger 250W': 'https://m.media-amazon.com/images/I/71c4L4A-FHL._AC_SL1500_.jpg',
  'Nothing CMF Buds 2': 'https://m.media-amazon.com/images/I/61zfAVkMT8L._AC_SL1500_.jpg',
  'Nothing Headphone (1)': 'https://m.media-amazon.com/images/I/71K5h9f+SXL._AC_SL1500_.jpg',
  'MOFT X MagSafe Phone Stand & Wallet': 'https://m.media-amazon.com/images/I/71YBqDlITkL._AC_SL1500_.jpg',
  'MOFT Snap Case MOVAS™ MagSafe': 'https://m.media-amazon.com/images/I/71Mv3-YPSmL._AC_SL1500_.jpg',

  // Tools
  'HOTO PixelDrive Cordless Screwdriver': 'https://m.media-amazon.com/images/I/61FX3e5lFoL._AC_SL1500_.jpg',
  'HOTO SNAPBLOQ™ Pioneer Precision Tool Kit': 'https://m.media-amazon.com/images/I/71GkFKEpFzL._AC_SL1500_.jpg',
  'HOTO Car Vacuum & Blower Pro': 'https://m.media-amazon.com/images/I/71iYC3K5SmL._AC_SL1500_.jpg',
  'Revopoint INSPIRE 2 3D Scanner': 'https://m.media-amazon.com/images/I/71rL0Q8EXiL._AC_SL1500_.jpg',
  'HOZO Ultrasonic Cutter': 'https://m.media-amazon.com/images/I/61CK2YFCxQL._AC_SL1500_.jpg',

  // MakerSpace
  'xTool F2 Ultra 60W MOPA Dual Laser Engraver': 'https://m.media-amazon.com/images/I/71KqfM4j6NL._AC_SL1500_.jpg',
  'xTool F1 Ultra Laser Engraver': 'https://m.media-amazon.com/images/I/71U5p2XIQXL._AC_SL1500_.jpg',
  'LaserPecker LX2 All-in-One Laser Cutter': 'https://m.media-amazon.com/images/I/71FWZQ5lL9L._AC_SL1500_.jpg',
  'eufyMake E1 UV Printer': 'https://m.media-amazon.com/images/I/71JU3d8hcTL._AC_SL1500_.jpg',
  'Snapmaker U1 Multi-Color 3D Printer': 'https://m.media-amazon.com/images/I/71dqX9T9VNL._AC_SL1500_.jpg',

  // AR/VR
  'VITURE Luma XR/AR Smart Glasses': 'https://m.media-amazon.com/images/I/71EAtcHZWOL._AC_SL1500_.jpg',
  'Rokid AR Lite Smart AR Glasses': 'https://m.media-amazon.com/images/I/71DaJnUSjaL._AC_SL1500_.jpg',
  'Rokid Glasses AI Smart Glasses': 'https://m.media-amazon.com/images/I/71xUeEqSWpL._AC_SL1500_.jpg',

  // Photography
  'Insta360 Ace Pro 2': 'https://m.media-amazon.com/images/I/71t3K2LHDTL._AC_SL1500_.jpg',
  'HOVER Air X1 Smart Flying Camera': 'https://m.media-amazon.com/images/I/71pM3NSPX8L._AC_SL1500_.jpg',
  'DWARF 3 Smart Telescope': 'https://m.media-amazon.com/images/I/71l+6mPEzjL._AC_SL1500_.jpg',

  // Smart Home
  'Steelcase Leap Ergonomic Chair': 'https://m.media-amazon.com/images/I/71cOmFcFWLL._AC_SL1500_.jpg',
  'Steelcase Gesture Ergonomic Chair': 'https://m.media-amazon.com/images/I/61v0S0hC3HL._AC_SL1500_.jpg',
  'Steelcase Migration SE Pro Height-Adjustable Desk': 'https://m.media-amazon.com/images/I/71SrFkjXeLL._AC_SL1500_.jpg',

  // Desktop Robots
  'LOOI Robot with DeepSeek AI': 'https://m.media-amazon.com/images/I/71hBWTHY0BL._AC_SL1500_.jpg',
  'Ivy Gen 2 Plant Pet Robot': 'https://m.media-amazon.com/images/I/71KS7fxFPKL._AC_SL1500_.jpg',

  // Outdoor / PGYTECH
  'PGYTECH OnePro Ultralight Backpack': 'https://m.media-amazon.com/images/I/71E2pMsJ0wL._AC_SL1500_.jpg',
  'PGYTECH OneGo Lite Backpack': 'https://m.media-amazon.com/images/I/71V8RHknpBL._AC_SL1500_.jpg',
  'HyperShell X Ultra Outdoor Exoskeleton': 'https://m.media-amazon.com/images/I/71YPaSQ+I0L._AC_SL1500_.jpg',

  // Lifestyle
  'PETKIT Auto-Clean Cat Litter Box ULTRA': 'https://m.media-amazon.com/images/I/61TFYRhlPML._AC_SL1500_.jpg',
  'PETKIT Smart Camera Pet Feeder': 'https://m.media-amazon.com/images/I/71s1Mc9ToFL._AC_SL1500_.jpg',
  'PETKIT Eversweet MAX Smart Water Fountain': 'https://m.media-amazon.com/images/I/71bGX2mHlEL._AC_SL1500_.jpg',
};

const updated = products.map(p => {
  let nameEn = p.nameEn;
  if (p.nameEn === p.name) {
    nameEn = FIXES[p.name.trim()] || p.name;
  }
  const image = IMAGES[nameEn] || null;
  return { ...p, nameEn, image };
});

fs.writeFileSync('./data/deduped-products.json', JSON.stringify(updated, null, 2));
console.log('Done! Products with images:', updated.filter(p => p.image).length);
console.log('Products without images:', updated.filter(p => !p.image).length);
