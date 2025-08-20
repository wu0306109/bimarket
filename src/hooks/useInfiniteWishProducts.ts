'use client';

import { WishProduct, WishProductFilter } from '@/lib/wish-products/types';
import { useCallback, useEffect, useState } from 'react';

interface InfiniteWishProductsState {
  products: WishProduct[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  total: number;
}

export function useInfiniteWishProducts(
  filters?: WishProductFilter,
  pageSize: number = 12,
) {
  const [state, setState] = useState<InfiniteWishProductsState>({
    products: [],
    loading: true,
    loadingMore: false,
    error: null,
    hasMore: true,
    total: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);

  // 重置資料的函數
  const resetData = useCallback(() => {
    setState((prev) => ({
      ...prev,
      products: [],
      loading: true,
      loadingMore: false,
      error: null,
      hasMore: true,
      total: 0,
    }));
    setCurrentPage(1);
  }, []);

  // 載入資料的函數
  const loadData = useCallback(
    async (page: number, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setState((prev) => ({ ...prev, loadingMore: true }));
        } else {
          setState((prev) => ({ ...prev, loading: true, error: null }));
        }

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

        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());

        // 呼叫 API
        const response = await fetch(`/api/wish-products-list?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch wish products');
        }

        const result = await response.json();

        // 將 ISO 字串轉換回 Date 物件
        const processedProducts = result.data.map((product: any) => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        }));

        setState((prev) => {
          const newProducts = isLoadMore
            ? [...prev.products, ...processedProducts]
            : processedProducts;

          return {
            ...prev,
            products: newProducts,
            loading: false,
            loadingMore: false,
            total: result.total,
            hasMore: newProducts.length < result.total,
          };
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          loadingMore: false,
          error: err as Error,
        }));
        console.error('Error fetching wish products:', err);
      }
    },
    [filters, pageSize],
  );

  // 載入更多資料
  const loadMore = useCallback(() => {
    if (!state.loadingMore && state.hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadData(nextPage, true);
    }
  }, [state.loadingMore, state.hasMore, currentPage, loadData]);

  // 當篩選條件改變時重新載入
  useEffect(() => {
    resetData();
  }, [
    filters?.category,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.sortBy,
    filters?.sortOrder,
    resetData,
  ]);

  // 初始載入或重置後載入第一頁
  useEffect(() => {
    if (currentPage === 1) {
      loadData(1, false);
    }
  }, [currentPage, loadData]);

  return {
    products: state.products,
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    hasMore: state.hasMore,
    total: state.total,
    loadMore,
  };
}
