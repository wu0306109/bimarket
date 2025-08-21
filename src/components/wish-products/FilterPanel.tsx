'use client';

import { WishProductFilter } from '@/lib/wish-products/types';
import { useWishProductStore } from '@/stores/wish-product.store';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { m } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FilterPanelProps {
  onFilterChange: (filters: WishProductFilter) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const { categories, loadCategories } = useWishProductStore();
  const [filters, setFilters] = useState<WishProductFilter>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // 載入類別資料
  useEffect(() => {
    if (categories.length === 0) {
      loadCategories();
    }
  }, [categories.length, loadCategories]);

  // 當篩選條件改變時通知父元件
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category || undefined,
    }));
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFilters((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as WishProductFilter['sortBy'],
    }));
  };

  const handleOrderChange = (sortOrder: string) => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: sortOrder as WishProductFilter['sortOrder'],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <m.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">篩選條件</Typography>
        </Box>
      </m.div>

      <Grid container spacing={2}>
        {/* 類別篩選 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TextField
              select
              fullWidth
              label="商品類別"
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">全部類別</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </m.div>
        </Grid>

        {/* 最低價格 */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TextField
              fullWidth
              type="number"
              label="最低價格"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">NT$</InputAdornment>
                ),
              }}
            />
          </m.div>
        </Grid>

        {/* 最高價格 */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TextField
              fullWidth
              type="number"
              label="最高價格"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">NT$</InputAdornment>
                ),
              }}
            />
          </m.div>
        </Grid>

        {/* 排序方式 */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TextField
              select
              fullWidth
              label="排序方式"
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => handleSortChange(e.target.value)}
              size="small"
            >
              <MenuItem value="createdAt">最新發布</MenuItem>
              <MenuItem value="wishCount">許願人數</MenuItem>
              <MenuItem value="expectedPrice">期望價格</MenuItem>
            </TextField>
          </m.div>
        </Grid>

        {/* 排序順序 */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TextField
              select
              fullWidth
              label="排序順序"
              value={filters.sortOrder || 'desc'}
              onChange={(e) => handleOrderChange(e.target.value)}
              size="small"
            >
              <MenuItem value="desc">由高到低</MenuItem>
              <MenuItem value="asc">由低到高</MenuItem>
            </TextField>
          </m.div>
        </Grid>

        {/* 清除篩選按鈕 */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
              size="medium"
              sx={{
                height: '40px',
                fontSize: { xs: '0.875rem', md: '0.75rem' },
                '.MuiButton-startIcon': {
                  marginRight: { xs: 1, md: 0.5 },
                },
              }}
            >
              清除
            </Button>
          </m.div>
        </Grid>
      </Grid>
    </Paper>
  );
}
