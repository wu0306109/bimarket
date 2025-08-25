'use client';

import { Favorite, ViewList } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { grey, pink } from '@mui/material/colors';
import { m } from 'framer-motion';
import Link from 'next/link';

export default function HomeHero() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box textAlign="center" mb={6} mt={2}>
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            textAlign="center"
            color="primary.dark"
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
          <Typography variant="body1" color="textSecondary">
            提供便捷的商品許願功能，讓您輕鬆找到想要的商品
          </Typography>
        </m.div>
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={4} justifyContent="center">
        <Box flex={{ xs: '1 1 100%', sm: '1 1 50%', md: '1 1 40%' }}>
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
        </Box>

        <Box flex={{ xs: '1 1 100%', sm: '1 1 50%', md: '1 1 40%' }}>
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
        </Box>
      </Box>

      
    </Container>
  );
}
