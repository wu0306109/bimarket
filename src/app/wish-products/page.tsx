'use client';

import { useState, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Pagination,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { WishProductList } from '@/components/wish-products/WishProductList';
import { FilterPanel } from '@/components/wish-products/FilterPanel';
import { AddProductButton } from '@/components/wish-products/AddProductButton';
import { ProductDetailDialog } from '@/components/wish-products/ProductDetailDialog';
import { WishProductFilter, PaginationParams, WishProduct } from '@/lib/wish-products/types';
import { useWishProducts } from '@/hooks/useWishProducts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewListIcon from '@mui/icons-material/ViewList';
import Link from 'next/link';

export default function WishProductsPage() {
  const [filters, setFilters] = useState<WishProductFilter>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 20,
  });
  
  // 詳細資訊彈窗狀態
  const [selectedProduct, setSelectedProduct] = useState<WishProduct | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // 使用 Hook 獲取資料
  const { data } = useWishProducts(filters, pagination);

  // 處理篩選條件變更
  const handleFilterChange = useCallback((newFilters: WishProductFilter) => {
    setFilters(newFilters);
    // 重置到第一頁
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // 處理分頁變更
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(prev => ({ ...prev, page: value }));
    // 滾動到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 處理商品點擊
  const handleProductClick = (product: WishProduct) => {
    setSelectedProduct(product);
    setDetailDialogOpen(true);
  };
  
  // 處理關閉彈窗
  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      {/* 頁面標題欄 */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{ bgcolor: 'primary.main', zIndex: 1100 }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            component={Link}
            href="/"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <ViewListIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            許願商品清單
          </Typography>
          {/* 新增商品按鈕移到導覽列 */}
          <AddProductButton color="inherit" />
        </Toolbar>
      </AppBar>

      {/* 主要內容區域 */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
      
      {/* 篩選面板 */}
      <FilterPanel 
        onFilterChange={handleFilterChange} 
        totalCount={data?.total}
      />
      
      {/* 商品清單 */}
      <WishProductList 
        filters={filters} 
        pagination={pagination}
        onProductClick={handleProductClick}
      />
      
      {/* 分頁控制 */}
      {data && data.totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={data.totalPages} 
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
      
      {/* 商品詳細資訊彈窗 */}
      <ProductDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDialog}
        product={selectedProduct}
      />
      </Container>
    </>
  );
}