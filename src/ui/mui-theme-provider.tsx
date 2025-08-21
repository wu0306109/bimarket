'use client';

import theme from '@/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LazyMotion, domAnimation } from 'framer-motion';
import { PropsWithChildren } from 'react';

export default function MuiThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </ThemeProvider>
  );
}
