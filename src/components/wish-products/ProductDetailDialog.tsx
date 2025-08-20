'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
  IconButton,
} from '@mui/material';
import { WishProduct } from '@/lib/wish-products/types';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface ProductDetailDialogProps {
  open: boolean;
  onClose: () => void;
  product: WishProduct | null;
}

export function ProductDetailDialog({ open, onClose, product }: ProductDetailDialogProps) {
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            商品詳細資訊
          </Typography>
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
        {/* 商品名稱 */}
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {product.productName}
        </Typography>

        {/* 類別標籤 */}
        <Box sx={{ mb: 3 }}>
          <Chip 
            icon={<CategoryIcon />}
            label={product.category} 
            color="primary" 
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip 
            icon={<FavoriteIcon />}
            label={`${product.wishCount} 人許願`}
            color="error" 
            variant="filled"
          />
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
          <Typography variant="h4" color="primary" fontWeight="bold">
            NT$ {product.expectedPrice.toLocaleString()}
          </Typography>
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
              <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
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
        <Button 
          variant="contained" 
          startIcon={<FavoriteIcon />}
          disabled
          onClick={() => {
            // 未來可以實作加入許願功能
            onClose();
          }}
        >
          我也想要
        </Button>
      </DialogActions>
    </Dialog>
  );
}