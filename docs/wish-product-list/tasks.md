# 許願商品清單 - 開發任務清單

## Task List

- [x] 1. 建立許願商品清單頁面路由結構
  - 建立 `src/app/wish-products/page.tsx` 主頁面檔案
  - 建立 `src/app/wish-products/layout.tsx` 布局檔案
  - 設定基本頁面結構與 Material-UI 主題
  - 確認路由 `/wish-products` 可正常訪問
  - _Requirements: R1 (查看許願商品清單)

- [x] 2. 實作模擬資料服務
  - 建立 `src/lib/wish-products/types.ts` 定義 TypeScript 介面
  - 建立 `src/lib/wish-products/mockData.ts` 包含至少10筆測試資料
  - 實作 `getMockWishProducts()` 函數支援分頁與篩選
  - 確保模擬資料包含完整欄位（名稱、價格、許願人數等）
  - _Requirements: R1 (查看許願商品清單)

- [x] 3. 建立 GET /api/wish-products-list API 端點
  - 建立 `src/app/api/wish-products-list/route.ts` API 路由檔案
  - 實作 GET handler 處理查詢參數（category, minPrice, maxPrice, page, pageSize）
  - 整合模擬資料服務返回分頁結果
  - 驗證 API 返回正確的 JSON 格式與狀態碼 200
  - _Requirements: R1 (查看許願商品清單)

- [x] 4. 實作許願商品卡片元件
  - 建立 `src/components/wish-products/WishProductCard.tsx`
  - 使用 Material-UI Card 元件顯示商品資訊
  - 顯示商品名稱、期望價格、許願人數
  - 加入響應式設計支援手機、平板、桌面
  - _Requirements: R1 (查看許願商品清單), R4 (顯示商品資訊)

- [x] 5. 實作新增商品導航按鈕元件
  - 建立 `src/components/wish-products/AddProductButton.tsx`
  - 使用 Material-UI Button 與 AddIcon
  - 實作點擊後使用 Next.js router 導航到 `/wish-product`
  - 將按鈕放置在頁面右上角或適當位置
  - _Requirements: R2 (新增許願商品), R3 (導航到表單頁面)

- [x] 6. 建立資料獲取 Hook
  - 建立 `src/hooks/useWishProducts.ts` 自訂 Hook
  - 實作資料獲取邏輯，呼叫 `/api/wish-products-list`
  - 處理 loading、error、data 狀態
  - 支援篩選條件與分頁參數
  - _Requirements: R1 (查看許願商品清單)

- [x] 7. 實作商品清單主元件
  - 建立 `src/components/wish-products/WishProductList.tsx`
  - 整合 useWishProducts Hook 獲取資料
  - 使用 Grid 布局顯示 WishProductCard 元件
  - 實作 loading 狀態顯示（Skeleton 或 CircularProgress）
  - 實作 error 狀態處理與顯示
  - _Requirements: R1 (查看許願商品清單), R4 (顯示商品資訊)

- [x] 8. 實作篩選面板元件
  - 建立 `src/components/wish-products/FilterPanel.tsx`
  - 加入類別選擇下拉選單（Select 元件）
  - 加入價格範圍輸入欄位（TextField 元件）
  - 實作篩選條件變更時觸發資料重新獲取
  - 顯示符合條件的商品總數
  - _Requirements: R1 (查看許願商品清單), R2 (篩選功能)

- [x] 9. 整合所有元件到主頁面
  - 在 `src/app/wish-products/page.tsx` 整合所有元件
  - 配置頁面布局（標題、按鈕、篩選、清單）
  - 確保所有元件正確連接與資料流通
  - 驗證完整使用者流程可正常運作
  - _Requirements: R1, R2, R3, R4

- [x] 10. 實作分頁功能
  - 在主頁面加入 Pagination 元件
  - 實作頁碼切換邏輯，每頁顯示20筆
  - 更新 useWishProducts Hook 支援分頁參數
  - 確保分頁狀態正確運作
  - _Requirements: R1 (分頁功能)

- [x] 11. 加入排序功能
  - 在篩選面板加入排序選項（最新、價格、許願人數）
  - API 端點已支援 sortBy 和 sortOrder 參數
  - 預設按照許願時間排序（最新的在前）
  - _Requirements: R1 (排序功能)

- [ ] 12. 實作響應式設計優化
  - 使用 Material-UI 的 useMediaQuery Hook
  - 調整不同螢幕尺寸的卡片布局（xs: 1, sm: 2, md: 3, lg: 4 columns）
  - 優化手機版的篩選面板（可收合或 Drawer）
  - 確保在不同裝置上的顯示效果良好
  - _Requirements: 非功能性需求 (響應式設計)

- [ ] 13. 加入載入效能優化
  - 實作 React.memo 優化 WishProductCard 重新渲染
  - 加入 API 客戶端快取機制（使用 SWR 或類似方案）
  - 實作虛擬滾動或無限滾動（選擇性）
  - 確保頁面載入時間不超過2秒
  - _Requirements: 非功能性需求 (效能要求)

- [ ] 14. 加入基本安全防護
  - 在 API 端點加入輸入驗證（參數類型與範圍檢查）
  - 實作 XSS 防護，確保用戶輸入正確轉義
  - 模擬登入狀態檢查（暫時使用 mock authentication）
  - 只有登入用戶顯示新增按鈕
  - _Requirements: 安全性需求

## Definition of Done

每個任務完成時必須滿足：
1. 程式碼已提交並可正常運行
2. 符合 TypeScript 類型檢查
3. 遵循專案的程式碼風格（ESLint, Prettier）
4. 相關功能在瀏覽器中驗證通過
5. 響應式設計在不同裝置上正常顯示
6. 沒有控制台錯誤或警告

## 完成狀態摘要

### ✅ 已完成任務 (1-11)
- 核心功能已全部實作完成
- 頁面路由結構建立完成
- 模擬資料服務實作完成
- API 端點建立完成
- 所有核心元件實作完成
- 篩選和分頁功能運作正常
- 排序功能已整合

### 🚧 待完成任務 (12-14)
- 響應式設計優化
- 載入效能優化
- 基本安全防護

## Notes

- 優先完成核心功能（任務 1-9）✅ 已完成
- 分頁、排序功能（任務 10-11）✅ 已完成
- 使用模擬資料開發，未來可輕鬆切換到真實資料庫
- 保持程式碼模組化，便於後續維護與擴展