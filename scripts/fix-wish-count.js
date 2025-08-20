const fs = require('fs-extra');
const path = require('path');

async function fixWishCount() {
  try {
    console.log('🚀 開始修復 wishCount 欄位...');

    const csvPath = path.join(__dirname, '../data/wish-products.csv');
    console.log('📁 CSV 檔案路徑:', csvPath);

    console.log('🔍 檢查 CSV 檔案...');

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
    console.log('📋 原始標題行:', header);

    // 檢查是否已經有 wishCount 欄位
    if (header.includes('wishCount')) {
      console.log('✅ wishCount 欄位已存在，無需修復');
      return;
    }

    // 在標題行添加 wishCount 欄位（在 currency 之後）
    let newHeader = header;
    if (header.includes('currency')) {
      // 在 currency 之後添加 wishCount
      newHeader = header.replace('"currency"', '"currency","wishCount"');
    } else {
      // 如果沒有 currency，在 image_urls 之後添加
      newHeader = header.replace('"image_urls"', '"image_urls","wishCount"');
    }

    console.log('📋 新標題行:', newHeader);

    // 更新每一行資料
    const updatedLines = [newHeader];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') continue;

      // 在 currency 之後添加 wishCount 值（預設為1）
      let newLine = line;
      if (line.includes('"TWD"')) {
        // 在 TWD 之後添加 ,1
        newLine = line.replace('"TWD"', '"TWD","1"');
      } else {
        // 如果沒有 TWD，在 image_urls 之後添加
        newLine = line.replace('""', '","1"');
      }

      updatedLines.push(newLine);
    }

    // 寫入更新後的檔案
    const newContent = updatedLines.join('\n');
    await fs.writeFile(csvPath, newContent, 'utf-8');

    console.log('✅ 成功修復 CSV 檔案，添加了 wishCount 欄位');
    console.log(`📊 更新後 CSV 有 ${updatedLines.length} 行資料`);

    // 驗證修復結果
    const updatedContent = await fs.readFile(csvPath, 'utf-8');
    const updatedLines2 = updatedContent.split('\n');
    console.log('📋 修復後標題行:', updatedLines2[0]);
    console.log('📄 第一行資料:', updatedLines2[1]);
  } catch (error) {
    console.error('❌ 修復失敗:', error);
  }
}

fixWishCount();
