#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 建立必要目錄
const dirs = ['data', 'data/backups', 'uploads', 'uploads/wish-products'];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ 建立目錄: ${dir}`);
  } else {
    console.log(`- 目錄已存在: ${dir}`);
  }
});

// 初始化商品類別 CSV 檔案
const categoriesData = `id,name,description,is_active,sort_order,created_at,updated_at
1,"電子產品","各種電子設備和配件",true,1,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
2,"服飾配件","衣服、鞋子、包包等",true,2,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
3,"美妝保養","化妝品、保養品、香水等",true,3,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
4,"食品飲料","零食、飲料、保健食品等",true,4,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
5,"居家生活","家具、家電、生活用品等",true,5,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"`;

// 建立空的許願商品檔案（使用統一的snake_case格式）
const wishProductsHeader =
  'id,name,description,category_id,region,expected_price,currency,wish_count,additional_info,image_urls,status,user_id,created_at,updated_at';

// 建立空的檔案上傳記錄
const fileUploadsHeader =
  'id,original_filename,stored_filename,file_path,file_size,mime_type,related_table,related_id,created_at';

// 寫入檔案
const files = [
  { path: 'data/product-categories.csv', content: categoriesData },
  { path: 'data/wish-products.csv', content: wishProductsHeader },
  { path: 'data/file-uploads.csv', content: fileUploadsHeader },
];

files.forEach((file) => {
  try {
    fs.writeFileSync(file.path, file.content, 'utf8');
    console.log(`✓ 建立檔案: ${file.path}`);
  } catch (error) {
    console.error(`✗ 建立檔案失敗: ${file.path}`, error.message);
  }
});

console.log('\n🎉 CSV 資料檔案初始化完成！');
