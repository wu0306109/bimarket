'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import { Email, Telegram, WhatsApp, Facebook } from '@mui/icons-material';
import { m } from 'framer-motion';

export default function ContactSection() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'azure', width: '100%' }}>
      <Stack spacing={3} alignItems="center" textAlign="center">
          <m.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              聯絡資訊
            </Typography>
          </m.div>
          <Typography variant="body1" color="textSecondary">
            任何合作或問題，歡迎透過以下管道與我們聯繫。
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mx: 'auto' }}>
            
            <Button href="mailto:contact@bimarket.app" size="large" startIcon={<Email />} variant="contained" color="primary">
              Email
            </Button>
            <Button href="https://t.me/bimarket" target="_blank" rel="noreferrer" variant="contained" color="primary" size="large" startIcon={<Telegram />}>
              Telegram
            </Button>
            <Button href="https://wa.me/0000000000" target="_blank" rel="noreferrer" variant="contained" color="primary" size="large" startIcon={<WhatsApp />}>
              WhatsApp
            </Button>
            <Button href="https://facebook.com/bimarket" target="_blank" rel="noreferrer" variant="contained" color="primary" size="large" startIcon={<Facebook />}>
              Facebook
            </Button>
          </Stack>
        </Stack>
    </Box>
  );
}


