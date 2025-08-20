const fs = require('fs-extra');
const path = require('path');

async function restoreMissingColumns() {
  try {
    console.log('🚀 開始恢復缺少的欄位...');

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
    console.log('📋 原始標題行:', header);

    // 檢查缺少的欄位
    const hasExpectedPrice = header.includes('expectedPrice');
    const hasWishCount = header.includes('wishCount');

    console.log('🔍 檢查結果:');
    console.log('- expectedPrice:', hasExpectedPrice ? '✅ 存在' : '❌ 缺少');
    console.log('- wishCount:', hasWishCount ? '✅ 存在' : '❌ 缺少');

    if (hasExpectedPrice && hasWishCount) {
      console.log('✅ 所有欄位都存在，無需修復');
      return;
    }

    // 修復標題行
    let newHeader = header;
    if (!hasExpectedPrice) {
      // 在 currency 之後添加 expectedPrice
      newHeader = newHeader.replace('"currency"', '"currency","expectedPrice"');
      console.log('📝 添加 expectedPrice 欄位');
    }

    if (!hasWishCount) {
      // 在 expectedPrice 之後添加 wishCount（如果 expectedPrice 不存在，則在 currency 之後）
      if (hasExpectedPrice) {
        newHeader = newHeader.replace(
          '"expectedPrice"',
          '"expectedPrice","wishCount"',
        );
      } else {
        newHeader = newHeader.replace(
          '"expectedPrice"',
          '"expectedPrice","wishCount"',
        );
      }
      console.log('📝 添加 wishCount 欄位');
    }

    console.log('📋 新標題行:', newHeader);

    // 更新每一行資料
    const updatedLines = [newHeader];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') continue;

      let newLine = line;

      // 解析現有欄位
      const parts = line.split('","');

      if (!hasExpectedPrice) {
        // 在 currency 之後添加預設價格
        const currencyIndex = 5; // 0-based index for currency
        if (parts[currencyIndex]) {
          parts.splice(currencyIndex + 1, 0, '1000'); // 預設價格
          console.log(`📝 第 ${i} 行添加預設價格: 1000`);
        }
      }

      if (!hasWishCount) {
        // 在 expectedPrice 之後添加預設許願人數
        const wishCountIndex = hasExpectedPrice ? 7 : 6; // 根據是否有 expectedPrice 調整
        if (parts[wishCountIndex]) {
          parts.splice(wishCountIndex + 1, 0, '1'); // 預設許願人數
          console.log(`📝 第 ${i} 行添加預設許願人數: 1`);
        }
      }

      newLine = parts.join('","');
      updatedLines.push(newLine);
    }

    // 寫入更新後的檔案
    const newContent = updatedLines.join('\n');
    await fs.writeFile(csvPath, newContent, 'utf-8');

    console.log('✅ 成功恢復缺少的欄位');
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

restoreMissingColumns();
