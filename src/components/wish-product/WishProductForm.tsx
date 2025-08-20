'use client';

import { useWishProductStore } from '@/stores/wish-product.store';
import { WishProductFormData, wishProductSchema } from '@/types/wish-product';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import CategorySelect from './CategorySelect';
import ImageUpload from './ImageUpload';

export default function WishProductForm() {
  const {
    isSubmitting,
    submitError,
    submitSuccess,
    submitForm,
    resetForm,
    clearError,
  } = useWishProductStore();

  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<WishProductFormData>({
    resolver: zodResolver(wishProductSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: 0,
      region: '',
      additionalInfo: '',
      images: [],
    },
  });

  const watchedImages = watch('images');

  const onSubmit = async (data: WishProductFormData) => {
    try {
      await submitForm(data);
      setShowSuccess(true);
      reset(); // 重置表單
    } catch (error) {
      // 錯誤已在 store 中處理
    }
  };

  const handleImagesChange = (files: File[]) => {
    setValue('images', files, { shouldValidate: true });
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  React.useEffect(() => {
    if (submitSuccess) {
      setShowSuccess(true);
    }
  }, [submitSuccess]);

  return (
    <Box maxWidth="md" mx="auto">
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          {/* 錯誤訊息 */}
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
              {submitError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* 基本資訊區塊 */}
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    mb: 3,
                    color: 'primary.main',
                    fontWeight: 600,
                    borderBottom: 2,
                    borderColor: 'primary.main',
                    pb: 1,
                  }}
                >
                  基本資訊
                </Typography>

                <Grid container spacing={3}>
                  {/* 商品名稱 */}
                  <Grid item xs={12}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="商品名稱"
                          placeholder="請輸入您想要的商品名稱"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* 商品類別和地區 */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CategorySelect
                          value={value || ''}
                          onChange={onChange}
                          error={errors.categoryId?.message}
                          required
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="region"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="商品所在地區"
                          placeholder="例如：日本、韓國、美國等"
                          error={!!errors.region}
                          helperText={errors.region?.message}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* 詳細描述區塊 */}
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    mb: 3,
                    color: 'primary.main',
                    fontWeight: 600,
                    borderBottom: 2,
                    borderColor: 'primary.main',
                    pb: 1,
                  }}
                >
                  詳細描述
                </Typography>

                <Grid container spacing={3}>
                  {/* 商品描述 */}
                  <Grid item xs={12}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={5}
                          label="商品描述"
                          placeholder="請詳細描述您想要的商品，包括：&#10;• 品牌和型號&#10;• 規格和功能&#10;• 顏色和尺寸&#10;• 其他特殊要求"
                          error={!!errors.description}
                          helperText={
                            errors.description?.message ||
                            `${field.value?.length || 0}/2000 字元`
                          }
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                            '& .MuiInputBase-input': {
                              lineHeight: 1.6,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* 補充資訊 */}
                  <Grid item xs={12}>
                    <Controller
                      name="additionalInfo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          label="其他補充資訊（選填）"
                          placeholder="例如：預算範圍、使用需求、交貨時間、特殊要求等"
                          error={!!errors.additionalInfo}
                          helperText={
                            errors.additionalInfo?.message ||
                            `${field.value?.length || 0}/1000 字元`
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* 圖片上傳區塊 */}
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    mb: 3,
                    color: 'primary.main',
                    fontWeight: 600,
                    borderBottom: 2,
                    borderColor: 'primary.main',
                    pb: 1,
                  }}
                >
                  商品圖片{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    （選填）
                  </Typography>
                </Typography>

                <Controller
                  name="images"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <ImageUpload onChange={handleImagesChange} maxFiles={5} />
                  )}
                />
                {errors.images && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.images.message}
                  </Alert>
                )}
              </Box>

              {/* 提交按鈕區塊 */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  pt: 2,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SendIcon />}
                  disabled={isSubmitting}
                  sx={{
                    minWidth: 240,
                    height: 56,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 4,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  {isSubmitting ? '提交中...' : '提交許願申請'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* 成功提示 */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          icon={<CheckCircleIcon />}
        >
          許願商品申請已成功提交！我們會盡快為您處理。
        </Alert>
      </Snackbar>
    </Box>
  );
}
