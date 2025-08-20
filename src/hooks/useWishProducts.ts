'use client';

import { useState, useEffect } from 'react';
import { 
  WishProductsResponse, 
  WishProductFilter, 
  PaginationParams 
} from '@/lib/wish-products/types';

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
        setError(null);
        
        // 建立查詢參數
        const params = new URLSearchParams();
        
        if (filters?.category) {
          params.append('category', filters.category);
        }
        if (filters?.minPrice !== undefined) {
          params.append('minPrice', filters.minPrice.toString());
        }
        if (filters?.maxPrice !== undefined) {
          params.append('maxPrice', filters.maxPrice.toString());
        }
        if (filters?.sortBy) {
          params.append('sortBy', filters.sortBy);
        }
        if (filters?.sortOrder) {
          params.append('sortOrder', filters.sortOrder);
        }
        if (pagination?.page) {
          params.append('page', pagination.page.toString());
        }
        if (pagination?.pageSize) {
          params.append('pageSize', pagination.pageSize.toString());
        }
        
        // 呼叫 API
        const response = await fetch(`/api/wish-products-list?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch wish products');
        }
        
        const result = await response.json();
        
        // 將 ISO 字串轉換回 Date 物件
        const processedData = {
          ...result,
          data: result.data.map((product: any) => ({
            ...product,
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt),
          })),
        };
        
        setData(processedData);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching wish products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [
    filters?.category,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.sortBy,
    filters?.sortOrder,
    pagination?.page,
    pagination?.pageSize,
  ]);
  
  return { data, loading, error };
}