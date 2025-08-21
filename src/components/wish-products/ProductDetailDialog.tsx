'use client';

import { WishProduct } from '@/lib/wish-products/types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
              label={`${product.wishCount || 0} 人許願`}
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
        <m.div whileTap={{ scale: 0.98 }}>
          <Button
            variant="contained"
            startIcon={<FavoriteIcon />}
            disabled
            onClick={() => {
              onClose();
            }}
          >
            我也想要
          </Button>
        </m.div>
      </DialogActions>
    </Dialog>
  );
}
