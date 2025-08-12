import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Optimize package imports for better bundle size and faster builds
  optimizePackageImports: ['@mui/material', '@mui/icons-material'],
};

export default nextConfig;
