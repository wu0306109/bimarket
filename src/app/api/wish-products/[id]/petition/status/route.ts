import { CSVDataService } from '@/services/csv-data.service';
import { ErrorCodes } from '@/types/wish-product';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const csv = new CSVDataService();

export async function GET(request: NextRequest, context: any) {
  try {
    const { params } = context as { params: { id: string } };
    const productId = params.id;
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: ErrorCodes.REQUIRED_FIELD_MISSING, message: '缺少商品 ID' },
        },
        { status: 400 },
      );
    }

    // 取得或建立使用者 ID（cookie）
    const cookieStore = cookies();
    let userId = cookieStore.get('bm_uid')?.value;
    if (!userId) {
      userId = `guest_${Math.random().toString(36).slice(2)}`;
      cookieStore.set('bm_uid', userId, { httpOnly: false, sameSite: 'lax', path: '/' });
    }

    const has = await csv.hasPetition(productId, userId);
    return NextResponse.json({ success: true, data: { petitioned: has, userId } });
  } catch (error) {
    console.error('GET petition status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: ErrorCodes.INTERNAL_SERVER_ERROR, message: '取得連署狀態失敗' },
      },
      { status: 500 },
    );
  }
}


