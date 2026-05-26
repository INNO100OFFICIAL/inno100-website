const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 读取两个Excel文件
const file1 = 'E:\\官网产品\\单店商品库商品导出-187579207-1779350835944 (1).xlsx';
const file2 = 'E:\\官网产品\\单店商品库商品导出-187579207-1779353096221.xlsx';

function parseExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  return data;
}

try {
  console.log('Reading Excel files...\n');

  const products1 = parseExcel(file1);
  const products2 = parseExcel(file2);

  console.log(`File 1: ${products1.length} products`);
  console.log(`File 2: ${products2.length} products\n`);

  // 显示第一个产品的所有字段
  if (products1.length > 0) {
    console.log('Sample product fields:');
    console.log(JSON.stringify(products1[0], null, 2));
  }

  // 合并产品数据
  const allProducts = [...products1, ...products2];

  // 保存为JSON
  const outputPath = path.join(__dirname, '../data/products.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));

  console.log(`\nTotal products: ${allProducts.length}`);
  console.log(`Saved to: ${outputPath}`);

} catch (error) {
  console.error('Error:', error.message);
}
