import { z } from 'zod';

// 許願商品介面
export interface WishProduct {
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
  likeCount?: number; // Added for wish-product likes
}

// 商品類別介面
export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// 檔案上傳記錄介面
export interface FileUpload {
  id: string;
  originalFilename: string;
  storedFilename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  relatedTable: string;
  relatedId: string;
  createdAt: Date;
}

// 表單提交資料介面
export interface WishProductForm {
  name: string;
  description: string;
  categoryId: number;
  region: string;
  additionalInfo?: string;
  images?: File[];
}

// 表單驗證規則
export const wishProductSchema = z.object({
  name: z
    .string()
    .min(2, '商品名稱至少需要2個字元')
    .max(255, '商品名稱不可超過255個字元')
    .trim(),

  description: z
    .string()
    .min(10, '商品描述至少需要10個字元')
    .max(2000, '商品描述不可超過2000個字元')
    .trim(),

  categoryId: z.number().int('請選擇有效的商品類別').positive('請選擇商品類別'),

  region: z
    .string()
    .min(1, '請填寫商品所在領域')
    .max(100, '商品所在領域不可超過100個字元')
    .trim(),

  additionalInfo: z.string().max(1000, '補充資訊不可超過1000個字元').optional(),

  images: z
    .array(z.instanceof(File))
    .max(5, '最多只能上傳5張圖片')
    .optional()
    .refine((files) => {
      if (!files) return true;
      return files.every((file) =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      );
    }, '只支援 JPG, PNG, WebP 格式的圖片')
    .refine((files) => {
      if (!files) return true;
      return files.every((file) => file.size <= 5 * 1024 * 1024);
    }, '每張圖片大小不可超過 5MB'),
});

export type WishProductFormData = z.infer<typeof wishProductSchema>;

// API 回應介面
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: {
      field: string;
      message: string;
    }[];
  };
}

// 分頁查詢參數
export interface PaginationQuery {
  page?: number;
  limit?: number;
  category?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

// 分頁回應資料
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// 錯誤代碼枚舉
export enum ErrorCodes {
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
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}
