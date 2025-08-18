import { CSVDataService } from '@/services/csv-data.service';
import { ErrorHandler } from '@/services/error-handler.service';
import { ProductCategory } from '@/types/wish-product';
import { NextRequest, NextResponse } from 'next/server';

const csvService = new CSVDataService();

// GET /api/categories - 取得所有啟用的商品類別
export async function GET(request: NextRequest) {
  try {
    console.log('開始載入商品類別...');

    // 讀取類別資料
    let categories = await ErrorHandler.safeReadCSV<ProductCategory>(
      csvService,
      'product-categories.csv',
    );

    console.log(`載入了 ${categories.length} 個類別`);

    // 只回傳啟用的類別，並按排序順序排列
    categories = categories
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    console.log(`篩選後有 ${categories.length} 個啟用的類別`);

    const response = {
      success: true,
      data: categories,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('載入類別時發生錯誤:', error);
    ErrorHandler.logError('GET_CATEGORIES', error);
    const errorResponse = ErrorHandler.handleApiError(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
