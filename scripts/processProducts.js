const fs = require('fs');
const path = require('path');

// 读取产品数据
const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

console.log(`Total products: ${products.length}\n`);

// 提取所有分类
const categories = new Set();
products.forEach(p => {
  if (p['一级分类']) categories.add(p['一级分类']);
});

console.log('Categories found:');
categories.forEach(cat => {
  const count = products.filter(p => p['一级分类'] === cat).length;
  console.log(`  ${cat}: ${count} products`);
});

// 按分类统计
const categoryStats = {};
categories.forEach(cat => {
  categoryStats[cat] = products.filter(p => p['一级分类'] === cat).length;
});

// 转换为前端可用的格式
const processedProducts = products
  .filter(p => p['生命周期'] === '正常') // 只保留正常商品
  .map(p => ({
    id: p['商品id'],
    name: p['商品名称'],
    category: p['一级分类'] || '其他',
    price: p['零售价'] ? parseFloat(p['零售价']) : 0,
    barcode: p['商品条码'],
    description: p['商品简介/分享描述'] || '',
    highlight: p['商品卖点'] || '',
    sales: parseInt(p['销量']) || 0,
  }))
  .filter(p => p.name); // 过滤掉没有名称的商品

console.log(`\nProcessed products: ${processedProducts.length}`);

// 保存处理后的数据
const outputPath = path.join(__dirname, '../data/processed-products.json');
fs.writeFileSync(outputPath, JSON.stringify(processedProducts, null, 2));

console.log(`Saved to: ${outputPath}`);

// 按分类分组
const productsByCategory = {};
processedProducts.forEach(p => {
  if (!productsByCategory[p.category]) {
    productsByCategory[p.category] = [];
  }
  productsByCategory[p.category].push(p);
});

console.log('\nProducts by category:');
Object.keys(productsByCategory).sort().forEach(cat => {
  console.log(`  ${cat}: ${productsByCategory[cat].length} products`);
});

// 保存分类数据
const categoriesPath = path.join(__dirname, '../data/categories.json');
fs.writeFileSync(categoriesPath, JSON.stringify(productsByCategory, null, 2));
console.log(`\nCategories saved to: ${categoriesPath}`);
