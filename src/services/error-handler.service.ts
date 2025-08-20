import { ApiResponse, ErrorCodes } from '@/types/wish-product';

import { CSVDataService } from './csv-data.service';

export class ErrorHandler {
  static handleApiError(error: any): ApiResponse<null> {
    console.error('處理 API 錯誤:', error);

    // 表單驗證錯誤
    if (
      error.code === ErrorCodes.VALIDATION_ERROR ||
      error.name === 'ZodError'
    ) {
      return {
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: '表單資料驗證失敗',
          details:
            error.issues?.map((issue: any) => ({
              field: issue.path.join('.'),
              message: issue.message,
            })) || [],
        },
      };
    }

    // 處理自定義錯誤碼
    if (error.code) {
      switch (error.code) {
        case ErrorCodes.FILE_READ_ERROR:
          return {
            success: false,
            error: {
              code: ErrorCodes.FILE_READ_ERROR,
              message: '無法讀取資料檔案，請稍後再試',
            },
          };
        case ErrorCodes.FILE_WRITE_ERROR:
          return {
            success: false,
            error: {
              code: ErrorCodes.FILE_WRITE_ERROR,
              message: '無法儲存資料，請稍後再試',
            },
          };
        case ErrorCodes.CSV_PARSE_ERROR:
          return {
            success: false,
            error: {
              code: ErrorCodes.CSV_PARSE_ERROR,
              message: '資料格式解析錯誤',
            },
          };
      }
    }

    // 檔案操作錯誤（通過錯誤訊息檢查）
    const errorMessage = error.message || error.toString() || '';
    if (typeof errorMessage === 'string') {
      if (errorMessage.includes('CSV_READ_ERROR')) {
        return {
          success: false,
          error: {
            code: ErrorCodes.FILE_READ_ERROR,
            message: '無法讀取資料檔案，請稍後再試',
          },
        };
      }

      if (errorMessage.includes('CSV_WRITE_ERROR')) {
        return {
          success: false,
          error: {
            code: ErrorCodes.FILE_WRITE_ERROR,
            message: '無法儲存資料，請稍後再試',
          },
        };
      }

      if (errorMessage.includes('CSV_PARSE_ERROR')) {
        return {
          success: false,
          error: {
            code: ErrorCodes.CSV_PARSE_ERROR,
            message: '資料格式解析錯誤',
          },
        };
      }
    }

    // 檔案上傳錯誤
    if (error.code === ErrorCodes.FILE_UPLOAD_ERROR) {
      return {
        success: false,
        error: {
          code: ErrorCodes.FILE_UPLOAD_ERROR,
          message: '檔案上傳失敗，請檢查檔案格式和大小',
        },
      };
    }

    if (error.code === ErrorCodes.INVALID_FILE_FORMAT) {
      return {
        success: false,
        error: {
          code: ErrorCodes.INVALID_FILE_FORMAT,
          message: '只支援 JPG, PNG, WebP 格式的圖片',
        },
      };
    }

    if (error.code === ErrorCodes.FILE_TOO_LARGE) {
      return {
        success: false,
        error: {
          code: ErrorCodes.FILE_TOO_LARGE,
          message: '檔案大小不可超過 5MB',
        },
      };
    }

    if (error.code === ErrorCodes.NO_FILE_PROVIDED) {
      return {
        success: false,
        error: {
          code: ErrorCodes.NO_FILE_PROVIDED,
          message: '請選擇要上傳的檔案',
        },
      };
    }

    // 業務邏輯錯誤
    if (error.code === ErrorCodes.PRODUCT_NOT_FOUND) {
      return {
        success: false,
        error: {
          code: ErrorCodes.PRODUCT_NOT_FOUND,
          message: '找不到指定的許願商品',
        },
      };
    }

    if (error.code === ErrorCodes.CATEGORY_NOT_FOUND) {
      return {
        success: false,
        error: {
          code: ErrorCodes.CATEGORY_NOT_FOUND,
          message: '找不到指定的商品類別',
        },
      };
    }

    if (error.code === ErrorCodes.DUPLICATE_SUBMISSION) {
      return {
        success: false,
        error: {
          code: ErrorCodes.DUPLICATE_SUBMISSION,
          message: '請勿重複提交表單',
        },
      };
    }

    // 權限錯誤
    if (error.message?.includes('FILE_PERMISSION_ERROR')) {
      return {
        success: false,
        error: {
          code: ErrorCodes.FILE_READ_ERROR,
          message: '檔案存取權限不足',
        },
      };
    }

    // 預設錯誤
    console.error('未處理的錯誤:', error);
    return {
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: '系統暫時無法處理您的請求，請稍後再試',
      },
    };
  }

  // CSV 檔案安全讀取
  static async safeReadCSV<T>(
    csvService: CSVDataService,
    filename: string,
  ): Promise<T[]> {
    try {
      return await csvService.secureReadCSV<T>(filename);
    } catch (error) {
      console.error(`CSV 讀取失敗: ${filename}`, error);
      throw { code: ErrorCodes.FILE_READ_ERROR, message: error };
    }
  }

  // CSV 檔案安全寫入
  static async safeWriteCSV<T extends Record<string, any>>(
    csvService: CSVDataService,
    filename: string,
    data: T[],
  ): Promise<void> {
    try {
      return await csvService.secureWriteCSV(filename, data);
    } catch (error) {
      console.error(`CSV 寫入失敗: ${filename}`, error);
      throw { code: ErrorCodes.FILE_WRITE_ERROR, message: error };
    }
  }

  // 驗證檔案類型
  static validateFileType(file: File): void {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw { code: ErrorCodes.INVALID_FILE_FORMAT };
    }
  }

  // 驗證檔案大小
  static validateFileSize(file: File, maxSize: number = 5 * 1024 * 1024): void {
    if (file.size > maxSize) {
      throw { code: ErrorCodes.FILE_TOO_LARGE };
    }
  }

  // 記錄錯誤
  static logError(operation: string, error: any, context?: any): void {
    console.error(`[ERROR] ${operation}:`, {
      error: error.message || error,
      code: error.code,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}
