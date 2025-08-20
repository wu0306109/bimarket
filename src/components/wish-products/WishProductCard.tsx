'use client';

import { WishProduct } from '@/lib/wish-products/types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ImageIcon from '@mui/icons-material/Image';
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

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
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
        }}
      >
        {/* 圖片區域 */}
        {imageUrl ? (
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt={product.productName}
            sx={{
              objectFit: 'cover',
              backgroundColor: 'grey.100',
            }}
            onError={(e) => {
              // 如果圖片載入失敗，隱藏圖片
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              backgroundColor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1 }}>
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
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light' }}>
                <PersonIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {product.userName || '匿名'}
              </Typography>
            </Box>

            {/* 許願人數 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FavoriteIcon sx={{ fontSize: 18, color: 'error.main' }} />
              <Typography variant="body2" color="text.secondary">
                {product.wishCount || 0} 人許願
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
