'use client';

import { Favorite, ShoppingCart } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import PublicWishProductList from '@/components/public/PublicWishProductList';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          歡迎來到 BiMarket
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          您的專業代購平台
        </Typography>
        <Typography variant="body1" color="textSecondary">
          提供便捷的商品許願功能，讓您輕鬆找到想要的商品
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center">
        <Card elevation={3} sx={{ maxWidth: 400, width: '100%' }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Favorite sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              許願商品
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              找不到想要的商品嗎？填寫許願申請，我們會幫您尋找並上架！
            </Typography>
            <Button
              component={Link}
              href="/wish-product"
              variant="contained"
              size="large"
              startIcon={<Favorite />}
            >
              立即許願
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Box mt={6} textAlign="center">
        <Typography variant="h4" component="h2" gutterBottom>
          所有許願清單
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          以下是目前所有的許願商品，您可以瀏覽並查看詳情。
        </Typography>
        <PublicWishProductList />
      </Box>

      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          BiMarket - 讓購物變得更簡單
        </Typography>
      </Box>
    </Container>
  );
}
