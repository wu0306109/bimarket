'use client';

import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import { WishProduct } from '@/lib/wish-products/types';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface WishProductCardProps {
  product: WishProduct;
  onClick?: (product: WishProduct) => void;
}

export function WishProductCard({ product, onClick }: WishProductCardProps) {
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
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
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
          NT$ {product.expectedPrice.toLocaleString()}
        </Typography>

        {/* 底部資訊 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              {product.wishCount} 人許願
            </Typography>
          </Box>
        </Box>
      </CardContent>
      </CardActionArea>
    </Card>
  );
}