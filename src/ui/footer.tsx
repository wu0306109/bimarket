'use client';

import { Box, Container, Typography } from '@mui/material';

const FOOTER_HEIGHT = 40; // px

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: `${FOOTER_HEIGHT}px`,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'grey.100',
        borderTop: '1px solid',
        borderColor: 'grey.200',
        zIndex: 40,
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          BiMarket - 讓購物變得更簡單
        </Typography>
      </Container>
    </Box>
  );
}


