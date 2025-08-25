'use client';

import { WishProduct } from '@/lib/wish-products/types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import { m } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

  const router = useRouter();
  const [isBuyable, setIsBuyable] = useState(false); // 新增狀態來追蹤是否已點擊代購按鈕

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

                {/* 許願人數 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FavoriteIcon sx={{ fontSize: 18, color: 'black' }} />
                  <Typography variant="body2" color="text.secondary">
                    {product.wishCount || 0} 人許願
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件向上冒泡到 CardActionArea 的 onClick
                setIsBuyable(true); // 設定為已點擊
                // router.push(`/sell-product?wishProductId=${product.id}`); // 移除跳轉頁面
                router.refresh(); // 重新整理當前頁面
              }}
              disabled={isBuyable} // 根據狀態禁用按鈕
            >
              {isBuyable ? '已開放代購' : '我可以代購'} {/* 根據狀態顯示不同文字 */}
            </Button>
          </CardContent>
        </CardActionArea>
      </Card>
    </m.div>
  );
}
