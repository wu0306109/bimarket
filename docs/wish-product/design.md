# 買家許願功能 - 技術設計文件

## 1. 資料儲存設計 (CSV 檔案)

### 1.1 許願商品資料檔案 (wish-products.csv)

```csv
id,name,description,category_id,region,additional_info,image_urls,status,user_id,created_at,updated_at
550e8400-e29b-41d4-a716-446655440000,"測試商品","這是一個測試商品的詳細描述",1,"台灣","額外的補充資訊","image1.jpg;image2.jpg","pending","user123","2024-01-15T10:30:00Z","2024-01-15T10:30:00Z"
```

**欄位說明：**
- `id`: UUID 格式的唯一識別碼
- `name`: 商品名稱 (必填，最多255字元)
- `description`: 商品描述 (必填，最多2000字元)
- `category_id`: 商品類別ID (必填，對應類別檔案中的ID)
- `region`: 商品所在領域/地區 (必填，最多100字元)
- `additional_info`: 其他補充資訊 (選填，最多1000字元)
- `image_urls`: 商品圖片檔名，多個檔案以分號分隔
- `status`: 處理狀態 (pending/processing/completed/cancelled)
- `user_id`: 提交用戶ID (選填)
- `created_at`: 建立時間 (ISO 8601 格式)
- `updated_at`: 更新時間 (ISO 8601 格式)

### 1.2 商品類別資料檔案 (product-categories.csv)

```csv
id,name,description,is_active,sort_order,created_at,updated_at
1,"電子產品","各種電子設備和配件",true,1,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
2,"服飾配件","衣服、鞋子、包包等",true,2,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
3,"美妝保養","化妝品、保養品、香水等",true,3,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
4,"食品飲料","零食、飲料、保健食品等",true,4,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
5,"居家生活","家具、家電、生活用品等",true,5,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
```

**欄位說明：**
- `id`: 類別唯一識別碼 (數字)
- `name`: 類別名稱 (必填，最多100字元)
- `description`: 類別描述 (選填)
- `is_active`: 是否啟用 (true/false)
- `sort_order`: 排序順序 (數字)
- `created_at`: 建立時間 (ISO 8601 格式)
- `updated_at`: 更新時間 (ISO 8601 格式)

### 1.3 檔案上傳記錄檔案 (file-uploads.csv)

```csv
id,original_filename,stored_filename,file_path,file_size,mime_type,related_table,related_id,created_at
550e8400-e29b-41d4-a716-446655440001,"product-image.jpg","20240115_103000_product-image.jpg","/uploads/wish-products/20240115_103000_product-image.jpg",245760,"image/jpeg","wish_products","550e8400-e29b-41d4-a716-446655440000","2024-01-15T10:30:00Z"
```

**欄位說明：**
- `id`: 檔案記錄唯一識別碼 (UUID)
- `original_filename`: 原始檔案名稱
- `stored_filename`: 儲存的檔案名稱
- `file_path`: 完整檔案路徑
- `file_size`: 檔案大小 (bytes)
- `mime_type`: MIME 類型
- `related_table`: 關聯的資料類型 (wish_products)
- `related_id`: 關聯的資料ID
- `created_at`: 上傳時間 (ISO 8601 格式)

## 2. 資料模型設計

### 2.1 TypeScript 介面定義

```typescript
// 許願商品介面
interface WishProduct {
  id: string;
  name: string;
  description: string;
  categoryId: number;
  region: string;
  additionalInfo?: string;
  imageUrls: string[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 商品類別介面
interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// 表單提交資料介面
interface WishProductForm {
  name: string;
  description: string;
  categoryId: number;
  region: string;
  additionalInfo?: string;
  images?: File[];
}

// 表單驗證規則介面
interface FormValidation {
  name: {
    required: true;
    maxLength: 255;
    minLength: 2;
  };
  description: {
    required: true;
    maxLength: 2000;
    minLength: 10;
  };
  categoryId: {
    required: true;
    type: 'number';
  };
  region: {
    required: true;
    maxLength: 100;
  };
  additionalInfo: {
    maxLength: 1000;
  };
  images: {
    maxFiles: 5;
    maxFileSize: 5 * 1024 * 1024; // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'];
  };
}
```

## 3. API 設計

### 3.1 CSV 檔案操作服務

```typescript
// CSV 檔案操作服務
class CSVDataService {
  private dataPath = './data/';
  
  // 讀取 CSV 檔案
  async readCSV<T>(filename: string): Promise<T[]> {
    const filePath = path.join(this.dataPath, filename);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const content = await fs.readFile(filePath, 'utf-8');
    return csvParse(content, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        // 處理特殊欄位轉換
        if (field === 'is_active') return value === 'true';
        if (field === 'category_id' || field === 'sort_order' || field === 'file_size') {
          return parseInt(value);
        }
        if (field === 'image_urls' && value) {
          return value.split(';').filter(Boolean);
        }
        return value;
      }
    });
  }
  
  // 寫入 CSV 檔案
  async writeCSV<T>(filename: string, data: T[]): Promise<void> {
    const filePath = path.join(this.dataPath, filename);
    
    // 確保目錄存在
    await fs.ensureDir(this.dataPath);
    
    const csvContent = csvStringify(data, {
      header: true,
      transform: (value, field) => {
        // 處理特殊欄位轉換
        if (Array.isArray(value)) {
          return value.join(';');
        }
        if (typeof value === 'boolean') {
          return value.toString();
        }
        return value;
      }
    });
    
    await fs.writeFile(filePath, csvContent, 'utf-8');
  }
  
  // 生成唯一 ID
  generateId(): string {
    return uuidv4();
  }
  
  // 取得當前時間戳
  getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
}
```

### 3.2 許願商品相關 API

#### POST /api/wish-products
建立新的許願商品

**實作邏輯：**
```typescript
async function createWishProduct(req: Request, res: Response) {
  try {
    const csvService = new CSVDataService();
    
    // 1. 驗證表單資料
    const validatedData = wishProductSchema.parse(req.body);
    
    // 2. 處理圖片上傳
    const imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const uploadResult = await uploadImage(file);
        imageUrls.push(uploadResult.filename);
      }
    }
    
    // 3. 讀取現有資料
    const existingProducts = await csvService.readCSV<WishProduct>('wish-products.csv');
    
    // 4. 建立新商品資料
    const newProduct: WishProduct = {
      id: csvService.generateId(),
      name: validatedData.name,
      description: validatedData.description,
      categoryId: validatedData.categoryId,
      region: validatedData.region,
      additionalInfo: validatedData.additionalInfo || '',
      imageUrls: imageUrls,
      status: 'pending',
      userId: req.user?.id || '',
      createdAt: new Date(csvService.getCurrentTimestamp()),
      updatedAt: new Date(csvService.getCurrentTimestamp())
    };
    
    // 5. 新增到資料陣列
    existingProducts.push(newProduct);
    
    // 6. 寫入 CSV 檔案
    await csvService.writeCSV('wish-products.csv', existingProducts);
    
    // 7. 記錄檔案上傳資訊
    if (imageUrls.length > 0) {
      const uploadRecords = await csvService.readCSV<FileUpload>('file-uploads.csv');
      for (const filename of imageUrls) {
        uploadRecords.push({
          id: csvService.generateId(),
          originalFilename: filename,
          storedFilename: filename,
          filePath: `/uploads/wish-products/${filename}`,
          fileSize: 0, // 實際實作時需要取得檔案大小
          mimeType: 'image/jpeg', // 實際實作時需要檢測
          relatedTable: 'wish_products',
          relatedId: newProduct.id,
          createdAt: new Date(csvService.getCurrentTimestamp())
        });
      }
      await csvService.writeCSV('file-uploads.csv', uploadRecords);
    }
    
    res.status(201).json({
      success: true,
      data: {
        id: newProduct.id,
        message: '許願商品已成功提交'
      }
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '表單資料驗證失敗',
        details: error.errors
      }
    });
  }
}
```

**請求格式：**
```typescript
// Content-Type: multipart/form-data
interface CreateWishProductRequest {
  name: string;
  description: string;
  categoryId: number;
  region: string;
  additionalInfo?: string;
  images?: File[];
}
```

**回應格式：**
```typescript
// 成功回應 (201 Created)
interface CreateWishProductResponse {
  success: true;
  data: {
    id: string;
    message: string;
  };
}

// 錯誤回應 (400 Bad Request)
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: {
      field: string;
      message: string;
    }[];
  };
}
```

#### GET /api/wish-products
查詢許願商品清單（管理員用）

**實作邏輯：**
```typescript
async function getWishProducts(req: Request, res: Response) {
  try {
    const csvService = new CSVDataService();
    
    // 1. 解析查詢參數
    const {
      page = 1,
      limit = 10,
      category,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // 2. 讀取所有許願商品資料
    let products = await csvService.readCSV<WishProduct>('wish-products.csv');
    
    // 3. 套用篩選條件
    if (category) {
      products = products.filter(p => p.categoryId === parseInt(category as string));
    }
    
    if (status) {
      products = products.filter(p => p.status === status);
    }
    
    if (startDate) {
      const start = new Date(startDate as string);
      products = products.filter(p => new Date(p.createdAt) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate as string);
      products = products.filter(p => new Date(p.createdAt) <= end);
    }
    
    // 4. 排序
    products.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default: // createdAt
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // 5. 分頁
    const total = products.length;
    const totalPages = Math.ceil(total / parseInt(limit as string));
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const paginatedProducts = products.slice(offset, offset + parseInt(limit as string));
    
    res.json({
      success: true,
      data: {
        items: paginatedProducts,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FILE_READ_ERROR',
        message: '無法讀取許願商品資料'
      }
    });
  }
}
```

**查詢參數：**
```typescript
interface GetWishProductsQuery {
  page?: number;
  limit?: number;
  category?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}
```

**回應格式：**
```typescript
interface GetWishProductsResponse {
  success: true;
  data: {
    items: WishProduct[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
```

#### GET /api/wish-products/:id
取得單一許願商品詳情

**實作邏輯：**
```typescript
async function getWishProductById(req: Request, res: Response) {
  try {
    const csvService = new CSVDataService();
    const { id } = req.params;
    
    // 讀取所有許願商品資料
    const products = await csvService.readCSV<WishProduct>('wish-products.csv');
    
    // 尋找指定 ID 的商品
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: '找不到指定的許願商品'
        }
      });
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FILE_READ_ERROR',
        message: '無法讀取許願商品資料'
      }
    });
  }
}
```

**回應格式：**
```typescript
interface GetWishProductResponse {
  success: true;
  data: WishProduct;
}
```

### 3.3 商品類別相關 API

#### GET /api/categories
取得所有啟用的商品類別

**實作邏輯：**
```typescript
async function getCategories(req: Request, res: Response) {
  try {
    const csvService = new CSVDataService();
    
    // 讀取類別資料
    let categories = await csvService.readCSV<ProductCategory>('product-categories.csv');
    
    // 只回傳啟用的類別，並按排序順序排列
    categories = categories
      .filter(c => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FILE_READ_ERROR',
        message: '無法讀取類別資料'
      }
    });
  }
}
```

**回應格式：**
```typescript
interface GetCategoriesResponse {
  success: true;
  data: ProductCategory[];
}
```

### 3.4 檔案上傳 API

#### POST /api/upload
上傳檔案

**實作邏輯：**
```typescript
async function uploadFile(req: Request, res: Response) {
  try {
    const csvService = new CSVDataService();
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE_PROVIDED',
          message: '請選擇要上傳的檔案'
        }
      });
    }
    
    const file = req.file;
    
    // 驗證檔案類型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: '只支援 JPG, PNG, WebP 格式的圖片'
        }
      });
    }
    
    // 驗證檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: '檔案大小不可超過 5MB'
        }
      });
    }
    
    // 生成唯一檔名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = path.extname(file.originalname);
    const storedFilename = `${timestamp}_${file.originalname}`;
    const filePath = path.join('./uploads/wish-products/', storedFilename);
    
    // 確保上傳目錄存在
    await fs.ensureDir('./uploads/wish-products/');
    
    // 儲存檔案
    await fs.writeFile(filePath, file.buffer);
    
    // 記錄上傳資訊
    const uploadRecord = {
      id: csvService.generateId(),
      originalFilename: file.originalname,
      storedFilename: storedFilename,
      filePath: filePath,
      fileSize: file.size,
      mimeType: file.mimetype,
      relatedTable: '',
      relatedId: '',
      createdAt: new Date(csvService.getCurrentTimestamp())
    };
    
    const uploadRecords = await csvService.readCSV<FileUpload>('file-uploads.csv');
    uploadRecords.push(uploadRecord);
    await csvService.writeCSV('file-uploads.csv', uploadRecords);
    
    res.json({
      success: true,
      data: {
        id: uploadRecord.id,
        url: `/uploads/wish-products/${storedFilename}`,
        filename: storedFilename
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FILE_UPLOAD_ERROR',
        message: '檔案上傳失敗'
      }
    });
  }
}
```

**請求格式：**
```typescript
// Content-Type: multipart/form-data
interface UploadRequest {
  file: File;
  type: 'wish-product-image';
}
```

**回應格式：**
```typescript
interface UploadResponse {
  success: true;
  data: {
    id: string;
    url: string;
    filename: string;
  };
}
```

## 4. 前端元件設計

### 4.1 元件結構

```
src/components/wish-product/
├── WishProductForm/
│   ├── index.tsx                 # 主表單元件
│   ├── FormField.tsx            # 通用表單欄位元件
│   ├── ImageUpload.tsx          # 圖片上傳元件
│   ├── CategorySelect.tsx       # 類別選擇元件
│   └── SubmitButton.tsx         # 提交按鈕元件
├── WishProductList/
│   ├── index.tsx                # 商品清單元件
│   ├── ProductCard.tsx          # 商品卡片元件
│   ├── FilterPanel.tsx          # 篩選面板元件
│   └── Pagination.tsx           # 分頁元件
└── shared/
    ├── LoadingSpinner.tsx       # 載入動畫元件
    ├── ErrorMessage.tsx         # 錯誤訊息元件
    └── SuccessMessage.tsx       # 成功訊息元件
```

### 4.2 表單驗證規則

```typescript
// 使用 Zod 進行表單驗證
import { z } from 'zod';

const wishProductSchema = z.object({
  name: z.string()
    .min(2, '商品名稱至少需要2個字元')
    .max(255, '商品名稱不可超過255個字元')
    .trim(),
  
  description: z.string()
    .min(10, '商品描述至少需要10個字元')
    .max(2000, '商品描述不可超過2000個字元')
    .trim(),
  
  categoryId: z.number()
    .int('請選擇有效的商品類別')
    .positive('請選擇商品類別'),
  
  region: z.string()
    .min(1, '請填寫商品所在領域')
    .max(100, '商品所在領域不可超過100個字元')
    .trim(),
  
  additionalInfo: z.string()
    .max(1000, '補充資訊不可超過1000個字元')
    .optional(),
  
  images: z.array(z.instanceof(File))
    .max(5, '最多只能上傳5張圖片')
    .optional()
    .refine((files) => {
      if (!files) return true;
      return files.every(file => 
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      );
    }, '只支援 JPG, PNG, WebP 格式的圖片')
    .refine((files) => {
      if (!files) return true;
      return files.every(file => file.size <= 5 * 1024 * 1024);
    }, '每張圖片大小不可超過 5MB')
});

type WishProductFormData = z.infer<typeof wishProductSchema>;
```

### 4.3 狀態管理設計

```typescript
// 使用 Zustand 進行狀態管理
interface WishProductStore {
  // 表單狀態
  formData: Partial<WishProductFormData>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  
  // 圖片上傳狀態
  uploadingImages: boolean;
  uploadedImages: Array<{
    id: string;
    url: string;
    file: File;
  }>;
  
  // 類別資料
  categories: ProductCategory[];
  loadingCategories: boolean;
  
  // 動作
  updateFormData: (data: Partial<WishProductFormData>) => void;
  submitForm: (data: WishProductFormData) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  removeImage: (id: string) => void;
  loadCategories: () => Promise<void>;
  resetForm: () => void;
}
```

## 5. 圖片上傳機制設計

### 5.1 上傳流程

1. **前端預處理**
   - 檔案格式驗證
   - 檔案大小檢查
   - 圖片壓縮（如需要）
   - 產生預覽圖

2. **上傳策略**
   - 使用 multipart/form-data 格式
   - 支援多檔案同時上傳
   - 實作上傳進度顯示
   - 錯誤重試機制

3. **後端處理**
   - 檔案類型驗證
   - 病毒掃描（如需要）
   - 生成唯一檔名
   - 儲存至指定目錄
   - 記錄上傳資訊

### 5.2 儲存策略

```typescript
// 檔案儲存設定
interface FileStorageConfig {
  uploadPath: string;              // 上傳目錄
  maxFileSize: number;             // 最大檔案大小
  allowedMimeTypes: string[];      // 允許的檔案類型
  generateThumbnail: boolean;      // 是否生成縮圖
  thumbnailSizes: number[];        // 縮圖尺寸
}

const storageConfig: FileStorageConfig = {
  uploadPath: '/uploads/wish-products/',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  generateThumbnail: true,
  thumbnailSizes: [150, 300, 600]
};
```

## 6. 管理員介面設計

### 6.1 查詢功能設計

```typescript
// 篩選條件介面
interface AdminFilterOptions {
  category?: number;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  keyword?: string;
  sortBy: 'createdAt' | 'updatedAt' | 'name';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// 管理員商品清單元件
interface AdminWishProductListProps {
  filters: AdminFilterOptions;
  onFilterChange: (filters: AdminFilterOptions) => void;
  onExport?: () => void;
  onBulkAction?: (action: string, ids: string[]) => void;
}
```

### 6.2 管理功能

1. **清單檢視**
   - 表格形式顯示
   - 支援排序和分頁
   - 批量選擇操作
   - 快速篩選選項

2. **詳情檢視**
   - 完整商品資訊顯示
   - 圖片輪播檢視
   - 狀態變更操作
   - 備註新增功能

3. **匯出功能**
   - CSV 格式匯出
   - Excel 格式匯出
   - 可選擇匯出欄位
   - 支援篩選後匯出

## 7. 錯誤處理設計

### 7.1 錯誤代碼定義

```typescript
enum ErrorCodes {
  // 驗證錯誤
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  NO_FILE_PROVIDED = 'NO_FILE_PROVIDED',
  
  // 業務邏輯錯誤
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  DUPLICATE_SUBMISSION = 'DUPLICATE_SUBMISSION',
  
  // 檔案操作錯誤
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  CSV_PARSE_ERROR = 'CSV_PARSE_ERROR',
  
  // 系統錯誤
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}
```

### 7.2 錯誤處理機制

```typescript
// 全域錯誤處理器
class ErrorHandler {
  static handleApiError(error: any): ErrorResponse {
    // 表單驗證錯誤
    if (error.code === 'VALIDATION_ERROR') {
      return {
        success: false,
        error: {
          code: error.code,
          message: '表單資料驗證失敗',
          details: error.details
        }
      };
    }
    
    // 檔案操作錯誤
    if (error.code === 'FILE_READ_ERROR') {
      return {
        success: false,
        error: {
          code: error.code,
          message: '無法讀取資料檔案，請稍後再試'
        }
      };
    }
    
    if (error.code === 'FILE_WRITE_ERROR') {
      return {
        success: false,
        error: {
          code: error.code,
          message: '無法儲存資料，請稍後再試'
        }
      };
    }
    
    if (error.code === 'CSV_PARSE_ERROR') {
      return {
        success: false,
        error: {
          code: error.code,
          message: '資料格式解析錯誤'
        }
      };
    }
    
    // 檔案上傳錯誤
    if (error.code === 'FILE_UPLOAD_ERROR') {
      return {
        success: false,
        error: {
          code: error.code,
          message: '檔案上傳失敗，請檢查檔案格式和大小'
        }
      };
    }
    
    // 業務邏輯錯誤
    if (error.code === 'PRODUCT_NOT_FOUND') {
      return {
        success: false,
        error: {
          code: error.code,
          message: '找不到指定的許願商品'
        }
      };
    }
    
    // 預設錯誤
    return {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '系統暫時無法處理您的請求，請稍後再試'
      }
    };
  }
  
  // CSV 檔案安全讀取
  static async safeReadCSV<T>(csvService: CSVDataService, filename: string): Promise<T[]> {
    try {
      return await csvService.readCSV<T>(filename);
    } catch (error) {
      console.error(`CSV 讀取失敗: ${filename}`, error);
      throw { code: 'FILE_READ_ERROR' };
    }
  }
  
  // CSV 檔案安全寫入
  static async safeWriteCSV<T>(csvService: CSVDataService, filename: string, data: T[]): Promise<void> {
    try {
      return await csvService.writeCSV(filename, data);
    } catch (error) {
      console.error(`CSV 寫入失敗: ${filename}`, error);
      throw { code: 'FILE_WRITE_ERROR' };
    }
  }
}
```

## 8. 效能最佳化設計

### 8.1 前端最佳化

1. **圖片最佳化**
   - 圖片懶載入
   - WebP 格式支援
   - 響應式圖片
   - 圖片壓縮

2. **表單最佳化**
   - 表單資料本地儲存
   - 防抖動驗證
   - 分段載入
   - 快取類別資料

### 8.2 後端最佳化

1. **CSV 檔案操作最佳化**
   - 檔案讀取快取機制
   - 分批處理大型資料集
   - 檔案鎖定機制防止併發寫入
   - 定期檔案備份和壓縮

2. **API 最佳化**
   - 回應資料壓縮
   - API 回應快取
   - 請求限流
   - CDN 整合

3. **檔案系統最佳化**
   ```typescript
   // CSV 快取服務
   class CSVCacheService {
     private cache = new Map<string, { data: any[], timestamp: number }>();
     private readonly CACHE_TTL = 5 * 60 * 1000; // 5分鐘
     
     async getCachedData<T>(filename: string, csvService: CSVDataService): Promise<T[]> {
       const cached = this.cache.get(filename);
       const now = Date.now();
       
       if (cached && (now - cached.timestamp) < this.CACHE_TTL) {
         return cached.data;
       }
       
       const data = await csvService.readCSV<T>(filename);
       this.cache.set(filename, { data, timestamp: now });
       return data;
     }
     
     invalidateCache(filename: string): void {
       this.cache.delete(filename);
     }
   }
   ```

## 9. 安全性設計

### 9.1 資料驗證

1. **輸入驗證**
   - SQL 注入防護
   - XSS 攻擊防護
   - 檔案上傳安全檢查
   - 請求大小限制

2. **權限控制**
   - 管理員權限驗證
   - API 存取控制
   - 檔案存取權限
   - 操作日誌記錄

### 9.2 資料保護

1. **敏感資料處理**
   - 個人資料匿名化選項
   - CSV 檔案加密儲存（如需要）
   - 安全的檔案儲存權限設定
   - 定期資料清理和備份

2. **CSV 檔案安全**
   ```typescript
   // CSV 檔案安全操作
   class SecureCSVService extends CSVDataService {
     // 檔案權限檢查
     private async checkFilePermissions(filePath: string): Promise<boolean> {
       try {
         await fs.access(filePath, fs.constants.R_OK | fs.constants.W_OK);
         return true;
       } catch {
         return false;
       }
     }
     
     // 安全讀取 CSV
     async secureReadCSV<T>(filename: string): Promise<T[]> {
       const filePath = path.join(this.dataPath, filename);
       
       if (!(await this.checkFilePermissions(filePath))) {
         throw { code: 'FILE_PERMISSION_ERROR' };
       }
       
       return super.readCSV<T>(filename);
     }
     
     // 備份檔案
     async backupCSV(filename: string): Promise<void> {
       const sourcePath = path.join(this.dataPath, filename);
       const backupPath = path.join(this.dataPath, 'backups', `${Date.now()}_${filename}`);
       
       await fs.ensureDir(path.dirname(backupPath));
       await fs.copy(sourcePath, backupPath);
     }
   }
   ```

## 10. 測試策略

### 10.1 單元測試

```typescript
// 表單驗證測試
describe('WishProductForm Validation', () => {
  test('should validate required fields', () => {
    const result = wishProductSchema.safeParse({});
    expect(result.success).toBe(false);
  });
  
  test('should accept valid form data', () => {
    const validData = {
      name: '測試商品',
      description: '這是一個測試商品的描述',
      categoryId: 1,
      region: '台灣'
    };
    const result = wishProductSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
```

### 10.2 整合測試

```typescript
// API 整合測試
describe('Wish Product API', () => {
  test('POST /api/wish-products should create new wish product', async () => {
    const formData = new FormData();
    formData.append('name', '測試商品');
    formData.append('description', '測試描述');
    formData.append('categoryId', '1');
    formData.append('region', '台灣');
    
    const response = await request(app)
      .post('/api/wish-products')
      .send(formData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
  });
});
```

### 10.3 E2E 測試

```typescript
// 使用 Playwright 進行端到端測試
test('User can submit wish product form', async ({ page }) => {
  await page.goto('/wish-product');
  
  await page.fill('[data-testid="product-name"]', '測試商品');
  await page.fill('[data-testid="product-description"]', '這是一個測試商品');
  await page.selectOption('[data-testid="product-category"]', '1');
  await page.fill('[data-testid="product-region"]', '台灣');
  
  await page.click('[data-testid="submit-button"]');
  
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

## 11. 部署與監控

### 11.1 部署設定

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATA_PATH=/app/data
      - UPLOAD_PATH=/app/uploads
      - MAX_FILE_SIZE=5242880
      - CACHE_TTL=300000
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
      - ./backups:/app/data/backups
    restart: unless-stopped

volumes:
  data:
    driver: local
  uploads:
    driver: local
  backups:
    driver: local
```

**環境變數設定：**
```bash
# .env
DATA_PATH=./data
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
CACHE_TTL=300000
NODE_ENV=production
```

**目錄結構：**
```
project/
├── data/
│   ├── wish-products.csv
│   ├── product-categories.csv
│   ├── file-uploads.csv
│   └── backups/
├── uploads/
│   └── wish-products/
├── src/
└── docker-compose.yml
```

### 11.2 監控指標

1. **業務指標**
   - 許願商品提交數量
   - 表單完成率
   - 圖片上傳成功率
   - 管理員查詢頻率

2. **技術指標**
   - API 回應時間
   - 錯誤率
   - CSV 檔案讀寫效能
   - 檔案儲存使用量
   - 快取命中率

3. **檔案系統監控**
   ```typescript
   // 監控服務
   class MonitoringService {
     static logMetrics(operation: string, duration: number, success: boolean) {
       console.log(`[METRICS] ${operation}: ${duration}ms, success: ${success}`);
     }
     
     static async monitorCSVOperation<T>(
       operation: string, 
       fn: () => Promise<T>
     ): Promise<T> {
       const startTime = Date.now();
       try {
         const result = await fn();
         this.logMetrics(operation, Date.now() - startTime, true);
         return result;
       } catch (error) {
         this.logMetrics(operation, Date.now() - startTime, false);
         throw error;
       }
     }
   }
   ```

### 11.3 初始化腳本

```bash
#!/bin/bash
# init-csv-data.sh

# 建立必要目錄
mkdir -p data/backups
mkdir -p uploads/wish-products

# 初始化 CSV 檔案
cat > data/product-categories.csv << EOF
id,name,description,is_active,sort_order,created_at,updated_at
1,"電子產品","各種電子設備和配件",true,1,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
2,"服飾配件","衣服、鞋子、包包等",true,2,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
3,"美妝保養","化妝品、保養品、香水等",true,3,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
4,"食品飲料","零食、飲料、保健食品等",true,4,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
5,"居家生活","家具、家電、生活用品等",true,5,"2024-01-01T00:00:00Z","2024-01-01T00:00:00Z"
EOF

# 建立空的許願商品檔案
echo "id,name,description,category_id,region,additional_info,image_urls,status,user_id,created_at,updated_at" > data/wish-products.csv

# 建立空的檔案上傳記錄
echo "id,original_filename,stored_filename,file_path,file_size,mime_type,related_table,related_id,created_at" > data/file-uploads.csv

echo "CSV 資料檔案初始化完成！"
```

---

此設計文件涵蓋了買家許願功能的完整技術規格，**使用 CSV 檔案作為資料儲存方案**，包含：

## 主要特色

1. **檔案儲存系統**：使用 CSV 檔案儲存資料，無需資料庫依賴
2. **API 規格**：完整的 REST API 設計，支援 CRUD 操作
3. **前端元件架構**：現代化的 React 元件設計
4. **檔案上傳機制**：支援圖片上傳和管理
5. **管理員功能**：完整的後台管理介面
6. **錯誤處理**：針對檔案操作的錯誤處理機制
7. **效能最佳化**：包含檔案快取和批次處理
8. **安全性考量**：檔案權限控制和資料保護
9. **測試策略**：單元測試、整合測試、E2E 測試
10. **部署監控**：Docker 部署和監控指標

## 技術棧

- **後端**：Node.js + Express + TypeScript
- **前端**：React + TypeScript + Zod 驗證
- **資料儲存**：CSV 檔案系統
- **檔案處理**：Multer + fs-extra
- **狀態管理**：Zustand
- **部署**：Docker + Docker Compose

## 開始使用

1. 執行初始化腳本：`bash init-csv-data.sh`
2. 啟動服務：`docker-compose up -d`
3. 存取前端：`http://localhost:3000`

所有設計都基於 requirements.md 中定義的需求和驗收標準，適合初期快速開發和部署。
