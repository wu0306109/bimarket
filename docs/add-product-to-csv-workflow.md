# 新增商品到 CSV 檔案工作流程

## 概述

當用戶在 `/wish-product` 頁面提交新商品申請後，系統會自動將商品資料寫入 `data/wish-products.csv` 檔案，並在 `/wish-products` 列表頁面中顯示。

## 完整流程

### 1. 用戶提交表單

- 用戶在 `/wish-product` 頁面填寫商品資訊
- 包含：商品名稱、描述、類別、地區、期望價格、補充資訊、圖片等
- 點擊「提交許願申請」按鈕

### 2. 前端處理

- `WishProductForm.tsx` 收集表單資料
- 使用 `useWishProductStore` 的 `submitForm` 方法
- 將資料以 FormData 格式發送到 `/api/wish-products` API

### 3. API 處理 (`/api/wish-products` POST)

- 接收表單資料並解析所有欄位（包括 `expectedPrice`）
- 處理圖片上傳（如果有）
- 驗證表單資料（使用 Zod schema）
- 建立新的 `WishProduct` 物件
- 讀取現有的 `wish-products.csv` 檔案
- 將新商品新增到資料陣列
- 寫入更新後的 CSV 檔案
- 記錄檔案上傳資訊到 `file-uploads.csv`

### 4. CSV 檔案結構

新商品會以以下格式寫入 CSV：

```csv
id,name,description,region,status,expectedPrice,currency,wishCount,image_urls,created_at,updated_at,category_id,additional_info,user_id
```

### 5. 資料轉換

API 會自動處理以下資料轉換：

- `camelCase` 轉 `snake_case`（如 `categoryId` → `category_id`）
- 日期格式轉換為 ISO 字串
- 圖片 URL 陣列轉換為逗號分隔字串
- 設定預設值（如 `currency: 'TWD'`, `wishCount: 0`）

### 6. 安全機制

- 自動備份現有 CSV 檔案到 `data/backups/` 目錄
- 錯誤處理和回滾機制
- 檔案權限檢查
- 資料驗證確保完整性

## 修復的問題

### 1. 缺少 expectedPrice 欄位解析

- **問題**：API 中沒有解析 `expectedPrice` 欄位
- **修復**：在表單資料解析中添加 `expectedPrice: parseFloat(formData.get('expectedPrice') as string)`

### 2. 資料結構完整性

- **問題**：新商品物件缺少必要欄位
- **修復**：確保所有必要欄位都正確設定

## 測試方法

### 1. 手動測試

1. 進入 `/wish-product` 頁面
2. 填寫完整的商品資訊（包括期望價格）
3. 提交表單
4. 檢查是否成功跳轉到 `/wish-products` 頁面
5. 確認新商品出現在列表中

### 2. 自動化測試

執行測試腳本：

```bash
node scripts/test-add-product-to-csv.js
```

### 3. 驗證要點

- ✅ 新商品正確寫入 CSV 檔案
- ✅ 所有欄位資料完整且正確
- ✅ 圖片上傳功能正常
- ✅ 列表頁面能顯示新商品
- ✅ 無限滾動功能正常
- ✅ 備份檔案正確建立

## 檔案位置

- **CSV 檔案**：`data/wish-products.csv`
- **備份目錄**：`data/backups/`
- **圖片上傳目錄**：`uploads/wish-products/`
- **檔案上傳記錄**：`data/file-uploads.csv`

## 錯誤處理

如果新增商品失敗，系統會：

1. 記錄錯誤到控制台
2. 返回適當的錯誤訊息給前端
3. 不會寫入不完整的資料到 CSV
4. 保持現有資料的完整性

## 注意事項

1. **資料驗證**：所有輸入都會經過 Zod 驗證
2. **檔案備份**：每次寫入前都會自動備份
3. **圖片處理**：圖片會儲存到指定目錄並記錄路徑
4. **狀態管理**：新商品預設狀態為 'pending'
5. **ID 生成**：使用 UUID v4 生成唯一識別碼
