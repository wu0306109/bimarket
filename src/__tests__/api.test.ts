import { wishProductSchema } from '@/types/wish-product';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('API Schema Validation', () => {
  describe('WishProduct Schema', () => {
    it('應該驗證有效的許願商品資料', () => {
      const validData = {
        name: '測試商品',
        description: '這是一個測試商品的詳細描述，包含所有必要資訊',
        categoryId: 1,
        region: '台灣',
        additionalInfo: '額外的補充資訊',
      };

      const result = wishProductSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('應該拒絕缺少必填欄位的資料', () => {
      const invalidData = {
        name: '測試商品',
        // 缺少 description
        categoryId: 1,
        region: '台灣',
      };

      const result = wishProductSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toContain('description');
      }
    });

    it('應該驗證商品名稱長度限制', () => {
      const shortName = {
        name: 'A', // 太短
        description: '這是一個測試商品的詳細描述',
        categoryId: 1,
        region: '台灣',
      };

      const longName = {
        name: 'A'.repeat(256), // 太長
        description: '這是一個測試商品的詳細描述',
        categoryId: 1,
        region: '台灣',
      };

      expect(wishProductSchema.safeParse(shortName).success).toBe(false);
      expect(wishProductSchema.safeParse(longName).success).toBe(false);
    });

    it('應該驗證商品描述長度限制', () => {
      const shortDescription = {
        name: '測試商品',
        description: '太短', // 少於10個字元
        categoryId: 1,
        region: '台灣',
      };

      const longDescription = {
        name: '測試商品',
        description: 'A'.repeat(2001), // 超過2000個字元
        categoryId: 1,
        region: '台灣',
      };

      expect(wishProductSchema.safeParse(shortDescription).success).toBe(false);
      expect(wishProductSchema.safeParse(longDescription).success).toBe(false);
    });

    it('應該驗證類別ID為正整數', () => {
      const invalidCategoryId = {
        name: '測試商品',
        description: '這是一個測試商品的詳細描述',
        categoryId: -1, // 負數
        region: '台灣',
      };

      const zeroCategoryId = {
        name: '測試商品',
        description: '這是一個測試商品的詳細描述',
        categoryId: 0, // 零
        region: '台灣',
      };

      expect(wishProductSchema.safeParse(invalidCategoryId).success).toBe(
        false,
      );
      expect(wishProductSchema.safeParse(zeroCategoryId).success).toBe(false);
    });

    it('應該允許選填的補充資訊', () => {
      const withoutAdditionalInfo = {
        name: '測試商品',
        description: '這是一個測試商品的詳細描述',
        categoryId: 1,
        region: '台灣',
      };

      const withAdditionalInfo = {
        name: '測試商品',
        description: '這是一個測試商品的詳細描述',
        categoryId: 1,
        region: '台灣',
        additionalInfo: '額外的補充資訊',
      };

      expect(wishProductSchema.safeParse(withoutAdditionalInfo).success).toBe(
        true,
      );
      expect(wishProductSchema.safeParse(withAdditionalInfo).success).toBe(
        true,
      );
    });

    it('應該限制補充資訊的長度', () => {
      const tooLongAdditionalInfo = {
        name: '測試商品',
        description: '這是一個測試商品的詳細描述',
        categoryId: 1,
        region: '台灣',
        additionalInfo: 'A'.repeat(1001), // 超過1000個字元
      };

      expect(wishProductSchema.safeParse(tooLongAdditionalInfo).success).toBe(
        false,
      );
    });
  });
});
