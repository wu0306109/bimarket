# 許願商品清單 System Design Document

## Feature Overview
許願商品清單功能提供買家表達購買意願的平台，讓買家能查看市場需求趨勢，並透過簡單的按鈕導航到新增表單。此功能著重於清單展示與導航，為買家創造價值。

## Architecture Planning

### File Structure
```
src/
  app/
    wish-products/          # 許願商品清單頁面
      page.tsx             # 清單主頁面
      layout.tsx           # 清單頁面布局
    api/
      wish-products/       # API 路由
        route.ts           # GET 許願商品清單 API
  components/
    wish-products/
      WishProductList.tsx  # 商品清單元件
      WishProductCard.tsx  # 商品卡片元件
      FilterPanel.tsx      # 篩選面板元件
      AddProductButton.tsx # 新增商品按鈕元件
  lib/
    wish-products/
      types.ts            # TypeScript 型別定義
      api.ts              # API 客戶端函數
      mockData.ts         # 模擬資料（開發階段）
  hooks/
    useWishProducts.ts    # 自訂 Hook 處理資料獲取
```

### System Architecture Diagram
```mermaid
graph TB
    subgraph "Client Layer"
        UI[WishProductList Page]
        BTN[Add Product Button]
        FILTER[Filter Panel]
    end
    
    subgraph "Application Layer"
        HOOK[useWishProducts Hook]
        API_CLIENT[API Client]
    end
    
    subgraph "API Layer"
        API_ROUTE[/api/wish-products]
    end
    
    subgraph "Data Layer"
        MOCK[Mock Data Service]
        DB[(Future: Database)]
    end
    
    UI --> HOOK
    BTN --> |Navigate| FORM[/wish-product Form]
    FILTER --> HOOK
    HOOK --> API_CLIENT
    API_CLIENT --> API_ROUTE
    API_ROUTE --> MOCK
    MOCK -.-> DB
```

### Key Architectural Features
- **Component-Based Architecture**: 使用 React 元件實現模組化設計
- **Next.js App Router**: 利用 Next.js 13+ 的 App Router 進行路由管理
- **TypeScript**: 確保型別安全和開發體驗
- **Mock Data First**: 先使用模擬資料開發，後續整合真實資料庫

## Interface Contracts

### Components

#### Business Logic Components

**WishProduct Type Definition**
```typescript
// lib/wish-products/types.ts
export interface WishProduct {
  id: string;
  userId: string;
  userName?: string;        // 顯示用，不公開敏感資料
  productName: string;
  description: string;
  category: string;
  expectedPrice: number;
  currency: string;
  wishCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'createdAt' | 'wishCount' | 'expectedPrice';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface WishProductsResponse {
  data: WishProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

**API Client Functions**
```typescript
// lib/wish-products/api.ts
export async function fetchWishProducts(
  filters?: WishProductFilter,
  pagination?: PaginationParams
): Promise<WishProductsResponse> {
  // TODO: Implement API call
  // For now, return mock data
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (pagination?.page) params.append('page', pagination.page.toString());
  if (pagination?.pageSize) params.append('pageSize', pagination.pageSize.toString());
  
  const response = await fetch(`/api/wish-products?${params}`);
  return response.json();
}
```

#### Infrastructure Components

**API Route Handler**
```typescript
// app/api/wish-products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WishProductsResponse } from '@/lib/wish-products/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse query parameters
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  
  // TODO: Implement actual database query
  // For now, use mock data service
  const mockData = await getMockWishProducts({
    category,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
  }, { page, pageSize });
  
  return NextResponse.json(mockData);
}
```

**React Components**
```typescript
// components/wish-products/WishProductCard.tsx
interface WishProductCardProps {
  product: WishProduct;
}

export function WishProductCard({ product }: WishProductCardProps) {
  // TODO: Implement card UI with Material-UI
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{product.productName}</Typography>
        <Typography>期望價格: ${product.expectedPrice}</Typography>
        <Typography>許願人數: {product.wishCount}</Typography>
      </CardContent>
    </Card>
  );
}

// components/wish-products/AddProductButton.tsx
export function AddProductButton() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/wish-product');
  };
  
  return (
    <Button 
      variant="contained" 
      onClick={handleClick}
      startIcon={<AddIcon />}
    >
      新增許願商品
    </Button>
  );
}
```

**Custom Hook**
```typescript
// hooks/useWishProducts.ts
export function useWishProducts(
  filters?: WishProductFilter,
  pagination?: PaginationParams
) {
  const [data, setData] = useState<WishProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchWishProducts(filters, pagination);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [filters, pagination]);
  
  return { data, loading, error };
}
```

## Technical Details

### Development Environment Requirements
- Node.js 20+
- Next.js 14+
- React 18+
- TypeScript 5+
- Material-UI 5+

### Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@mui/material": "^5.0.0",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0"
  }
}
```

### Configuration Files

**TypeScript Configuration**
```json
// tsconfig.json additions
{
  "compilerOptions": {
    "paths": {
      "@/lib/*": ["./src/lib/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  }
}
```

### Testing Strategy
- **Unit Tests**: 測試個別元件和函數功能
  - WishProductCard 元件渲染測試
  - FilterPanel 篩選邏輯測試
  - API 客戶端函數測試
  
- **Integration Tests**: 測試元件間互動
  - 清單頁面載入和顯示測試
  - 篩選功能整合測試
  - 導航功能測試
  
- **E2E Tests**: 驗證完整用戶流程
  - 查看許願商品清單流程
  - 點擊按鈕導航到表單流程

### Deployment Considerations
- **環境變數**: 
  - `NEXT_PUBLIC_API_URL`: API 端點 URL
  - `DATABASE_URL`: 資料庫連線字串（未來）
  
- **效能優化**:
  - 使用 Next.js 的 SSG/SSR 提升首次載入速度
  - 實作分頁減少資料載入量
  - 使用 React.memo 優化元件重新渲染
  
- **安全考量**:
  - 實作 CORS 設定
  - 輸入驗證和消毒
  - Rate limiting 防止 API 濫用

## API Specifications

### GET /api/wish-products

**Description**: 取得許願商品清單

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | 商品類別篩選 |
| minPrice | number | No | 最低價格篩選 |
| maxPrice | number | No | 最高價格篩選 |
| sortBy | string | No | 排序欄位 (createdAt, wishCount, expectedPrice) |
| sortOrder | string | No | 排序方向 (asc, desc) |
| page | number | No | 頁碼 (預設: 1) |
| pageSize | number | No | 每頁筆數 (預設: 20) |

**Response**:
```json
{
  "data": [
    {
      "id": "wish-001",
      "userId": "user-123",
      "userName": "買家A",
      "productName": "iPhone 15 Pro",
      "description": "希望能以優惠價格購買",
      "category": "電子產品",
      "expectedPrice": 30000,
      "currency": "TWD",
      "wishCount": 15,
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5
}
```

**Status Codes**:
- 200: 成功取得資料
- 400: 請求參數錯誤
- 500: 伺服器錯誤

## Implementation Phases

### Phase 1: Basic Implementation (Current)
- 建立頁面結構和路由
- 實作靜態 UI 元件
- 使用模擬資料展示功能
- 實作導航功能

### Phase 2: API Integration (Future)
- 連接真實資料庫
- 實作完整 CRUD API
- 加入使用者認證
- 實作即時更新功能

### Phase 3: Enhancement (Future)
- 加入進階篩選功能
- 實作商品推薦系統
- 加入資料分析儀表板
- 優化效能和使用體驗