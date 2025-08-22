'use client';

import { FavoriteBorder, Insights, Public, Language } from '@mui/icons-material';
import { Box, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { m } from 'framer-motion';

export default function FeatureHighlights() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
        <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            平台核心功能與特色
          </Typography>
        </m.div>
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
          <Typography variant="body1" color="textSecondary">
            針對買家與賣家提供完備工具，讓代購流程更透明、更有效率
          </Typography>
        </m.div>
      </Box>

      <Grid
        container
        spacing={3}
        alignItems="stretch"
        justifyContent="center"
        sx={{ maxWidth: 1200, mx: 'auto' }}
      >
        <Grid item xs={12} sm={10} md={6} lg={5}>
          <m.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
            <Card elevation={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.65) 100%)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: { xs: 180, md: 200 } }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1.5} gap={1.5}>
                  <FavoriteBorder color="primary" />
                  <Typography variant="h6">願望清單 & 許願池</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  買家發佈需求，賣家依需求代購競標，形成即時互動。
                </Typography>
              </CardContent>
            </Card>
          </m.div>
        </Grid>

        <Grid item xs={12} sm={10} md={6} lg={5}>
          <m.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
            <Card elevation={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.65) 100%)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: { xs: 180, md: 200 } }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1.5} gap={1.5}>
                  <Public color="secondary" />
                  <Typography variant="h6">跨境無障礙購物</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  解決語言不通、價格不透明與國際運送的困擾，全流程支援。
                </Typography>
              </CardContent>
            </Card>
          </m.div>
        </Grid>

        <Grid item xs={12} sm={10} md={6} lg={5}>
          <m.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
            <Card elevation={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.65) 100%)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: { xs: 180, md: 200 } }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1.5} gap={1.5}>
                  <Insights sx={{ color: 'info.main' }} />
                  <Typography variant="h6">數據驅動推薦</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  依瀏覽與互動行為推薦商品，提升找貨效率與成交率。
                </Typography>
              </CardContent>
            </Card>
          </m.div>
        </Grid>

        <Grid item xs={12} sm={10} md={6} lg={5}>
          <m.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
            <Card elevation={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.65) 100%)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: { xs: 180, md: 200 } }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1.5} gap={1.5}>
                  <Language sx={{ color: 'success.main' }} />
                  <Typography variant="h6">全球經濟連結</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  促進國際商貿交流，打造購物無國界的新體驗。
                </Typography>
              </CardContent>
            </Card>
          </m.div>
        </Grid>
      </Grid>
    </Container>
  );
}


