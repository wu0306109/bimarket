'use client';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useInfiniteWishProducts } from '@/hooks/useInfiniteWishProducts';
import { WishProduct, WishProductFilter } from '@/lib/wish-products/types';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { AnimatePresence, m } from 'framer-motion';

import { WishProductCard } from './WishProductCard';
import { useEffect } from 'react';
import { usePetitionStore } from '@/stores/petition.store';

interface WishProductListProps {
  filters?: WishProductFilter;
  onProductClick?: (product: WishProduct) => void;
}

// 骨架載入元件
function ProductCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="80%" height={32} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="30%" />
        </Box>
      </CardContent>
    </Card>
  );
}

export function WishProductList({
  filters,
  onProductClick,
}: WishProductListProps) {
  const { products, loading, loadingMore, error, hasMore, total, loadMore } =
    useInfiniteWishProducts(filters);

  // 同步初始 wishCount 到全域連署 store（供列表/詳情共用）
  const petitionStore = usePetitionStore();
  useEffect(() => {
    if (products && products.length > 0) {
      petitionStore.hydrateFromList(products.map((p) => ({ id: p.id, wishCount: p.wishCount })));
    }
  }, [products]);

  // 設置無限滾動
  useInfiniteScroll({
    hasMore,
    loading: loadingMore,
    onLoadMore: loadMore,
    threshold: 300, // 距離底部300px時開始載入
  });

  // 初始載入狀態
  if (loading && products.length === 0) {
    return (
      <Grid container spacing={3}>
        {[...Array(8)].map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <ProductCardSkeleton />
            </m.div>
          </Grid>
        ))}
      </Grid>
    );
  }

  // 錯誤狀態
  if (error && products.length === 0) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="body1">載入許願商品時發生錯誤</Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Alert>
    );
  }

  // 無資料狀態
  if (!loading && products.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          目前沒有許願商品
        </Typography>
        <Typography variant="body2" color="text.secondary">
          成為第一個許願的買家吧！
        </Typography>
      </Box>
    );
  }

  // 正常顯示資料
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography variant="body2" color="text.secondary">
            共找到 {total} 個許願商品
            {products.length > 0 && <span>，已顯示 {products.length} 個</span>}
          </Typography>
        </m.div>
      </Box>

      <Grid container spacing={3}>
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: index * 0.02 }}
              >
                <WishProductCard product={product} onClick={onProductClick} />
              </m.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {/* 載入更多指示器 */}
      {loadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <m.div
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 0.8,
            }}
          >
            <CircularProgress size={40} />
          </m.div>
        </Box>
      )}

      {/* 沒有更多資料的提示 */}
      {!hasMore && products.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            已顯示全部商品
          </Typography>
        </Box>
      )}
    </>
  );
}
