import { NextRequest, NextResponse } from 'next/server';
import { WishProductFilter, PaginationParams } from '@/lib/wish-products/types';
import { CSVDataService } from '@/services/csv-data.service';
import { ErrorHandler } from '@/services/error-handler.service';
import { WishProduct } from '@/types/wish-product';

const csvService = new CSVDataService();

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

    // 從 CSV 讀取所有許願商品資料
    let products = await ErrorHandler.safeReadCSV<WishProduct>(
      csvService,
      'wish-products.csv',
    );

    // 套用篩選條件
    if (category) {
      products = products.filter((p) => p.categoryId.toString() === category);
    }

    if (minPrice !== null) {
      const min = parseFloat(minPrice);
      products = products.filter((p) => {
        const price = p.expectedPrice || 0;
        return price >= min;
      });
    }

    if (maxPrice !== null) {
      const max = parseFloat(maxPrice);
      products = products.filter((p) => {
        const price = p.expectedPrice || 0;
        return price <= max;
      });
    }

    // 排序
    products.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'wishCount':
          aValue = a.wishCount || 0;
          bValue = b.wishCount || 0;
          break;
        case 'expectedPrice':
          aValue = a.expectedPrice || 0;
          bValue = b.expectedPrice || 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // 分頁
    const total = products.length;
    const totalPages = Math.ceil(total / pageSize);
    const offset = (page - 1) * pageSize;
    const paginatedProducts = products.slice(offset, offset + pageSize);

    // 轉換為前端期望的格式
    const result = {
      data: paginatedProducts.map(product => ({
        id: product.id,
        name: product.name,
        productName: product.name,  // 相容性
        description: product.description,
        category: getCategoryName(product.categoryId),
        region: product.region,
        status: product.status,
        expectedPrice: product.expectedPrice || 0,
        currency: product.currency || 'TWD',
        wishCount: product.wishCount || 0,
        imageUrl: product.imageUrls?.[0] || product.image_urls?.split(',')[0] || null,
        imageUrls: product.imageUrls || (product.image_urls ? product.image_urls.split(',') : []),
        image_urls: product.image_urls || (product.imageUrls ? product.imageUrls.join(',') : ''),
        createdAt: new Date(product.createdAt).toISOString(),
        updatedAt: new Date(product.updatedAt).toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching wish products:', error);
    ErrorHandler.logError('GET_WISH_PRODUCTS_LIST', error);
    return NextResponse.json(
      { error: 'Failed to fetch wish products' },
      { status: 500 }
    );
  }
}

// 輔助函數：取得類別名稱
function getCategoryName(categoryId: number): string {
  const categories: Record<number, string> = {
    1: '電子產品',
    2: '服飾配件',
    3: '美妝保養',
    4: '食品飲料',
    5: '家居生活',
    6: '運動健身',
    7: '圖書文具',
    8: '玩具遊戲',
    9: '其他',
  };
  return categories[categoryId] || '其他';
}