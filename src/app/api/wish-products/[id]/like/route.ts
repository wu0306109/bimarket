import { CSVDataService } from '@/services/csv-data.service';
import { ApiResponse, ErrorCodes } from '@/types/wish-product';
import { NextRequest, NextResponse } from 'next/server';

const csvDataService = new CSVDataService();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.REQUIRED_FIELD_MISSING,
            message: '商品ID為必填項',
          },
        } as ApiResponse<null>,
        { status: 400 },
      );
    }

    const success = await csvDataService.incrementWishProductLikeCount(productId);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.PRODUCT_NOT_FOUND,
            message: '未找到該許願商品，無法增加點讚數',
          },
        } as ApiResponse<null>,
        { status: 404 },
      );
    }

    // Return the updated product or just a success message
    return NextResponse.json({ success: true } as ApiResponse<null>, { status: 200 });
  } catch (error) {
    console.error('處理點讚請求時發生錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.INTERNAL_SERVER_ERROR,
          message: '處理點讚請求時發生錯誤',
        },
      } as ApiResponse<null>,
      { status: 500 },
    );
  }
}
