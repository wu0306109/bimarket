import { CSVDataService } from '@/services/csv-data.service';
import { ErrorHandler } from '@/services/error-handler.service';
import { ErrorCodes, WishProduct } from '@/types/wish-product';
import { NextRequest, NextResponse } from 'next/server';

const csvService = new CSVDataService();

// GET /api/wish-products/[id] - 取得單一許願商品詳情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.VALIDATION_ERROR,
            message: '缺少商品 ID',
          },
        },
        { status: 400 },
      );
    }

    // 讀取所有許願商品資料
    const products = await ErrorHandler.safeReadCSV<WishProduct>(
      csvService,
      'wish-products.csv',
    );

    // 尋找指定 ID 的商品
    const product = products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.PRODUCT_NOT_FOUND,
            message: '找不到指定的許願商品',
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    ErrorHandler.logError('GET_WISH_PRODUCT_BY_ID', error, { id: params.id });
    const errorResponse = ErrorHandler.handleApiError(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
