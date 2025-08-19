import fs from 'fs-extra';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: NextRequest, context: any) {
  try {
    const { params } = context as { params: { path: string[] } };
    const filePath = path.join(process.cwd(), 'uploads', ...params.path);

    // 檢查檔案是否存在
    if (!(await fs.pathExists(filePath))) {
      return NextResponse.json({ error: '檔案不存在' }, { status: 404 });
    }

    // 安全檢查：確保路徑在 uploads 目錄內
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsDir = path.resolve(uploadsDir);

    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return NextResponse.json({ error: '無效的檔案路徑' }, { status: 403 });
    }

    // 讀取檔案
    const buffer = await fs.readFile(filePath);

    // 取得檔案類型
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';

    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('檔案服務錯誤:', error);
    return NextResponse.json({ error: '檔案讀取失敗' }, { status: 500 });
  }
}
