export interface WishProduct {
  id: string;
  userId: string;
  userName?: string;
  productName: string;
  description: string;
  category: string;
  expectedPrice: number;
  currency: string;
  wishCount: number;
  imageUrls?: string | string[];
  image_urls?: string | string[];  // 相容 CSV 欄位名稱
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