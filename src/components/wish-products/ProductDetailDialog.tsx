'use client';

import { WishProduct } from '@/lib/wish-products/types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
// Favorite icons imported below to avoid duplicate symbol imports
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
} from '@mui/material';
import { m } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { usePetitionStore } from '@/stores/petition.store';
import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ProductDetailDialogProps {
  open: boolean;
  onClose: () => void;
  product: WishProduct | null;
}

export function ProductDetailDialog({
  open,
  onClose,
  product,
}: ProductDetailDialogProps) {
  if (!product) return null;

  const storeForDialog = usePetitionStore();
  useEffect(() => {
    storeForDialog.ensure(product.id, product.wishCount || 0);
  }, [product.id]);
  const dialogPetitionState = usePetitionStore((s) => s.byProductId[product.id]);
  const currentWishCount = dialogPetitionState?.wishCount ?? (product.wishCount || 0);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 處理圖片 URLs
  const getImageUrls = (imageUrls: string | string[] | undefined) => {
    if (!imageUrls) return [];
    const urls =
      typeof imageUrls === 'string' ? imageUrls.split(',') : imageUrls;
    return urls
      .filter((url) => url && url.trim() !== '')
      .map((url) => {
        const trimmedUrl = url.trim();
        if (!trimmedUrl.startsWith('http') && !trimmedUrl.startsWith('/')) {
          return `/api/serve-file/uploads/wish-products/${trimmedUrl}`;
        }
        return trimmedUrl;
      });
  };

  const imageUrls = getImageUrls(product.imageUrls || product.image_urls);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <m.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="h6" component="div">
              商品詳細資訊
            </Typography>
          </m.div>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* 圖片區域 */}
        {imageUrls.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {imageUrls.length === 1 ? (
              <Box
                component="img"
                src={imageUrls[0]}
                alt={product.productName}
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                  borderRadius: 2,
                  backgroundColor: 'grey.100',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <ImageList cols={2} gap={8}>
                {imageUrls.map((url, index) => (
                  <ImageListItem key={index}>
                    <m.img
                      src={url}
                      alt={`${product.productName} ${index + 1}`}
                      loading="lazy"
                      style={{
                        borderRadius: 8,
                        objectFit: 'cover',
                        backgroundColor: '#f5f5f5',
                        width: '100%',
                        height: '100%',
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>
        )}

        {/* 商品名稱 */}
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {product.productName}
        </Typography>

        {/* 類別標籤 */}
        <Box sx={{ mb: 3 }}>
          <m.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <Chip
              icon={<CategoryIcon />}
              label={product.category}
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Chip
              icon={<FavoriteIcon />}
              label={`${currentWishCount} 人許願`}
              color="error"
              variant="filled"
            />
          </m.div>
        </Box>

        {/* 商品描述 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            商品描述
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {product.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 期望價格 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="subtitle2" color="text.secondary">
              期望價格
            </Typography>
          </Box>
          <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Typography variant="h4" color="primary" fontWeight="bold">
              NT$ {product.expectedPrice?.toLocaleString() || '0'}
            </Typography>
          </m.div>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 其他資訊 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 發布者 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
              <PersonIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">
                發布者
              </Typography>
              <Typography variant="body2">
                {product.userName || '匿名買家'}
              </Typography>
            </Box>
          </Box>

          {/* 發布時間 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                發布時間
              </Typography>
              <Typography variant="body2">
                {formatDate(product.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* 最後更新 */}
          {product.updatedAt && product.updatedAt !== product.createdAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon
                sx={{ color: 'text.secondary', fontSize: 20 }}
              />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  最後更新
                </Typography>
                <Typography variant="body2">
                  {formatDate(product.updatedAt)}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* 商品 ID */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            商品編號：{product.id}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          關閉
        </Button>
        {product && <DetailPetitionButton productId={product.id} initialCount={product.wishCount || 0} />}
      </DialogActions>
    </Dialog>
  );
}

function DetailPetitionButton({ productId, initialCount }: { productId: string; initialCount: number }) {
  const store = usePetitionStore();
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' },
  );

  useEffect(() => {
    store.ensure(productId, initialCount);
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
  const loading = state?.loading || false;
  const count = state?.wishCount ?? initialCount;

  return (
    <>
      <m.div whileTap={{ scale: loading ? 1 : 0.98 }}>
        <Button
          variant={petitioned ? 'outlined' : 'contained'}
          color="secondary"
          startIcon={petitioned ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          disabled={loading}
          onClick={async () => {
            const ok = await store.togglePetition(productId);
            setSnack({
              open: true,
              message: ok ? (petitioned ? '已取消許願' : '許願成功') : '操作失敗，已回復',
              severity: ok ? 'success' : 'error',
            });
          }}
        >
          {petitioned ? '取消許願' : '我要許願'}
        </Button>
      </m.div>
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
