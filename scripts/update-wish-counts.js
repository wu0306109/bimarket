const fs = require('fs-extra');
const path = require('path');

async function updateWishCounts() {
  try {
    console.log('🚀 開始更新許願人數...');

    const csvPath = path.join(__dirname, '../data/wish-products.csv');
    console.log('📁 CSV 檔案路徑:', csvPath);

    if (!(await fs.pathExists(csvPath))) {
      console.log('❌ CSV 檔案不存在:', csvPath);
      return;
    }

    // 讀取現有資料
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    const lines = csvContent.split('\n');

    console.log(`📊 目前 CSV 有 ${lines.length} 行資料`);

    // 檢查標題行
    const header = lines[0];
    if (!header.includes('wishCount')) {
      console.log('❌ CSV 檔案缺少 wishCount 欄位');
      return;
    }

    // 為不同商品設定不同的許願人數
    const wishCountMap = {
      'iPhone 15 Pro Max': 20,
      'Sony A7 IV 相機': 3,
      'Dyson V15 吸塵器': 2,
      'Nintendo Switch OLED': 4,
      'Herman Miller Aeron 人體工學椅': 78,
      'iPad Pro 12.9吋': 1,
      'Vitamix 調理機': 5,
      'Bose QC45 降噪耳機': 3,
      'LG OLED 65吋電視': 11,
      'Patagonia 戶外背包': 1,
      'SK-II 神仙水': 2,
      'Lego 創意系列積木': 2,
      'Montblanc 萬寶龍鋼筆': 2,
      日本薯條三兄弟: 1,
      'Nike Air Jordan 1 復古鞋': 1,
      我的電腦: 4,
      皮卡丘: 77,
      比卡抄: 12,
      居家生活: 1,
      'Mac Air Book M5': 13,
    };

    // 更新每一行資料
    const updatedLines = [header];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') continue;

      // 解析商品名稱（第二個欄位）
      const parts = line.split('","');
      if (parts.length >= 2) {
        const productName = parts[1].replace(/"/g, '');
        const newWishCount = wishCountMap[productName] || 1;

        // 更新 wishCount 欄位（第八個欄位）
        const wishCountIndex = 7; // 0-based index for wishCount
        if (parts[wishCountIndex]) {
          parts[wishCountIndex] = newWishCount.toString();
          const updatedLine = parts.join('","');
          updatedLines.push(updatedLine);

          console.log(`📝 ${productName}: ${newWishCount} 人許願`);
        } else {
          updatedLines.push(line);
        }
      } else {
        updatedLines.push(line);
      }
    }

    // 寫入更新後的檔案
    const newContent = updatedLines.join('\n');
    await fs.writeFile(csvPath, newContent, 'utf-8');

    console.log('✅ 成功更新許願人數');
    console.log(`📊 更新後 CSV 有 ${updatedLines.length} 行資料`);
  } catch (error) {
    console.error('❌ 更新失敗:', error);
  }
}

updateWishCounts();
