'use client';

import { Box, Card, CardContent, Container, Stack, Chip, Typography } from '@mui/material';
import { FavoriteBorder, Public, Insights, Language } from '@mui/icons-material';
import { m } from 'framer-motion';

export default function AboutSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background:
          'radial-gradient(1200px 400px at 0% -20%, rgba(59,130,246,0.06), transparent 60%), radial-gradient(1200px 400px at 100% 120%, rgba(236,72,153,0.06), transparent 60%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center" textAlign="center" mb={{ xs: 3, md: 5 }}>
          <m.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              BiMarket – 全球雙向代購平台
            </Typography>
          </m.div>
          <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 900 }}>
            我們提供安全、便捷且完整的服務，從商品需求、代購、付款到物流配送，讓跨境購物更簡單、更安心。
          </Typography>
          <Chip label="跨境 · 安心 · 高效率" color="primary" variant="outlined" />
        </Stack>

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}> {/* 替換 Grid container */}
          <Box flex={{ xs: '1 1 100%', md: '1 1 50%' }}> {/* 替換 Grid item */}
            <m.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
              <Card elevation={6} sx={{ height: '100%', borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.65) 100%)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}> {/* 新增 flex 樣式 */}
                  <Typography variant="h6" gutterBottom>
                    關於我們
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}> {/* 用 Box 包裹內容並設定 flexGrow */}
                    <Typography variant="body1" color="textSecondary" paragraph>
                      在全球化的時代，跨國購物仍常遇到語言隔閡、價格不透明、物流繁瑣等困擾。BiMarket 致力於打造「雙向代購媒合平台」，讓買家與賣家能直接互動，滿足跨境購物的多元需求。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 1.5 }}>
                      我們的使命
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, m: 0 }}>
                      <Box component="li">
                        <Typography variant="body1" color="textSecondary">
                          建立跨國雙向代購平台，滿足消費者多元需求，協助賣家解決存貨問題。
                        </Typography>
                      </Box>
                      <Box component="li">
                        <Typography variant="body1" color="textSecondary">
                          提供透明、公平且便捷的交易環境，提升跨境購物體驗。
                        </Typography>
                      </Box>
                      <Box component="li">
                        <Typography variant="body1" color="textSecondary">
                          促進全球貿易流通，讓購物成為無國界的生活方式。
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </m.div>
          </Box>

          <Box flex={{ xs: '1 1 100%', md: '1 1 50%' }}> {/* 替換 Grid item */}
            <m.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card elevation={6} sx={{ height: '100%', borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.65) 100%)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}> {/* 新增 flex 樣式 */}
                  <Typography variant="h6" gutterBottom>
                    我們的特色
                  </Typography>
                  <Stack spacing={1.5} sx={{ flexGrow: 1 }}> {/* 確保 Stack 設定 flexGrow */}
                    <Box display="flex" gap={1.5} alignItems="flex-start">
                      <FavoriteBorder color="error" />
                      <Box>
                        <Typography variant="subtitle1">願望清單 & 許願池</Typography>
                        <Typography variant="body2" color="textSecondary">
                          買家發佈需求，賣家依需求代購競標，形成即時互動。
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" gap={1.5} alignItems="flex-start">
                      <Public color="info" />
                      <Box>
                        <Typography variant="subtitle1">跨境無障礙購物</Typography>
                        <Typography variant="body2" color="textSecondary">
                          解決語言、價格與運送困擾，提供全流程支援。
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" gap={1.5} alignItems="flex-start">
                      <Insights sx={{ color: 'info.main' }} />
                      <Box>
                        <Typography variant="subtitle1">數據驅動推薦</Typography>
                        <Typography variant="body2" color="textSecondary">
                          整合熱門商品與市場趨勢，協助掌握商機。
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" gap={1.5} alignItems="flex-start">
                      <Language color="success" />
                      <Box>
                        <Typography variant="subtitle1">全球經濟連結</Typography>
                        <Typography variant="body2" color="textSecondary">
                          促進國際商貿交流，打造購物無國界的新體驗。
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </m.div>
          </Box>
        </Box>

        <Box mt={{ xs: 4, md: 6 }} textAlign="center">
          <m.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Typography
              variant="h6"
              sx={{
                display: 'inline-block',
                px: 2,
                py: 1,
                borderRadius: 2,
                color: 'common.white',
                background:
                  'linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(99,102,241,1) 50%, rgba(236,72,153,1) 100%)',
                boxShadow: '0 6px 14px rgba(59,130,246,0.35)',
              }}
            >
              BiMarket – 讓世界商品，零距離。
            </Typography>
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}


