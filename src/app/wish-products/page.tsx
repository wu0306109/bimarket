'use client';

import { AddProductButton } from '@/components/wish-products/AddProductButton';
import { FilterPanel } from '@/components/wish-products/FilterPanel';
import { ProductDetailDialog } from '@/components/wish-products/ProductDetailDialog';
import { WishProductList } from '@/components/wish-products/WishProductList';
import { WishProduct, WishProductFilter } from '@/lib/wish-products/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { m } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useState } from 'react';

export default function WishProductsPage() {
  const [filters, setFilters] = useState<WishProductFilter>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // 詳細資訊彈窗狀態
  const [selectedProduct, setSelectedProduct] = useState<WishProduct | null>(
    null,
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // 處理篩選條件變更
  const handleFilterChange = useCallback((newFilters: WishProductFilter) => {
    setFilters(newFilters);
  }, []);

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
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FilterPanel onFilterChange={handleFilterChange} />
        </m.div>

        {/* 商品清單 */}
        <WishProductList
          filters={filters}
          onProductClick={handleProductClick}
        />

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
