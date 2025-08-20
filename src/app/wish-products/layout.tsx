import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '許願商品清單 | Bimarket',
  description: '查看所有買家的許願商品，了解市場需求趨勢',
};

export default function WishProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}