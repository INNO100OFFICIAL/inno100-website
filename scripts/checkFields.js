const XLSX = require('xlsx');

const file1 = 'E:\\官网产品\\单店商品库商品导出-187579207-1779353096221.xlsx';
const workbook = XLSX.readFile(file1);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// 显示所有字段名
console.log('All fields:');
console.log(Object.keys(data[0]));

// 找含有图片相关字段
const fields = Object.keys(data[0]);
const imageFields = fields.filter(f => f.includes('图') || f.includes('image') || f.includes('img') || f.includes('url') || f.includes('URL') || f.includes('照片'));
console.log('\nImage-related fields:', imageFields);

// 看前5个产品的所有字段值
console.log('\nFirst product full data:');
console.log(JSON.stringify(data[0], null, 2));
