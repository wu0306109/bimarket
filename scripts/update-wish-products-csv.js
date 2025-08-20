const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// 讀取 CSV 檔案
const csvPath = path.join(__dirname, '../data/wish-products.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// 解析 CSV
const parsed = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true
});

// 生成隨機價格
function generateRandomPrice(category) {
  const priceRanges = {
    '1': [15000, 80000],  // 電子產品
    '2': [2000, 15000],   // 服飾配件
    '3': [1000, 8000],    // 美妝保養
    '4': [300, 2000],     // 食品飲料
    '5': [3000, 30000],   // 居家生活
    '6': [2000, 12000],   // 運動戶外
    '7': [1500, 10000],   // 文具辦公
    '8': [1000, 8000]     // 玩具遊戲
  };
  
  const range = priceRanges[category] || [1000, 10000];
  return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
}

// 生成隨機許願人數
function generateWishCount() {
  // 70% 機率是 1-5 人
  // 20% 機率是 6-20 人
  // 10% 機率是 21-100 人
  const rand = Math.random();
  if (rand < 0.7) {
    return Math.floor(Math.random() * 5) + 1;
  } else if (rand < 0.9) {
    return Math.floor(Math.random() * 15) + 6;
  } else {
    return Math.floor(Math.random() * 80) + 21;
  }
}

// 更新資料
const updatedData = parsed.data.map(row => {
  // 加入 expectedPrice
  if (!row.expectedPrice || row.expectedPrice === '0') {
    row.expectedPrice = generateRandomPrice(row.category_id);
  }
  
  // 加入 wishCount，如果是 0 就改為至少 1
  if (!row.wishCount || row.wishCount === '0') {
    row.wishCount = generateWishCount();
  }
  
  // 加入 currency 欄位
  row.currency = 'TWD';
  
  return row;
});

// 重新排序欄位，把新欄位放在適當位置
const fieldOrder = [
  'id',
  'name', 
  'description',
  'region',
  'status',
  'expectedPrice',
  'currency',
  'wishCount',
  'image_urls',
  'created_at',
  'updated_at',
  'category_id',
  'additional_info',
  'user_id'
];

// 轉換回 CSV
const csv = Papa.unparse(updatedData, {
  columns: fieldOrder,
  header: true
});

// 備份原始檔案
const backupPath = path.join(__dirname, `../data/backups/${new Date().toISOString().replace(/:/g, '-')}_wish-products.csv`);
fs.mkdirSync(path.dirname(backupPath), { recursive: true });
fs.copyFileSync(csvPath, backupPath);
console.log(`✅ 已備份原始檔案到: ${backupPath}`);

// 寫入更新後的檔案
fs.writeFileSync(csvPath, csv);
console.log(`✅ 已更新 wish-products.csv`);

// 顯示統計資訊
console.log(`\n📊 更新統計:`);
console.log(`   總筆數: ${updatedData.length}`);
console.log(`   平均價格: NT$ ${Math.round(updatedData.reduce((sum, row) => sum + parseInt(row.expectedPrice), 0) / updatedData.length).toLocaleString()}`);
console.log(`   平均許願人數: ${Math.round(updatedData.reduce((sum, row) => sum + parseInt(row.wishCount), 0) / updatedData.length)} 人`);