import { CSVDataService } from '@/services/csv-data.service';
import { ErrorHandler } from '@/services/error-handler.service';
import { ErrorCodes, FileUpload } from '@/types/wish-product';
import fs from 'fs-extra';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const csvService = new CSVDataService();

// POST /api/upload - 上傳檔案
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.NO_FILE_PROVIDED,
            message: '請選擇要上傳的檔案',
          },
        },
        { status: 400 },
      );
    }

    // 驗證檔案類型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.INVALID_FILE_FORMAT,
            message: '只支援 JPG, PNG, WebP 格式的圖片',
          },
        },
        { status: 400 },
      );
    }

    // 驗證檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.FILE_TOO_LARGE,
            message: '檔案大小不可超過 5MB',
          },
        },
        { status: 400 },
      );
    }

    // 生成唯一檔名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = path.extname(file.name);
    const storedFilename = `${timestamp}_${Math.random().toString(36).substring(7)}${fileExtension}`;
    const filePath = path.join('./uploads/wish-products/', storedFilename);

    try {
      // 確保上傳目錄存在
      await fs.ensureDir('./uploads/wish-products/');

      // 儲存檔案
      const buffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));

      // 記錄上傳資訊
      const uploadRecord: FileUpload = {
        id: csvService.generateId(),
        originalFilename: file.name,
        storedFilename: storedFilename,
        filePath: filePath,
        fileSize: file.size,
        mimeType: file.type,
        relatedTable: '',
        relatedId: '',
        createdAt: new Date(),
      };

      const uploadRecords = await ErrorHandler.safeReadCSV<FileUpload>(
        csvService,
        'file-uploads.csv',
      );
      uploadRecords.push(uploadRecord);
      await ErrorHandler.safeWriteCSV(
        csvService,
        'file-uploads.csv',
        uploadRecords,
      );

      return NextResponse.json({
        success: true,
        data: {
          id: uploadRecord.id,
          url: `/uploads/wish-products/${storedFilename}`,
          filename: storedFilename,
          originalFilename: file.name,
          fileSize: file.size,
          mimeType: file.type,
        },
      });
    } catch (error) {
      ErrorHandler.logError('FILE_SAVE_ERROR', error, {
        filename: storedFilename,
      });
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.FILE_UPLOAD_ERROR,
            message: '檔案儲存失敗',
          },
        },
        { status: 500 },
      );
    }
  } catch (error) {
    ErrorHandler.logError('UPLOAD_FILE', error);
    const errorResponse = ErrorHandler.handleApiError(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// GET /api/upload/[filename] - 提供檔案存取（靜態檔案服務）
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const filename = pathname.split('/').pop();

    if (!filename) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.VALIDATION_ERROR,
            message: '無效的檔案名稱',
          },
        },
        { status: 400 },
      );
    }

    const filePath = path.join('./uploads/wish-products/', filename);

    // 檢查檔案是否存在
    if (!(await fs.pathExists(filePath))) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.PRODUCT_NOT_FOUND,
            message: '檔案不存在',
          },
        },
        { status: 404 },
      );
    }

    // 讀取檔案
    const buffer = await fs.readFile(filePath);

    // 取得檔案類型
    const ext = path.extname(filename).toLowerCase();
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
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    ErrorHandler.logError('SERVE_FILE', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.FILE_READ_ERROR,
          message: '檔案讀取失敗',
        },
      },
      { status: 500 },
    );
  }
}
