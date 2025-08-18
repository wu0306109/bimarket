'use client';

import { useWishProductStore } from '@/stores/wish-product.store';
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

export default function ImageUpload({
  onChange,
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}: ImageUploadProps) {
  const { uploadedImages, uploadingImages, uploadImage, removeImage } =
    useWishProductStore();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return '只支援 JPG, PNG, WebP 格式的圖片';
    }

    if (file.size > maxFileSize) {
      return '檔案大小不可超過 5MB';
    }

    return null;
  };

  const handleFileUpload = useCallback(
    async (files: FileList | File[]) => {
      setError(null);

      const fileArray = Array.from(files);

      // 檢查檔案數量限制
      if (uploadedImages.length + fileArray.length > maxFiles) {
        setError(`最多只能上傳 ${maxFiles} 張圖片`);
        return;
      }

      const validFiles: File[] = [];

      // 驗證每個檔案
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
        validFiles.push(file);
      }

      // 上傳檔案
      try {
        for (const file of validFiles) {
          await uploadImage(file);
        }

        // 更新父元件
        const allFiles = uploadedImages
          .map((img) => img.file)
          .concat(validFiles);
        onChange(allFiles);
      } catch (error) {
        setError(error instanceof Error ? error.message : '上傳失敗');
      }
    },
    [uploadedImages, uploadImage, onChange, maxFiles],
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    // 清空 input 值，允許重複選擇相同檔案
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = (id: string) => {
    removeImage(id);

    // 更新父元件
    const remainingFiles = uploadedImages
      .filter((img) => img.id !== id)
      .map((img) => img.file);
    onChange(remainingFiles);
  };

  return (
    <Box>
      {/* 錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 上傳區域 */}
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          border: 2,
          borderStyle: 'dashed',
          borderColor: dragOver ? 'primary.main' : 'grey.300',
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          backgroundColor: dragOver ? 'primary.light' : 'grey.50',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.light',
            transform: 'translateY(-2px)',
            boxShadow: 2,
          },
        }}
      >
        {uploadingImages ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography color="textSecondary">正在上傳圖片...</Typography>
          </Box>
        ) : (
          <>
            <CloudUpload
              sx={{
                fontSize: 64,
                color: 'primary.main',
                mb: 2,
                opacity: 0.8,
              }}
            />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              拖曳圖片到此處或點擊上傳
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              支援 JPG, PNG, WebP 格式，單檔最大 5MB
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                已上傳: {uploadedImages.length}/{maxFiles}
              </Typography>
            </Box>

            <Button
              variant="contained"
              component="label"
              startIcon={<ImageIcon />}
              disabled={uploadedImages.length >= maxFiles}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                boxShadow: 1,
                '&:hover': {
                  boxShadow: 2,
                },
              }}
            >
              選擇圖片
              <input
                type="file"
                hidden
                multiple
                accept={acceptedTypes.join(',')}
                onChange={handleFileSelect}
              />
            </Button>
          </>
        )}
      </Box>

      {/* 已上傳的圖片預覽 */}
      {uploadedImages.length > 0 && (
        <Box mt={4}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
            }}
          >
            已上傳的圖片 ({uploadedImages.length})
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {uploadedImages.map((image) => (
              <Card
                key={image.id}
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 2,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height={120}
                  image={URL.createObjectURL(image.file)}
                  alt="已上傳圖片"
                  sx={{ objectFit: 'cover' }}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderRadius: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(image.id)}
                    sx={{
                      color: 'white',
                      p: 0.5,
                      '&:hover': {
                        backgroundColor: 'error.main',
                      },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>

                <Box p={1.5} sx={{ bgcolor: 'background.paper' }}>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                    }}
                  >
                    {image.file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(image.file.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
