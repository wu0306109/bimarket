import {
  AdminPanelSettings,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '管理後台 | BiMarket',
  description: '管理員專用後台管理系統',
  keywords: ['管理後台', '管理員', 'BiMarket'],
};

export default function AdminPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <AdminPanelSettings
          sx={{ fontSize: 80, color: 'primary.main', mb: 2 }}
        />
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          管理後台
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          BiMarket 管理員專用系統
        </Typography>
        <Typography variant="body1" color="textSecondary">
          管理和監控平台上的各項業務功能
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center">
        <Card
          elevation={3}
          sx={{
            maxWidth: 500,
            width: '100%',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 6 }}>
            <InventoryIcon
              sx={{ fontSize: 80, color: 'primary.main', mb: 3 }}
            />
            <Typography variant="h4" gutterBottom>
              許願商品管理
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              paragraph
              sx={{ mb: 4 }}
            >
              查看和處理用戶的許願商品申請，管理商品狀態和資訊
            </Typography>
            <Button
              component={Link}
              href="/admin/wish-products"
              variant="contained"
              size="large"
              startIcon={<InventoryIcon />}
              sx={{
                minWidth: 200,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              進入管理
            </Button>

            <Box mt={4} pt={3} borderTop="1px solid" borderColor="divider">
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                快速操作
              </Typography>
              <Box
                display="flex"
                gap={2}
                justifyContent="center"
                flexWrap="wrap"
              >
                <Button
                  component={Link}
                  href="/"
                  variant="outlined"
                  size="small"
                >
                  返回首頁
                </Button>
                <Button
                  component={Link}
                  href="/wish-product"
                  variant="outlined"
                  size="small"
                >
                  測試許願功能
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          BiMarket 管理後台 - 高效管理，輕鬆營運
        </Typography>
      </Box>
    </Container>
  );
}
