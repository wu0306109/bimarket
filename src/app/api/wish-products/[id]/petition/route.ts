import { CSVDataService } from '@/services/csv-data.service';
import { ErrorCodes } from '@/types/wish-product';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const csv = new CSVDataService();

function ensureUserId() {
  const cookieStore = cookies();
  let userId = cookieStore.get('bm_uid')?.value;
  if (!userId) {
    userId = `guest_${Math.random().toString(36).slice(2)}`;
    cookieStore.set('bm_uid', userId, { httpOnly: false, sameSite: 'lax', path: '/' });
  }
  return userId;
}

export async function POST(request: NextRequest, context: any) {
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

    const userId = ensureUserId();
    const result = await csv.addPetition(productId, userId);

    if (result === 'not-found') {
      return NextResponse.json(
        { success: false, error: { code: ErrorCodes.PRODUCT_NOT_FOUND, message: '商品不存在' } },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: { petitioned: true, idempotent: result === 'already' } });
  } catch (error) {
    console.error('POST petition error:', error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCodes.INTERNAL_SERVER_ERROR, message: '連署失敗' } },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
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

    const userId = ensureUserId();
    const result = await csv.removePetition(productId, userId);

    if (result === 'not-found') {
      return NextResponse.json(
        { success: false, error: { code: ErrorCodes.PRODUCT_NOT_FOUND, message: '商品不存在' } },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: { petitioned: false, idempotent: result === 'none' } });
  } catch (error) {
    console.error('DELETE petition error:', error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCodes.INTERNAL_SERVER_ERROR, message: '取消連署失敗' } },
      { status: 500 },
    );
  }
}


