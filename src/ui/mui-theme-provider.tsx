'use client';

import theme from '@/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { PropsWithChildren } from 'react';

export default function MuiThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
