'use client';

import { Favorite, ViewList } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { grey, pink } from '@mui/material/colors';
import { m } from 'framer-motion';
import Link from 'next/link';

export default function HomeHero() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box
        sx={{
          bgcolor: grey[100],
          py: { xs: 6, md: 10 },
          mb: { xs: 4, md: 8 },
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              color="text.primary"
              sx={{ lineHeight: 1.2 }}
            >
              歡迎來到 BiMarket
            </Typography>
          </m.div>
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            <Typography variant="h5" color="textSecondary" gutterBottom>
              您的專業代購平台
            </Typography>
          </m.div>
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          >
            <Typography variant="h6" color="textSecondary">
              提供便捷的商品許願功能，讓您輕鬆找到想要的商品
            </Typography>
          </m.div>
        </Box>
      </Box>

      <Box sx={{ my: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            color="text.primary"
          >
            我們的服務
          </Typography>
        </m.div>
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
        >
          <Typography
            variant="body1"
            color="textSecondary"
            maxWidth="700px"
            mx="auto"
            lineHeight={1.8}
          >
            BiMarket
            是一個創新的雙向代購平台，串聯買家與賣家。買家可以許願稀有商品，或直接購買上架商品；賣家則可販售現有商品，或將買家許願商品化。我們致力於提供便捷、透明、高效的購物與銷售體驗，讓您的願望觸手可及，商機無限！
          </Typography>
        </m.div>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
          <m.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Card elevation={4} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Favorite sx={{ fontSize: 60, color: pink[400], mb: 2 }} />
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
                  startIcon={<Favorite sx={{ color: 'white' }} />}
                  fullWidth
                >
                  立即許願
                </Button>
              </CardContent>
            </Card>
          </m.div>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
          <m.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Card elevation={4} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <ViewList
                  sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  許願商品清單
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  查看其他買家的許願商品，了解市場需求趨勢，找到共同興趣！
                </Typography>
                <Button
                  component={Link}
                  href="/wish-products"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<ViewList sx={{ color: 'white' }} />}
                  fullWidth
                >
                  瀏覽清單
                </Button>
              </CardContent>
            </Card>
          </m.div>
        </Grid>
      </Grid>

      <Box mt={{ xs: 6, md: 10 }} textAlign="center">
        <Typography variant="h5" component="h2" gutterBottom>
          聯絡我們
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" mb={1}>
          <IconButton
            component="a"
            href="mailto:user123@gmail.com"
            aria-label="Email"
          >
            <MailOutlineIcon fontSize="large" />
          </IconButton>
        </Stack>
        <Typography variant="body1" color="textSecondary" mb={3}>
          聯絡電話: 0912123123
        </Typography>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} BiMarket. All rights reserved.
          </Typography>
        </m.div>
      </Box>
    </Container>
  );
}
