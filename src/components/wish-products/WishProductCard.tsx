'use client';

import { WishProduct } from '@/lib/wish-products/types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import { m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePetitionStore } from '@/stores/petition.store';
import { Snackbar, Alert } from '@mui/material';

interface WishProductCardProps {
  product: WishProduct;
  onClick?: (product: WishProduct) => void;
}

export function WishProductCard({ product, onClick }: WishProductCardProps) {
  // 處理圖片 URL
  const getImageUrl = (imageUrls: string | string[] | undefined) => {
    if (!imageUrls) return null;
    const urls =
      typeof imageUrls === 'string' ? imageUrls.split(',') : imageUrls;
    const firstImage = urls[0]?.trim();
    if (!firstImage || firstImage === '') return null;
    // 如果是相對路徑，使用 API 端點提供檔案服務
    if (!firstImage.startsWith('http') && !firstImage.startsWith('/')) {
      return `/api/serve-file/uploads/wish-products/${firstImage}`;
    }
    return firstImage;
  };

  const imageUrl = getImageUrl(product.imageUrls || product.image_urls);

  // 如果沒有圖片，使用 noimg.png
  const displayImageUrl = imageUrl || '/noimg.png';

  return (
    <m.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.2s',
          border: 'none',
          '&:hover': {
            boxShadow: 6,
            cursor: 'pointer',
          },
        }}
      >
        <CardActionArea
          onClick={() => onClick?.(product)}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            border: 'none', // 移除邊框
            outline: 'none', // 移除外框
          }}
        >
          {/* 圖片區域 - 有圖片顯示圖片，沒有圖片顯示 noimg.png */}
          <CardMedia
            component="img"
            height="200"
            image={displayImageUrl}
            alt={imageUrl ? product.productName : '商品圖片'}
            sx={{
              objectFit: 'cover',
              backgroundColor: 'grey.100',
              border: 'none', // 移除邊框
              outline: 'none', // 移除外框
            }}
            onError={(e) => {
              // 如果圖片載入失敗，顯示 noimg.png
              (e.target as HTMLImageElement).src = '/noimg.png';
            }}
          />
          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 商品資訊區域 - 自動推到底部 */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              {/* 商品名稱 */}
              <Typography variant="h6" component="h3" gutterBottom noWrap>
                {product.productName}
              </Typography>

              {/* 類別標籤 */}
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={product.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>

              {/* 商品描述 */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  minHeight: '2.5em',
                  flexGrow: 1, // 讓描述區域自動擴展
                }}
              >
                {product.description}
              </Typography>

              {/* 期望價格 */}
              <Typography
                variant="h6"
                color="primary"
                sx={{ mb: 2, fontWeight: 'bold' }}
              >
                NT$ {product.expectedPrice?.toLocaleString() || '0'}
              </Typography>

              {/* 底部資訊 */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {/* 使用者資訊 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Avatar
                    sx={{ width: 24, height: 24, bgcolor: 'primary.light' }}
                  >
                    <PersonIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    {product.userName || '匿名'}
                  </Typography>
                </Box>

                {/* 連署（愛心） */}
                <PetitionButton productId={product.id} initialCount={product.wishCount || 0} />
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </m.div>
  );
}

function PetitionButton({ productId, initialCount }: { productId: string; initialCount: number }) {
  const store = usePetitionStore();
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' },
  );

  useEffect(() => {
    store.ensure(productId, initialCount);
    // 首次掛載取得狀態
    (async () => {
      try {
        const res = await fetch(`/api/wish-products/${productId}/petition/status`);
        const data = await res.json();
        if (data?.success && typeof data.data?.petitioned === 'boolean') {
          store.setStatus(productId, data.data.petitioned);
        }
      } catch {}
    })();
  }, [productId]);

  const state = store.byProductId[productId];
  const petitioned = state?.petitioned || false;
  const count = state?.wishCount ?? initialCount;
  const loading = state?.loading || false;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {petitioned ? (
          <FavoriteIcon
            sx={{ fontSize: 18, color: 'error.main', cursor: loading ? 'not-allowed' : 'pointer' }}
            onClick={async (e) => {
              e.stopPropagation();
              if (!loading) {
                const ok = await store.togglePetition(productId);
                setSnack({ open: true, message: ok ? '已取消連署' : '操作失敗，已回復', severity: ok ? 'success' : 'error' });
              }
            }}
          />
        ) : (
          <FavoriteBorderIcon
            sx={{ fontSize: 18, color: 'text.primary', cursor: loading ? 'not-allowed' : 'pointer' }}
            onClick={async (e) => {
              e.stopPropagation();
              if (!loading) {
                const ok = await store.togglePetition(productId);
                setSnack({ open: true, message: ok ? '連署成功' : '操作失敗，已回復', severity: ok ? 'success' : 'error' });
              }
            }}
          />
        )}
        <Typography variant="body2" color="text.secondary">
          {count} 人許願
        </Typography>
      </Box>
      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
