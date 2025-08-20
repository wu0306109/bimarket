const fs = require('fs-extra');
const path = require('path');

async function updatePricesAndWishCounts() {
  try {
    console.log('🚀 開始更新價格和許願人數...');

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
    if (!header.includes('expectedPrice') || !header.includes('wishCount')) {
      console.log('❌ CSV 檔案缺少必要欄位');
      return;
    }

    // 為不同商品設定價格和許願人數
    const productData = {
      我的電腦: { price: 66442, wishCount: 4 },
      皮卡丘: { price: 14177, wishCount: 77 },
      比卡抄: { price: 21301, wishCount: 12 },
      居家生活: { price: 22714, wishCount: 1 },
      'Mac Air Book M5': { price: 40962, wishCount: 13 },
      'iPhone 15 Pro Max': { price: 25860, wishCount: 20 },
      'Sony A7 IV 相機': { price: 33436, wishCount: 3 },
      'Dyson V15 吸塵器': { price: 7800, wishCount: 2 },
      'Nintendo Switch OLED': { price: 1255, wishCount: 4 },
      'Herman Miller Aeron 人體工學椅': { price: 15649, wishCount: 78 },
      'iPad Pro 12.9吋': { price: 71267, wishCount: 1 },
      'Vitamix 調理機': { price: 29664, wishCount: 5 },
      'Bose QC45 降噪耳機': { price: 49697, wishCount: 3 },
      'LG OLED 65吋電視': { price: 12893, wishCount: 11 },
      'Patagonia 戶外背包': { price: 3536, wishCount: 1 },
      'SK-II 神仙水': { price: 3886, wishCount: 2 },
      'Lego 創意系列積木': { price: 2483, wishCount: 2 },
      'Montblanc 萬寶龍鋼筆': { price: 6395, wishCount: 2 },
      日本薯條三兄弟: { price: 1154, wishCount: 1 },
      'Nike Air Jordan 1 復古鞋': { price: 5964, wishCount: 1 },
      AAAAA: { price: 1234, wishCount: 1 },
      DXASXASX: { price: 1500, wishCount: 1 },
      ASDQWDSACAWEQ: { price: 2000, wishCount: 1 },
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
        const productInfo = productData[productName] || {
          price: 1000,
          wishCount: 1,
        };

        // 更新 expectedPrice 欄位（第七個欄位）
        const priceIndex = 6; // 0-based index for expectedPrice
        if (parts[priceIndex]) {
          parts[priceIndex] = productInfo.price.toString();
        }

        // 更新 wishCount 欄位（第八個欄位）
        const wishCountIndex = 7; // 0-based index for wishCount
        if (parts[wishCountIndex]) {
          parts[wishCountIndex] = productInfo.wishCount.toString();
        }

        const updatedLine = parts.join('","');
        updatedLines.push(updatedLine);

        console.log(
          `📝 ${productName}: NT$ ${productInfo.price.toLocaleString()} (${productInfo.wishCount} 人許願)`,
        );
      } else {
        updatedLines.push(line);
      }
    }

    // 寫入更新後的檔案
    const newContent = updatedLines.join('\n');
    await fs.writeFile(csvPath, newContent, 'utf-8');

    console.log('✅ 成功更新價格和許願人數');
    console.log(`📊 更新後 CSV 有 ${updatedLines.length} 行資料`);
  } catch (error) {
    console.error('❌ 更新失敗:', error);
  }
}

updatePricesAndWishCounts();
