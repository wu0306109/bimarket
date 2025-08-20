const fs = require('fs-extra');
const path = require('path');

async function convertCSVToSnakeCase() {
  try {
    console.log('🚀 開始將CSV檔案轉換為snake_case格式...');

    const csvPath = path.join(__dirname, '../data/wish-products.csv');
    console.log('📁 CSV 檔案路徑:', csvPath);

    if (!(await fs.pathExists(csvPath))) {
      console.log('❌ CSV 檔案不存在:', csvPath);
      return;
    }

    // 備份原始檔案
    const backupPath = path.join(
      __dirname,
      `../data/backups/${new Date().toISOString().replace(/:/g, '-')}_wish-products-before-snake-case.csv`,
    );
    await fs.ensureDir(path.dirname(backupPath));
    await fs.copy(csvPath, backupPath);
    console.log('📦 已備份原始檔案:', backupPath);

    // 讀取現有資料
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    const lines = csvContent.split('\n');

    console.log(`📊 目前 CSV 有 ${lines.length} 行資料`);

    // 檢查標題行
    const oldHeader = lines[0];
    console.log('📋 原始標題行:', oldHeader);

    // 更新標題行：將 expectedPrice 改為 expected_price，wishCount 改為 wish_count
    const newHeader = oldHeader
      .replace('"expectedPrice"', '"expected_price"')
      .replace('"wishCount"', '"wish_count"');

    console.log('📋 新標題行:', newHeader);

    // 更新標題行
    lines[0] = newHeader;

    // 寫入更新後的檔案
    const newContent = lines.join('\n');
    await fs.writeFile(csvPath, newContent, 'utf-8');

    console.log('✅ 成功將CSV檔案轉換為snake_case格式');
    console.log(`📊 更新後 CSV 有 ${lines.length} 行資料`);

    // 驗證修復結果
    const updatedContent = await fs.readFile(csvPath, 'utf-8');
    const updatedLines = updatedContent.split('\n');
    console.log('📋 修復後標題行:', updatedLines[0]);
    if (updatedLines.length > 1 && updatedLines[1].trim()) {
      console.log('📄 第一行資料範例:', updatedLines[1]);
    }
  } catch (error) {
    console.error('❌ 轉換失敗:', error);
  }
}

convertCSVToSnakeCase();
