'use client';

import { useWishProductStore } from '@/stores/wish-product.store';
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';

interface CategorySelectProps {
  value: number | '';
  onChange: (value: number) => void;
  error?: string;
  required?: boolean;
}

export default function CategorySelect({
  value,
  onChange,
  error,
  required = false,
}: CategorySelectProps) {
  const {
    categories,
    loadingCategories,
    categoriesError,
    loadCategories,
    clearError,
  } = useWishProductStore();

  useEffect(() => {
    if (categories.length === 0 && !loadingCategories && !categoriesError) {
      loadCategories();
    }
  }, [categories.length, loadingCategories, categoriesError, loadCategories]);

  const handleChange = (event: any) => {
    const selectedValue = event.target.value;
    if (selectedValue !== '') {
      onChange(parseInt(selectedValue));
    }
  };

  const handleRetry = () => {
    clearError();
    loadCategories();
  };

  // 載入中狀態
  if (loadingCategories) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={20} />
        <span>載入類別中...</span>
      </Box>
    );
  }

  // 錯誤狀態
  if (categoriesError) {
    return (
      <Alert
        severity="error"
        action={
          <button
            onClick={handleRetry}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            重試
          </button>
        }
      >
        {categoriesError}
      </Alert>
    );
  }

  // 沒有類別資料
  if (categories.length === 0) {
    return <Alert severity="warning">暫無可用的商品類別</Alert>;
  }

  return (
    <FormControl
      fullWidth
      error={!!error}
      required={required}
      sx={{
        minWidth: 200, // 設定最小寬度
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        '& .MuiSelect-select': {
          minWidth: 180, // 確保選擇器內部也有最小寬度
        },
      }}
    >
      <InputLabel id="category-select-label">商品類別</InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        value={value}
        label="商品類別"
        onChange={handleChange}
        placeholder="請選擇商品類別"
      >
        <MenuItem value="" disabled>
          <em style={{ color: '#999' }}>請選擇商品類別</em>
        </MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            <Box>
              <Typography variant="body1" component="span">
                {category.name}
              </Typography>
              {category.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="span"
                  sx={{ ml: 1 }}
                >
                  - {category.description}
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
