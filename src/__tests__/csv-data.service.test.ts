import { CSVDataService } from '@/services/csv-data.service';
import fs from 'fs-extra';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('CSVDataService', () => {
  let csvService: CSVDataService;
  const testDataPath = './test-data/';
  const testFilename = 'test.csv';

  beforeEach(async () => {
    csvService = new CSVDataService(testDataPath);
    await fs.ensureDir(testDataPath);
  });

  afterEach(async () => {
    await fs.remove(testDataPath);
  });

  it('應該能夠生成唯一ID', () => {
    const id1 = csvService.generateId();
    const id2 = csvService.generateId();

    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('應該能夠取得當前時間戳', () => {
    const timestamp = csvService.getCurrentTimestamp();

    expect(timestamp).toBeDefined();
    expect(new Date(timestamp).getTime()).toBeCloseTo(Date.now(), -3);
  });

  it('應該能夠讀取不存在的CSV檔案並回傳空陣列', async () => {
    const result = await csvService.readCSV('nonexistent.csv');
    expect(result).toEqual([]);
  });

  it('應該能夠寫入和讀取CSV檔案', async () => {
    const testData = [
      {
        id: '123',
        name: '測試商品',
        categoryId: 1,
        isActive: true,
        createdAt: new Date(),
        imageUrls: ['image1.jpg', 'image2.jpg'],
      },
    ];

    await csvService.writeCSV(testFilename, testData);
    const result = await csvService.readCSV(testFilename);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: '123',
      name: '測試商品',
      category_id: 1,
      is_active: true,
    });
  });

  it('應該能夠處理空資料寫入', async () => {
    await csvService.writeCSV(testFilename, []);
    const result = await csvService.readCSV(testFilename);
    expect(result).toEqual([]);
  });

  it('應該能夠檢查檔案權限', async () => {
    // 先建立檔案
    await csvService.writeCSV(testFilename, [{ id: '1', name: 'test' }]);

    const hasPermission = await csvService.checkFilePermissions(testFilename);
    expect(hasPermission).toBe(true);

    const noPermission =
      await csvService.checkFilePermissions('nonexistent.csv');
    expect(noPermission).toBe(false);
  });

  it('應該能夠備份CSV檔案', async () => {
    const testData = [{ id: '1', name: 'test' }];
    await csvService.writeCSV(testFilename, testData);

    await csvService.backupCSV(testFilename);

    const backupDir = path.join(testDataPath, 'backups');
    const backupFiles = await fs.readdir(backupDir);
    expect(backupFiles.length).toBeGreaterThan(0);
    expect(backupFiles[0]).toContain(testFilename);
  });
});
