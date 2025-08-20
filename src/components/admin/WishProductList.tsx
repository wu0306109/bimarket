'use client';

import {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
  ProductCategory,
  WishProduct,
} from '@/types/wish-product';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: PaginationQuery) => void;
  categories: ProductCategory[];
}

function FilterDialog({
  open,
  onClose,
  onApply,
  categories,
}: FilterDialogProps) {
  const [filters, setFilters] = useState<PaginationQuery>({
    category: undefined,
    status: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      category: undefined,
      status: '',
      startDate: '',
      endDate: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>篩選條件</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                '& .MuiSelect-select': {
                  minWidth: 180,
                },
              }}
            >
              <InputLabel>商品類別</InputLabel>
              <Select
                value={filters.category || ''}
                label="商品類別"
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              >
                <MenuItem value="">全部類別</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                '& .MuiSelect-select': {
                  minWidth: 180,
                },
              }}
            >
              <InputLabel>處理狀態</InputLabel>
              <Select
                value={filters.status || ''}
                label="處理狀態"
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <MenuItem value="">全部狀態</MenuItem>
                <MenuItem value="pending">待處理</MenuItem>
                <MenuItem value="processing">處理中</MenuItem>
                <MenuItem value="completed">已完成</MenuItem>
                <MenuItem value="cancelled">已取消</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="開始日期"
              type="date"
              value={filters.startDate || ''}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="結束日期"
              type="date"
              value={filters.endDate || ''}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                '& .MuiSelect-select': {
                  minWidth: 180,
                },
              }}
            >
              <InputLabel>排序欄位</InputLabel>
              <Select
                value={filters.sortBy || 'createdAt'}
                label="排序欄位"
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as any })
                }
              >
                <MenuItem value="createdAt">建立時間</MenuItem>
                <MenuItem value="updatedAt">更新時間</MenuItem>
                <MenuItem value="name">商品名稱</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                '& .MuiSelect-select': {
                  minWidth: 180,
                },
              }}
            >
              <InputLabel>排序方式</InputLabel>
              <Select
                value={filters.sortOrder || 'desc'}
                label="排序方式"
                onChange={(e) =>
                  setFilters({ ...filters, sortOrder: e.target.value as any })
                }
              >
                <MenuItem value="desc">降序</MenuItem>
                <MenuItem value="asc">升序</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>重置</Button>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleApply} variant="contained">
          套用
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface ProductDetailDialogProps {
  open: boolean;
  onClose: () => void;
  product: WishProduct | null;
  categories: ProductCategory[];
}

function ProductDetailDialog({
  open,
  onClose,
  product,
  categories,
}: ProductDetailDialogProps) {
  if (!product) return null;

  const category = categories.find(
    (c) =>
      c.id === product.categoryId ||
      c.id === Number(product.categoryId) ||
      String(c.id) === String(product.categoryId),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待處理';
      case 'processing':
        return '處理中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>許願商品詳情</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="textSecondary">
              商品ID
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {product.id}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="textSecondary">
              狀態
            </Typography>
            <Chip
              label={getStatusText(product.status)}
              color={getStatusColor(product.status) as any}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" color="textSecondary">
              商品名稱
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {product.name}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="textSecondary">
              商品類別
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {category?.name || '未知類別'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="textSecondary">
              所在領域
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {product.region}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" color="textSecondary">
              商品描述
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              {product.description}
            </Typography>
          </Grid>

          {product.additionalInfo && (
            <Grid size={12}>
              <Typography variant="subtitle2" color="textSecondary">
                補充資訊
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 2, whiteSpace: 'pre-wrap' }}
              >
                {product.additionalInfo}
              </Typography>
            </Grid>
          )}

          {product.imageUrls && product.imageUrls.length > 0 && (
            <Grid size={12}>
              <Typography variant="subtitle2" color="textSecondary">
                商品圖片
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                {product.imageUrls.map((url, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={`/api/serve-file/uploads/wish-products/${url}`}
                    alt={`商品圖片 ${index + 1}`}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid #ddd',
                    }}
                  />
                ))}
              </Box>
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="textSecondary">
              建立時間
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {new Date(product.createdAt).toLocaleString('zh-TW')}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="textSecondary">
              更新時間
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {new Date(product.updatedAt).toLocaleString('zh-TW')}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>關閉</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function WishProductList() {
  const [products, setProducts] = useState<WishProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<PaginationQuery>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<WishProduct | null>(
    null,
  );

  const loadProducts = async (queryFilters: PaginationQuery = filters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(queryFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/wish-products?${params}`);
      const result: ApiResponse<PaginatedResponse<WishProduct>> =
        await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || '載入失敗');
      }

      setProducts(result.data?.items || []);
      setPagination(
        result.data?.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : '載入商品清單失敗');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const result: ApiResponse<ProductCategory[]> = await response.json();

      if (result.success) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error('載入類別失敗:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const handleFilterApply = (newFilters: PaginationQuery) => {
    const updatedFilters = { ...newFilters, page: 1, limit: filters.limit };
    setFilters(updatedFilters);
    loadProducts(updatedFilters);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    loadProducts(updatedFilters);
  };

  const handleViewDetail = (product: WishProduct) => {
    setSelectedProduct(product);
    setDetailDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待處理';
      case 'processing':
        return '處理中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(
      (c) =>
        c.id === categoryId ||
        c.id === Number(categoryId) ||
        String(c.id) === String(categoryId),
    );
    return category?.name || '未知類別';
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" component="h1">
              許願商品管理
            </Typography>

            <Box display="flex" gap={1}>
              <Button
                startIcon={<FilterIcon />}
                onClick={() => setFilterDialogOpen(true)}
              >
                篩選
              </Button>
              <Button
                startIcon={<RefreshIcon />}
                onClick={() => loadProducts()}
              >
                重新整理
              </Button>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => {
                  /* TODO: 實作匯出功能 */
                }}
              >
                匯出
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>商品名稱</TableCell>
                      <TableCell>類別</TableCell>
                      <TableCell>所在領域</TableCell>
                      <TableCell>狀態</TableCell>
                      <TableCell>建立時間</TableCell>
                      <TableCell align="center">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {product.id.substring(0, 8)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {getCategoryName(product.categoryId)}
                        </TableCell>
                        <TableCell>{product.region}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(product.status)}
                            color={getStatusColor(product.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(product.createdAt).toLocaleDateString(
                            'zh-TW',
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetail(product)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {pagination.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 篩選對話框 */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onApply={handleFilterApply}
        categories={categories}
      />

      {/* 詳情對話框 */}
      <ProductDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        product={selectedProduct}
        categories={categories}
      />
    </Box>
  );
}
