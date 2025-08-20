const fs = require('fs-extra');
const path = require('path');

// 模擬新增商品的資料
const testProduct = {
  id: 'test-product-' + Date.now(),
  name: '測試商品',
  description: '這是一個測試商品，用於驗證新增功能',
  categoryId: 1,
  region: '台灣',
  expectedPrice: 1000,
  currency: 'TWD',
  wishCount: 0,
  additionalInfo: '測試用的補充資訊',
  imageUrls: [],
  image_urls: '',
  status: 'pending',
  userId: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function testAddProductToCSV() {
  try {
    const csvPath = path.join(__dirname, 'data/wish-products.csv');

    console.log('🔍 檢查 CSV 檔案是否存在...');

    // 檢查檔案是否存在
    if (!(await fs.pathExists(csvPath))) {
      console.log('❌ CSV 檔案不存在，創建新檔案...');
      const headers =
        'id,name,description,region,status,expectedPrice,currency,wishCount,image_urls,created_at,updated_at,category_id,additional_info,user_id\n';
      await fs.writeFile(csvPath, headers, 'utf-8');
    }

    // 讀取現有資料
    console.log('📖 讀取現有 CSV 資料...');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    const lines = csvContent.split('\n');

    console.log(`📊 目前 CSV 有 ${lines.length - 1} 行資料（不含標題）`);

    // 建立新行（按照 CSV 欄位順序）
    const newLine = [
      testProduct.id,
      testProduct.name,
      testProduct.description,
      testProduct.region,
      testProduct.status,
      testProduct.expectedPrice,
      testProduct.currency,
      testProduct.wishCount,
      testProduct.image_urls,
      testProduct.createdAt,
      testProduct.updatedAt,
      testProduct.categoryId,
      testProduct.additionalInfo,
      testProduct.userId,
    ].join(',');

    console.log('📝 新增的商品資料行：');
    console.log(newLine);

    // 新增到檔案
    lines.push(newLine);
    const newContent = lines.join('\n');

    // 寫入檔案
    console.log('💾 寫入 CSV 檔案...');
    await fs.writeFile(csvPath, newContent, 'utf-8');

    console.log('✅ 測試商品已成功新增到 CSV 檔案');
    console.log('商品 ID:', testProduct.id);
    console.log('商品名稱:', testProduct.name);

    // 驗證檔案是否正確更新
    const updatedContent = await fs.readFile(csvPath, 'utf-8');
    const updatedLines = updatedContent.split('\n');
    console.log('📊 更新後 CSV 檔案總行數:', updatedLines.length);
    console.log('📄 最後一行:', updatedLines[updatedLines.length - 1]);

    // 檢查是否能在列表中找到新商品
    console.log('🔍 驗證新商品是否正確寫入...');
    const lastLine = updatedLines[updatedLines.length - 1];
    if (
      lastLine.includes(testProduct.id) &&
      lastLine.includes(testProduct.name)
    ) {
      console.log('✅ 驗證成功：新商品已正確寫入 CSV');
    } else {
      console.log('❌ 驗證失敗：新商品未正確寫入 CSV');
    }
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }
}

testAddProductToCSV();
