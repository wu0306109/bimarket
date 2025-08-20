import csvParser from 'csv-parser';
import { stringify as csvStringify } from 'csv-stringify/sync';
import fs from 'fs-extra';
import path from 'path';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

export class CSVDataService {
  private dataPath = './data/';

  constructor(dataPath?: string) {
    if (dataPath) {
      this.dataPath = dataPath;
    }
  }

  // 讀取 CSV 檔案
  async readCSV<T>(filename: string): Promise<T[]> {
    const filePath = path.join(this.dataPath, filename);

    if (!(await fs.pathExists(filePath))) {
      console.log(`CSV 檔案不存在: ${filePath}`);
      return [];
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8');

      // 檢查檔案是否為空或只有 header
      const lines = content.trim().split('\n');
      if (lines.length <= 1) {
        console.log(`CSV 檔案只有 header 或為空: ${filename}`);
        return [];
      }

      return new Promise((resolve, reject) => {
        const results: T[] = [];
        const stream = Readable.from([content]);

        stream
          .pipe(
            csvParser({
              skipEmptyLines: true,
              mapHeaders: ({ header }) => header.trim(),
            }),
          )
          .on('data', (data) => {
            try {
              // 處理特殊欄位轉換
              const transformed = this.transformCSVRow(data);
              results.push(transformed);
            } catch (transformError) {
              console.error(`轉換 CSV 行資料時發生錯誤:`, transformError, data);
            }
          })
          .on('end', () => {
            console.log(
              `成功讀取 CSV 檔案 ${filename}, 共 ${results.length} 筆資料`,
            );
            resolve(results);
          })
          .on('error', (error) => {
            console.error(`解析 CSV 檔案時發生錯誤: ${filename}`, error);
            reject(error);
          });
      });
    } catch (error) {
      console.error(`讀取 CSV 檔案失敗: ${filename}`, error);
      throw new Error(`CSV_READ_ERROR: ${filename}`);
    }
  }

  // 寫入 CSV 檔案
  async writeCSV<T extends Record<string, any>>(
    filename: string,
    data: T[],
  ): Promise<void> {
    const filePath = path.join(this.dataPath, filename);

    try {
      // 確保目錄存在
      await fs.ensureDir(this.dataPath);

      if (data.length === 0) {
        // 如果沒有資料，只寫入 header
        await fs.writeFile(filePath, '', 'utf-8');
        return;
      }

      // 轉換資料格式
      const transformedData = data.map((row) => this.transformForCSV(row));

      const csvContent = csvStringify(transformedData, {
        header: true,
        quoted: true,
        quotedEmpty: true,
        quotedString: true,
      });

      await fs.writeFile(filePath, csvContent, 'utf-8');
    } catch (error) {
      console.error(`寫入 CSV 檔案失敗: ${filename}`, error);
      throw new Error(`CSV_WRITE_ERROR: ${filename}`);
    }
  }

  // 轉換 CSV 行資料
  private transformCSVRow(data: any): any {
    const transformed = { ...data };

    try {
      // 處理布林值
      if (transformed.is_active !== undefined) {
        transformed.is_active =
          transformed.is_active === 'true' || transformed.is_active === true;
      }

      // 處理數字 (但保持 id 為字串)
      ['category_id', 'sort_order', 'file_size', 'like_count'].forEach((field) => {
        if (transformed[field] !== undefined && transformed[field] !== '') {
          const num = parseInt(transformed[field]);
          if (!isNaN(num)) {
            transformed[field] = num;
          }
        }
      });

      // 處理陣列（圖片URL）
      if (
        transformed.image_urls &&
        typeof transformed.image_urls === 'string'
      ) {
        transformed.image_urls = transformed.image_urls
          .split(';')
          .filter(Boolean);
      }

      // 處理日期
      ['created_at', 'updated_at'].forEach((field) => {
        if (transformed[field] && typeof transformed[field] === 'string') {
          try {
            transformed[field] = new Date(transformed[field]);
          } catch (dateError) {
            console.warn(`無法解析日期 ${field}: ${transformed[field]}`);
          }
        }
      });

      // 轉換 snake_case 到 camelCase (為了 TypeScript 介面相容性)
      const snakeToCamelMap: { [key: string]: string } = {
        is_active: 'isActive',
        sort_order: 'sortOrder',
        created_at: 'createdAt',
        updated_at: 'updatedAt',
        category_id: 'categoryId',
        additional_info: 'additionalInfo',
        image_urls: 'imageUrls',
        user_id: 'userId',
        original_filename: 'originalFilename',
        stored_filename: 'storedFilename',
        file_path: 'filePath',
        file_size: 'fileSize',
        mime_type: 'mimeType',
        related_table: 'relatedTable',
        related_id: 'relatedId',
        like_count: 'likeCount',
      };

      Object.keys(snakeToCamelMap).forEach((snakeKey) => {
        if (transformed[snakeKey] !== undefined) {
          transformed[snakeToCamelMap[snakeKey]] = transformed[snakeKey];
          // 保留原始的 snake_case 鍵以保持相容性
        }
      });
    } catch (error) {
      console.error('轉換 CSV 行資料時發生錯誤:', error, data);
      throw error;
    }

    return transformed;
  }

  // 轉換資料為 CSV 格式
  private transformForCSV(data: any): any {
    const transformed = { ...data };

    // 處理陣列
    if (Array.isArray(transformed.image_urls)) {
      transformed.image_urls = transformed.image_urls.join(';');
    }
    if (Array.isArray(transformed.imageUrls)) {
      transformed.image_urls = transformed.imageUrls.join(';');
      delete transformed.imageUrls;
    }

    // 處理日期
    ['created_at', 'updated_at', 'createdAt', 'updatedAt'].forEach((field) => {
      if (transformed[field] instanceof Date) {
        transformed[field.replace(/([A-Z])/g, '_$1').toLowerCase()] =
          transformed[field].toISOString();
        if (field !== field.replace(/([A-Z])/g, '_$1').toLowerCase()) {
          delete transformed[field];
        }
      }
    });

    // 處理 camelCase 到 snake_case 的轉換
    const camelToSnakeMap: { [key: string]: string } = {
      categoryId: 'category_id',
      additionalInfo: 'additional_info',
      imageUrls: 'image_urls',
      userId: 'user_id',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      isActive: 'is_active',
      sortOrder: 'sort_order',
      originalFilename: 'original_filename',
      storedFilename: 'stored_filename',
      filePath: 'file_path',
      fileSize: 'file_size',
      mimeType: 'mime_type',
      relatedTable: 'related_table',
      relatedId: 'related_id',
      likeCount: 'like_count',
    };

    Object.keys(camelToSnakeMap).forEach((camelKey) => {
      if (transformed[camelKey] !== undefined) {
        transformed[camelToSnakeMap[camelKey]] = transformed[camelKey];
        delete transformed[camelKey];
      }
    });

    return transformed;
  }

  // 生成唯一 ID
  generateId(): string {
    return uuidv4();
  }

  // 取得當前時間戳
  getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // 備份 CSV 檔案
  async backupCSV(filename: string): Promise<void> {
    const sourcePath = path.join(this.dataPath, filename);
    const backupDir = path.join(this.dataPath, 'backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `${timestamp}_${filename}`);

    try {
      await fs.ensureDir(backupDir);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, backupPath);
        console.log(`備份檔案已建立: ${backupPath}`);
      }
    } catch (error) {
      console.error(`備份檔案失敗: ${filename}`, error);
      throw new Error(`BACKUP_ERROR: ${filename}`);
    }
  }

  // 檢查檔案權限
  async checkFilePermissions(filename: string): Promise<boolean> {
    const filePath = path.join(this.dataPath, filename);

    try {
      await fs.access(filePath, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }

  // 安全讀取 CSV（包含權限檢查）
  async secureReadCSV<T>(filename: string): Promise<T[]> {
    const hasPermission = await this.checkFilePermissions(filename);

    if (!hasPermission) {
      throw new Error(`FILE_PERMISSION_ERROR: ${filename}`);
    }

    return this.readCSV<T>(filename);
  }

  // 安全寫入 CSV（包含備份）
  async secureWriteCSV<T extends Record<string, any>>(
    filename: string,
    data: T[],
  ): Promise<void> {
    // 先備份現有檔案
    try {
      await this.backupCSV(filename);
    } catch (error) {
      console.warn('備份檔案時發生警告:', error);
    }

    // 寫入新資料
    await this.writeCSV(filename, data);
  }

  // 增加許願商品的點讚數
  async incrementWishProductLikeCount(
    productId: string,
  ): Promise<boolean> {
    try {
      const products = await this.readCSV<any>('wish-products.csv');
      const productIndex = products.findIndex((p) => p.id === productId);

      if (productIndex === -1) {
        console.warn(`未找到 ID 為 ${productId} 的許願商品。`);
        return false;
      }

      // 確保 likeCount 存在且為數字
      const currentLikes = products[productIndex].likeCount || 0;
      products[productIndex].likeCount = currentLikes + 1;

      await this.secureWriteCSV('wish-products.csv', products);
      console.log(`許願商品 ${productId} 的點讚數已增加到 ${products[productIndex].likeCount}`);
      return true;
    } catch (error) {
      console.error(`增加許願商品點讚數失敗 (${productId}):`, error);
      throw new Error(`UPDATE_LIKE_COUNT_ERROR: ${productId}`);
    }
  }
}
