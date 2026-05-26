const XLSX = require('xlsx');
const path = require('path');

const file = 'E:\\商品上架\\INNO100产品上架信息表.xlsx';
const workbook = XLSX.readFile(file);

console.log('Sheets:', workbook.SheetNames);

workbook.SheetNames.forEach(sheetName => {
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  console.log(`\n--- Sheet: ${sheetName} (${data.length} rows) ---`);
  if (data.length > 0) {
    console.log('Fields:', Object.keys(data[0]));
    console.log('First row:', JSON.stringify(data[0], null, 2));
  }
});
