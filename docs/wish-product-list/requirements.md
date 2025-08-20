# Feature: 許願商品清單

## Background
許願商品清單功能讓買家能夠表達購買意願，並查看市場上其他買家的需求。這個功能有助於賣家了解市場需求，同時讓買家找到志同道合的購買夥伴。

## User Stories

### 1. 查看許願商品清單

**As a** 買家  
**I want** 查看所有買家的許願商品清單  
**So that** 我可以了解市場上的需求趨勢並找到感興趣的商品

#### Gherkin Scenario
```gherkin
Scenario: 查看完整的許願商品清單
  Given 我是已登入的買家
  When 我進入許願商品清單頁面
  Then 我應該看到所有買家的許願商品
  And 每個商品顯示商品名稱、期望價格、許願人數
  And 清單應該按照許願時間排序（最新的在前）

Scenario: 篩選許願商品
  Given 我在許願商品清單頁面
  When 我使用商品類別篩選器
  Then 只顯示該類別的許願商品
  And 顯示符合條件的商品總數
```

### 2. 新增許願商品

**As a** 買家  
**I want** 點擊按鈕連接到新增許願商品表單  
**So that** 我可以表達我的購買需求

#### Gherkin Scenario
```gherkin
Scenario: 導航到新增許願商品表單
  Given 我是已登入的買家
  And 我在許願商品清單頁面
  When 我點擊「新增許願商品」按鈕
  Then 系統應該導航到 /wish-product 表單頁面
  And 表單應該包含商品名稱、描述、期望價格等欄位
```

## Acceptance Criteria (驗收標準)

### 功能性驗收標準
1. ✅ 系統能正確顯示所有許願商品清單，並支援分頁（每頁20筆）
2. ✅ 支援按類別、價格範圍、時間篩選許願商品
3. ✅ 點擊「新增許願商品」按鈕能正確導航到 /wish-product 表單頁面
4. ✅ 清單頁面能正確顯示商品資訊（名稱、價格、許願人數）

### 非功能性驗收標準
1. ✅ 頁面載入時間不超過2秒
2. ✅ 支援手機、平板、桌面等不同裝置瀏覽
3. ✅ 符合WCAG 2.1 AA級無障礙標準

### 安全性驗收標準
1. ✅ 只有登入用戶可以看到新增許願商品按鈕
2. ✅ 防止XSS攻擊
3. ✅ 敏感資料不在清單中公開顯示

## JIRA-Style Tasks

### Epic: 許願商品清單功能
**Epic Key:** WISH-001  
**Priority:** High  
**Story Points:** 8

#### Backend Tasks

**WISH-101: 實作許願商品清單API**
- **Type:** Task
- **Priority:** High
- **Story Points:** 3
- **Description:** 開發GET API端點，返回許願商品清單
- **Acceptance Criteria:**
  - GET /api/wish-products - 取得許願清單（支援分頁、篩選）
  - 支援類別、價格範圍篩選
  - 返回商品名稱、價格、許願人數

#### Frontend Tasks

**WISH-201: 建立許願商品清單頁面**
- **Type:** Task
- **Priority:** High
- **Story Points:** 3
- **Description:** 開發許願商品清單的主要頁面，包含商品展示、分頁、篩選功能
- **Acceptance Criteria:**
  - 響應式設計支援各種裝置
  - 實作分頁功能
  - 支援類別和價格篩選
  - 顯示商品卡片資訊

**WISH-202: 實作新增許願商品導航按鈕**
- **Type:** Task
- **Priority:** High
- **Story Points:** 1
- **Description:** 在清單頁面加入新增按鈕，點擊後導航到表單頁面
- **Acceptance Criteria:**
  - 按鈕顯示在頁面適當位置
  - 點擊後導航到 /wish-product 路由

#### Testing Tasks

**WISH-301: 撰寫單元測試**
- **Type:** Task
- **Priority:** High
- **Story Points:** 1
- **Description:** 為清單頁面和導航功能撰寫測試
- **Acceptance Criteria:**
  - 測試清單顯示功能
  - 測試篩選功能
  - 測試導航功能

## Definition of Done (完成定義)

1. 程式碼已完成並通過code review
2. 單元測試通過
3. 符合效能要求
4. 部署到測試環境
5. 符合安全性要求

## Technical Specifications

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/wish-products | 取得許願商品清單 |

### Routes

| Path | Component | Description |
|------|-----------|-------------|
| /wish-products | WishProductList | 許願商品清單頁面 |
| /wish-product | WishProductForm | 新增許願商品表單 |

### Data Model

```typescript
interface WishProduct {
  id: string;
  userId: string;
  productName: string;
  description: string;
  category: string;
  expectedPrice: number;
  wishCount: number;
  createdAt: Date;
}
```