'use client';

import {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
  ProductCategory,
  WishProduct,
} from '@/types/wish-product';
import { FavoriteBorder as HeartIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function PublicWishProductList() {
  const [products, setProducts] = useState<WishProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all wish products without pagination for public display
      const response = await fetch('/api/wish-products?limit=9999');
      const result: ApiResponse<PaginatedResponse<WishProduct>> =
        await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || '載入失敗');
      }

      setProducts(result.data?.items || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : '載入商品清單失敗');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const result: ApiResponse<ProductCategory[]> = await response.json();

      if (result.success) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error('載入類別失敗:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(
      (c) =>
        c.id === categoryId ||
        c.id === Number(categoryId) ||
        String(c.id) === String(categoryId),
    );
    return category?.name || '未知類別';
  };

  const handleLike = async (productId: string) => {
    try {
      // Optimistically update the UI
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, likeCount: (p.likeCount || 0) + 1 } : p,
        ),
      );

      const response = await fetch(`/api/wish-products/${productId}/like`, {
        method: 'POST',
      });
      const result: ApiResponse<WishProduct> = await response.json();

      if (!result.success) {
        // Revert optimistic update if API call fails
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId ? { ...p, likeCount: (p.likeCount || 0) - 1 } : p,
          ),
        );
        throw new Error(result.error?.message || '點讚失敗');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '點讚失敗');
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="space-around">
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 400 }}>
                <CardActionArea sx={{ flexGrow: 1 }}>
                  {product.imageUrls && product.imageUrls.length > 0 && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={`/uploads/wish-products/${product.imageUrls[0]}`}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      類別: {getCategoryName(product.categoryId)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      所在領域: {product.region}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      期望價格: {product.expectedPrice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {product.description.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    建立於: {new Date(product.createdAt).toLocaleDateString('zh-TW')}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <HeartIcon
                      sx={{ cursor: 'pointer', mr: 0.5 }}
                      onClick={() => handleLike(product.id)}
                    />
                    <Typography variant="body2">
                      {product.likeCount || 0}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
