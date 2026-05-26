const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./data/processed-products.json', 'utf-8'));

console.log(`Total before dedup: ${products.length}\n`);

// 找出重复的产品名（去掉颜色/规格后缀后相同的）
const nameCount = {};
products.forEach(p => {
  const name = p.name.trim();
  nameCount[name] = (nameCount[name] || 0) + 1;
});

// 显示重复次数最多的前20个
const sorted = Object.entries(nameCount)
  .filter(([, count]) => count > 1)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30);

console.log('Most duplicated products:');
sorted.forEach(([name, count]) => {
  console.log(`  x${count}  ${name}`);
});

// 去重策略：按商品名称精确去重，保留第一条
const seen = new Set();
const deduped = products.filter(p => {
  const key = p.name.trim();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

console.log(`\nAfter exact-name dedup: ${deduped.length}`);

// 进一步去重：通过提取品牌+核心型号（去掉颜色/尺寸等后缀）
// 例如 "RingConn Gen3 黑色" "RingConn Gen3 白色" → 只保留一个
function getCoreKey(name) {
  return name
    .replace(/（[^）]*）/g, '')   // 去掉中文括号内容
    .replace(/\([^)]*\)/g, '')    // 去掉英文括号内容
    .replace(/[黑白银金蓝红绿粉紫灰棕橙]+色?/g, '')  // 去掉颜色
    .replace(/[大中小]号/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const seenCore = new Set();
const smartDeduped = deduped.filter(p => {
  const key = getCoreKey(p.name);
  if (seenCore.has(key)) return false;
  seenCore.add(key);
  return true;
});

console.log(`After smart dedup: ${smartDeduped.length}`);

// 保存去重后的数据
fs.writeFileSync('./data/deduped-products.json', JSON.stringify(smartDeduped, null, 2));

// 按分类统计
const catCount = {};
smartDeduped.forEach(p => {
  catCount[p.category] = (catCount[p.category] || 0) + 1;
});
console.log('\nBy category:');
Object.entries(catCount).sort((a,b) => b[1]-a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});
