'use client';

import { Favorite, ViewList } from '@mui/icons-material';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { m } from 'framer-motion';

export default function CtaSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background:
          'radial-gradient(1200px 400px at 10% -10%, rgba(124,58,237,0.12), transparent 60%), radial-gradient(1200px 400px at 90% 110%, rgba(6,182,212,0.12), transparent 60%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} alignItems="center" textAlign="center">
          <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              準備好開始了嗎？
            </Typography>
          </m.div>
          <Typography variant="body1" color="textSecondary">
            立即許願或瀏覽清單，找到你想要的商品，或為買家帶來驚喜！
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              href="/wish-product"
              variant="contained"
              size="large"
              startIcon={<Favorite />}
            >
              立即許願
            </Button>
            <Button
              component={Link}
              href="/wish-products"
              variant="outlined"
              size="large"
              startIcon={<ViewList />}
            >
              瀏覽許願清單
            </Button>
          </Stack>
          <Typography variant="caption" color="textSecondary">
            我是賣家？前往許願清單，挑選適合商品並快速商品化。
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}


