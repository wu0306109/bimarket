'use client';

import { Favorite, ViewList } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { m } from 'framer-motion';
import Link from 'next/link';
import { pink } from '@mui/material/colors';

export default function CoreEntryCards() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="stretch"
        sx={{
          '& .core-card': {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: { xs: 240, sm: 260 },
          },
          '& .nowrap': { whiteSpace: 'nowrap' },
        }}
      >
        <Grid item xs={12} sm={10} md={6} lg={5}>
          <Card
            component={m.div}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            elevation={4}
            sx={{
              height: '100%',
              borderRadius: 3,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.6) 100%)',
              backdropFilter: 'blur(10px)',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              '&:hover': { boxShadow: 12 },
            }}
            className="core-card"
          >
            <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box textAlign="center" mb={2} sx={{ overflow: 'hidden' }}>
                <Favorite sx={{ fontSize: 56, color: pink[400], mb: 1 }} />
                <Typography variant="h5" gutterBottom>
                  許願商品
                </Typography>
                <Typography variant="body1" color="textSecondary" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  找不到想要的商品嗎？填寫許願申請，我們會幫您尋找並上架！
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/wish-product"
                size="large"
                fullWidth
                sx={{
                  mt: 1,
                  minHeight: 44,
                  color: 'common.white',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)',
                  boxShadow: '0 6px 14px rgba(244,63,94,0.35)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #e11d48 0%, #db2777 50%, #9333ea 100%)',
                    boxShadow: '0 10px 18px rgba(244,63,94,0.45)',
                  },
                }}
                startIcon={<Favorite />}
              >
                立即許願
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={10} md={6} lg={5}>
          <Card
            component={m.div}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            elevation={4}
            sx={{
              height: '100%',
              borderRadius: 3,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.6) 100%)',
              backdropFilter: 'blur(10px)',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              '&:hover': { boxShadow: 12 },
            }}
            className="core-card"
          >
            <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box textAlign="center" mb={2} sx={{ overflow: 'hidden' }}>
                <ViewList sx={{ fontSize: 56, color: 'info.main', mb: 1 }} />
                <Typography variant="h5" gutterBottom>
                  許願商品清單
                </Typography>
                <Typography variant="body1" color="textSecondary" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  查看其他買家的許願商品，了解市場需求趨勢，找到共同興趣！
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/wish-products"
                size="large"
                fullWidth
                variant="contained"
                color="info"
                sx={{
                  mt: 1,
                  minHeight: 44,
                  boxShadow: '0 6px 14px rgba(59,130,246,0.35)',
                  '&:hover': {
                    boxShadow: '0 10px 18px rgba(59,130,246,0.45)',
                  },
                }}
                startIcon={<ViewList />}
              >
                瀏覽清單
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}


