'use client';

import { 
  Grid, 
  Box, 
  CircularProgress, 
  Typography,
  Alert,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material';
import { WishProductCard } from './WishProductCard';
import { useWishProducts } from '@/hooks/useWishProducts';
import { WishProductFilter, PaginationParams, WishProduct } from '@/lib/wish-products/types';

interface WishProductListProps {
  filters?: WishProductFilter;
  pagination?: PaginationParams;
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

export function WishProductList({ filters, pagination, onProductClick }: WishProductListProps) {
  const { data, loading, error } = useWishProducts(filters, pagination);

  // 載入中狀態
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[...Array(8)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <ProductCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="body1">
          載入許願商品時發生錯誤
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Alert>
    );
  }

  // 無資料狀態
  if (!data || data.data.length === 0) {
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
        <Typography variant="body2" color="text.secondary">
          共找到 {data.total} 個許願商品
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {data.data.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <WishProductCard product={product} onClick={onProductClick} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}