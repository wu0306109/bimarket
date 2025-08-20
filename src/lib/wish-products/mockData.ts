import {
  PaginationParams,
  WishProduct,
  WishProductFilter,
  WishProductsResponse,
} from './types';

const mockProducts: WishProduct[] = [
  {
    id: 'wish-001',
    userId: 'user-001',
    userName: '張小明',
    productName: 'iPhone 15 Pro Max',
    description: '希望能以優惠價格購買最新款iPhone',
    category: '電子產品',
    expectedPrice: 35000,
    currency: 'TWD',
    wishCount: 25,
    createdAt: new Date('2024-01-20T10:00:00'),
    updatedAt: new Date('2024-01-20T10:00:00'),
  },
  {
    id: 'wish-002',
    userId: 'user-002',
    userName: '李小美',
    productName: 'MacBook Pro 14吋',
    description: '需要一台高效能筆電用於程式開發',
    category: '電子產品',
    expectedPrice: 65000,
    currency: 'TWD',
    wishCount: 18,
    createdAt: new Date('2024-01-19T15:30:00'),
    updatedAt: new Date('2024-01-19T15:30:00'),
  },
  {
    id: 'wish-003',
    userId: 'user-003',
    userName: '王大華',
    productName: 'Sony A7 IV 相機',
    description: '專業攝影需求，希望找到好價格',
    category: '攝影器材',
    expectedPrice: 75000,
    currency: 'TWD',
    wishCount: 12,
    createdAt: new Date('2024-01-19T09:15:00'),
    updatedAt: new Date('2024-01-19T09:15:00'),
  },
  {
    id: 'wish-004',
    userId: 'user-004',
    userName: '陳小芳',
    productName: 'Dyson V15 吸塵器',
    description: '家用清潔需求，希望團購',
    category: '家電用品',
    expectedPrice: 18000,
    currency: 'TWD',
    wishCount: 30,
    createdAt: new Date('2024-01-18T14:20:00'),
    updatedAt: new Date('2024-01-18T14:20:00'),
  },
  {
    id: 'wish-005',
    userId: 'user-005',
    userName: '林志偉',
    productName: 'Nintendo Switch OLED',
    description: '想要購買遊戲主機',
    category: '遊戲娛樂',
    expectedPrice: 9500,
    currency: 'TWD',
    wishCount: 22,
    createdAt: new Date('2024-01-18T11:00:00'),
    updatedAt: new Date('2024-01-18T11:00:00'),
  },
  {
    id: 'wish-006',
    userId: 'user-006',
    userName: '黃雅婷',
    productName: 'Herman Miller Aeron 人體工學椅',
    description: '長時間辦公需要好的椅子',
    category: '辦公家具',
    expectedPrice: 45000,
    currency: 'TWD',
    wishCount: 8,
    createdAt: new Date('2024-01-17T16:45:00'),
    updatedAt: new Date('2024-01-17T16:45:00'),
  },
  {
    id: 'wish-007',
    userId: 'user-007',
    userName: '劉建國',
    productName: 'iPad Pro 12.9吋',
    description: '繪圖和筆記使用',
    category: '電子產品',
    expectedPrice: 32000,
    currency: 'TWD',
    wishCount: 15,
    createdAt: new Date('2024-01-17T13:30:00'),
    updatedAt: new Date('2024-01-17T13:30:00'),
  },
  {
    id: 'wish-008',
    userId: 'user-008',
    userName: '蔡美玲',
    productName: 'Vitamix 調理機',
    description: '健康飲食必備',
    category: '廚房用品',
    expectedPrice: 22000,
    currency: 'TWD',
    wishCount: 20,
    createdAt: new Date('2024-01-16T10:15:00'),
    updatedAt: new Date('2024-01-16T10:15:00'),
  },
  {
    id: 'wish-009',
    userId: 'user-009',
    userName: '許志明',
    productName: 'Bose QC45 降噪耳機',
    description: '需要高品質降噪耳機',
    category: '音響設備',
    expectedPrice: 10000,
    currency: 'TWD',
    wishCount: 28,
    createdAt: new Date('2024-01-16T08:00:00'),
    updatedAt: new Date('2024-01-16T08:00:00'),
  },
  {
    id: 'wish-010',
    userId: 'user-010',
    userName: '楊小華',
    productName: 'LG OLED 65吋電視',
    description: '家庭娛樂升級',
    category: '家電用品',
    expectedPrice: 55000,
    currency: 'TWD',
    wishCount: 10,
    createdAt: new Date('2024-01-15T17:30:00'),
    updatedAt: new Date('2024-01-15T17:30:00'),
  },
  {
    id: 'wish-011',
    userId: 'user-011',
    userName: '吳雅琴',
    productName: 'Garmin Fenix 7 運動手錶',
    description: '運動追蹤和健康管理',
    category: '運動用品',
    expectedPrice: 20000,
    currency: 'TWD',
    wishCount: 16,
    createdAt: new Date('2024-01-15T14:20:00'),
    updatedAt: new Date('2024-01-15T14:20:00'),
  },
  {
    id: 'wish-012',
    userId: 'user-012',
    userName: '趙大明',
    productName: 'DJI Mini 3 Pro 無人機',
    description: '空拍攝影需求',
    category: '攝影器材',
    expectedPrice: 28000,
    currency: 'TWD',
    wishCount: 14,
    createdAt: new Date('2024-01-14T12:00:00'),
    updatedAt: new Date('2024-01-14T12:00:00'),
  },
];

export function getMockWishProducts(
  filters?: WishProductFilter,
  pagination?: PaginationParams,
): WishProductsResponse {
  let filteredProducts = [...mockProducts];

  // 套用篩選條件
  if (filters) {
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category,
      );
    }
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.expectedPrice >= filters.minPrice!,
      );
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.expectedPrice <= filters.maxPrice!,
      );
    }

    // 排序
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';

    filteredProducts.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'createdAt':
          compareValue = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'wishCount':
          compareValue = a.wishCount - b.wishCount;
          break;
        case 'expectedPrice':
          compareValue = a.expectedPrice - b.expectedPrice;
          break;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
  }

  // 分頁處理
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 12;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  return {
    data: paginatedProducts,
    total: filteredProducts.length,
    page,
    pageSize,
    totalPages,
  };
}

// 取得所有類別
export function getCategories(): string[] {
  const categories = new Set(mockProducts.map((p) => p.category));
  return Array.from(categories).sort();
}
