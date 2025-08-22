'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';

export default function SectionNav() {
  const items = [
    { id: 'hero', label: '首頁' },
    { id: 'about', label: '關於' },
    { id: 'features', label: '特色' },
    { id: 'contact', label: '聯絡資訊' },
  ];

  const [activeId, setActiveId] = useState(items[0].id);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        threshold: [0.51],
        rootMargin: '-72px 0px -40px 0px',
      }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const onJump = useCallback((id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background:
          'linear-gradient(180deg, rgba(124,58,237,0.95) 0%, rgba(99,102,241,0.95) 60%, rgba(59,130,246,0.9) 100%)',
        color: 'common.white',
        boxShadow: '0 8px 20px rgba(59,130,246,0.25)',
        backdropFilter: 'saturate(160%) blur(6px)',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 1, position: 'relative' }}>
        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 700,
            pointerEvents: 'none',
            color: 'common.white',
          }}
        >
          BiMarket
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {items.map((item) => (
            <Button
              key={item.id}
              href={`#${item.id}`}
              size="small"
              onClick={onJump(item.id)}
              variant={activeId === item.id ? 'contained' : 'text'}
              sx={{
                color: 'common.white',
                bgcolor:
                  activeId === item.id
                    ? 'rgba(255,255,255,0.15)'
                    : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
                borderRadius: 999,
                px: 1.5,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}


