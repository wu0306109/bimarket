import WishProductList from '@/components/admin/WishProductList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '許願商品管理 | BiMarket Admin',
  description: '管理所有用戶提交的許願商品申請',
};

export default function AdminWishProductsPage() {
  return (
    <main style={{ padding: '24px' }}>
      <WishProductList />
    </main>
  );
}
