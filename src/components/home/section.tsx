'use client';

import { Box } from '@mui/material';

interface SectionProps {
  readonly id: string;
  readonly children: React.ReactNode;
}

export default function Section({ id, children }: Readonly<SectionProps>) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        scrollSnapAlign: 'start',
        minHeight: 'calc(100vh - 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scrollMarginTop: 72,
        pb: 2,
      }}
    >
      {children}
    </Box>
  );
}


