import { NextRequest, NextResponse } from 'next/server';
import { getMockWishProducts } from '@/lib/wish-products/mockData';
import { WishProductFilter, PaginationParams } from '@/lib/wish-products/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 解析查詢參數
    const category = searchParams.get('category') || undefined;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') as WishProductFilter['sortBy'];
    const sortOrder = searchParams.get('sortOrder') as WishProductFilter['sortOrder'];
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    // 建立篩選條件
    const filters: WishProductFilter = {
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    };

    // 建立分頁參數
    const pagination: PaginationParams = {
      page,
      pageSize,
    };

    // 取得模擬資料
    const result = getMockWishProducts(filters, pagination);
    
    // 將 Date 物件轉換為 ISO 字串
    const serializedResult = {
      ...result,
      data: result.data.map(product => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      })),
    };

    return NextResponse.json(serializedResult, { status: 200 });
  } catch (error) {
    console.error('Error fetching wish products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wish products' },
      { status: 500 }
    );
  }
}