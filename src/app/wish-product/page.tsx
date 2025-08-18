import WishProductForm from '@/components/wish-product/WishProductForm';
import {
  ArrowBack as ArrowBackIcon,
  FavoriteBorder as FavoriteIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '許願商品申請 | BiMarket',
  description: '填寫您希望代購的商品資訊，我們會盡快為您尋找並上架',
  keywords: ['許願商品', '代購申請', '商品許願', 'BiMarket'],
};

export default function WishProductPage() {
  return (
    <>
      {/* 頁面標題欄 */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{ bgcolor: 'primary.main', zIndex: 1100 }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            component={Link}
            href="/"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <FavoriteIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            許願商品申請
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 主要內容區域 */}
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          bgcolor: 'grey.50',
          pt: 12, // 為固定的 AppBar 留出空間 (64px AppBar + 32px padding)
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* 頁面介紹 */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              告訴我們您想要什麼
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              填寫詳細的商品資訊，我們的專業團隊會為您尋找並代購您心儀的商品
            </Typography>
          </Box>

          {/* 表單區域 */}
          <WishProductForm />
        </Container>
      </Box>
    </>
  );
}
