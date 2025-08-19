import { CSVDataService } from '@/services/csv-data.service';
import { ErrorHandler } from '@/services/error-handler.service';
import {
  FileUpload,
  PaginatedResponse,
  PaginationQuery,
  WishProduct,
  WishProductFormData,
  wishProductSchema,
} from '@/types/wish-product';
import { NextRequest, NextResponse } from 'next/server';

const csvService = new CSVDataService();

// POST /api/wish-products - 建立新的許願商品
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 解析表單資料
    const data: any = {
      name: formData.get('name'),
      description: formData.get('description'),
      categoryId: parseInt(formData.get('categoryId') as string),
      region: formData.get('region'),
      additionalInfo: formData.get('additionalInfo') || undefined,
    };

    // 處理圖片檔案
    const images: File[] = [];
    const imageFiles = formData.getAll('images');

    for (const file of imageFiles) {
      if (file instanceof File && file.size > 0) {
        // 驗證檔案
        ErrorHandler.validateFileType(file);
        ErrorHandler.validateFileSize(file);
        images.push(file);
      }
    }

    if (images.length > 0) {
      data.images = images;
    }

    // 驗證表單資料
    const validatedData = wishProductSchema.parse(data);

    // 處理圖片上傳並取得檔案名稱
    const imageUrls: string[] = [];
    if (validatedData.images && validatedData.images.length > 0) {
      for (const image of validatedData.images) {
        const filename = await uploadImage(image);
        imageUrls.push(filename);
      }
    }

    // 讀取現有資料
    const existingProducts = await ErrorHandler.safeReadCSV<WishProduct>(
      csvService,
      'wish-products.csv',
    );

    // 建立新商品資料
    const newProduct: WishProduct = {
      id: csvService.generateId(),
      name: validatedData.name,
      description: validatedData.description,
      categoryId: validatedData.categoryId,
      region: validatedData.region,
      additionalInfo: validatedData.additionalInfo || '',
      imageUrls: imageUrls,
      status: 'completed',
      userId: '', // 暫時空值，後續可整合用戶系統
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 新增到資料陣列
    existingProducts.push(newProduct);

    // 寫入 CSV 檔案
    await ErrorHandler.safeWriteCSV(
      csvService,
      'wish-products.csv',
      existingProducts,
    );

    // 記錄檔案上傳資訊
    if (imageUrls.length > 0) {
      await recordFileUploads(imageUrls, newProduct.id);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newProduct.id,
          message: '許願商品已成功提交',
        },
      },
      { status: 201 },
    );
  } catch (error) {
    ErrorHandler.logError('CREATE_WISH_PRODUCT', error);
    const errorResponse = ErrorHandler.handleApiError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}

// GET /api/wish-products - 查詢許願商品清單（管理員用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 解析查詢參數
    const query: PaginationQuery = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      category: searchParams.get('category')
        ? parseInt(searchParams.get('category')!)
        : undefined,
      status: searchParams.get('status') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    };

    // 讀取所有許願商品資料
    let products = await ErrorHandler.safeReadCSV<WishProduct>(
      csvService,
      'wish-products.csv',
    );

    // 套用篩選條件
    if (query.category) {
      products = products.filter((p) => p.categoryId === query.category);
    }

    if (query.status) {
      products = products.filter((p) => p.status === query.status);
    }

    if (query.startDate) {
      const start = new Date(query.startDate);
      products = products.filter((p) => new Date(p.createdAt) >= start);
    }

    if (query.endDate) {
      const end = new Date(query.endDate);
      products = products.filter((p) => new Date(p.createdAt) <= end);
    }

    // 排序
    products.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (query.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default: // createdAt
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (query.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // 分頁
    const total = products.length;
    const totalPages = Math.ceil(total / query.limit!);
    const offset = (query.page! - 1) * query.limit!;
    const paginatedProducts = products.slice(offset, offset + query.limit!);

    const response: PaginatedResponse<WishProduct> = {
      items: paginatedProducts,
      pagination: {
        total,
        page: query.page!,
        limit: query.limit!,
        totalPages,
      },
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    ErrorHandler.logError('GET_WISH_PRODUCTS', error);
    const errorResponse = ErrorHandler.handleApiError(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 上傳圖片的輔助函數
async function uploadImage(file: File): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileExtension = file.name.split('.').pop();
  const filename = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const filePath = `./uploads/wish-products/${filename}`;

  try {
    // 確保上傳目錄存在
    const fs = require('fs-extra');
    await fs.ensureDir('./uploads/wish-products/');

    // 儲存檔案
    const buffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(buffer));

    return filename;
  } catch (error) {
    ErrorHandler.logError('UPLOAD_IMAGE', error, { filename, filePath });
    throw { code: 'FILE_UPLOAD_ERROR' };
  }
}

// 記錄檔案上傳資訊
async function recordFileUploads(
  filenames: string[],
  relatedId: string,
): Promise<void> {
  try {
    const uploadRecords = await ErrorHandler.safeReadCSV<FileUpload>(
      csvService,
      'file-uploads.csv',
    );

    for (const filename of filenames) {
      uploadRecords.push({
        id: csvService.generateId(),
        originalFilename: filename,
        storedFilename: filename,
        filePath: `/uploads/wish-products/${filename}`,
        fileSize: 0, // 實際實作時需要取得檔案大小
        mimeType: 'image/jpeg', // 實際實作時需要檢測
        relatedTable: 'wish_products',
        relatedId: relatedId,
        createdAt: new Date(),
      });
    }

    await ErrorHandler.safeWriteCSV<FileUpload>(
      csvService,
      'file-uploads.csv',
      uploadRecords,
    );
  } catch (error) {
    ErrorHandler.logError('RECORD_FILE_UPLOADS', error, {
      filenames,
      relatedId,
    });
    // 不拋出錯誤，因為主要功能已完成
  }
}
