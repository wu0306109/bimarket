#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 類別對應表
const categoryMap = {
  '電子產品': 1,
  '服飾配件': 2,
  '美妝保養': 3,
  '食品飲料': 4,
  '居家生活': 5,
  '運動健身': 6,
  '圖書文具': 7,
  '玩具遊戲': 8,
  '其他': 9,
  '攝影器材': 1, // 歸類為電子產品
  '家電用品': 5, // 歸類為居家生活
  '遊戲娛樂': 8, // 歸類為玩具遊戲
  '辦公家具': 5, // 歸類為居家生活
  '廚房用品': 5, // 歸類為居家生活
  '音響設備': 1, // 歸類為電子產品
};

// 範例資料
const mockProducts = [
  {
    name: 'iPhone 15 Pro Max',
    description: '想購買最新款 iPhone，希望能找到好價格。需要 256GB 以上容量，顏色不限。',
    category: '電子產品',
    region: '美國',
    additionalInfo: '希望是全新未拆封，需要提供購買證明',
    status: 'completed'
  },
  {
    name: 'Sony A7 IV 相機',
    description: '專業攝影需求，希望找到好價格。需要單機身或含基本鏡頭套組。',
    category: '攝影器材',
    region: '日本',
    additionalInfo: '最好能附贈相機包和記憶卡',
    status: 'completed'
  },
  {
    name: 'Dyson V15 吸塵器',
    description: '家用清潔需求，希望團購。需要完整配件組，包含各種吸頭。',
    category: '家電用品',
    region: '英國',
    additionalInfo: '希望有中文說明書，保固至少一年',
    status: 'completed'
  },
  {
    name: 'Nintendo Switch OLED',
    description: '想要購買遊戲主機，最好能附贈一些熱門遊戲。',
    category: '遊戲娛樂',
    region: '日本',
    additionalInfo: '希望是日版或台版，需要保護貼和收納包',
    status: 'pending'
  },
  {
    name: 'Herman Miller Aeron 人體工學椅',
    description: '長時間辦公需要好的椅子，希望是正品，size B 或 C。',
    category: '辦公家具',
    region: '美國',
    additionalInfo: '需要完整保固，最好是近期生產',
    status: 'completed'
  },
  {
    name: 'iPad Pro 12.9吋',
    description: '繪圖和筆記使用，需要搭配 Apple Pencil。希望是 M2 晶片版本。',
    category: '電子產品',
    region: '美國',
    additionalInfo: '需要 WiFi + Cellular 版本，256GB 以上',
    status: 'completed'
  },
  {
    name: 'Vitamix 調理機',
    description: '健康飲食必備，希望是最新款 A3500 或 A2500 型號。',
    category: '廚房用品',
    region: '美國',
    additionalInfo: '需要中文食譜，110V 電壓',
    status: 'pending'
  },
  {
    name: 'Bose QC45 降噪耳機',
    description: '需要高品質降噪耳機，用於通勤和工作。',
    category: '音響設備',
    region: '美國',
    additionalInfo: '黑色優先，需要原廠收納盒',
    status: 'completed'
  },
  {
    name: 'LG OLED 65吋電視',
    description: '家庭娛樂升級，希望是 C3 或 G3 系列。',
    category: '家電用品',
    region: '韓國',
    additionalInfo: '需要支援台灣數位電視規格',
    status: 'pending'
  },
  {
    name: 'Patagonia 戶外背包',
    description: '登山健行使用，需要 40-50L 容量。',
    category: '運動健身',
    region: '美國',
    additionalInfo: '防水材質，顏色不限',
    status: 'completed'
  },
  {
    name: 'SK-II 神仙水',
    description: '保養品團購，希望是 230ml 大瓶裝。',
    category: '美妝保養',
    region: '日本',
    additionalInfo: '需要最新批號，確保是正品',
    status: 'completed'
  },
  {
    name: 'Lego 創意系列積木',
    description: '收藏用，希望是限量版或絕版品。',
    category: '玩具遊戲',
    region: '丹麥',
    additionalInfo: '全新未拆封，需要原廠封條',
    status: 'pending'
  },
  {
    name: 'Montblanc 萬寶龍鋼筆',
    description: '商務禮品需求，希望是經典款 Meisterstück 系列。',
    category: '圖書文具',
    region: '德國',
    additionalInfo: '需要禮盒包裝和保證書',
    status: 'completed'
  },
  {
    name: '日本薯條三兄弟',
    description: '北海道限定零食，想要團購一箱。',
    category: '食品飲料',
    region: '日本',
    additionalInfo: '需要最新製造日期，常溫配送',
    status: 'completed'
  },
  {
    name: 'Nike Air Jordan 1 復古鞋',
    description: '收藏用，希望是 Chicago 配色或其他經典配色。',
    category: '服飾配件',
    region: '美國',
    additionalInfo: 'US 10.5 尺寸，需要鞋盒完整',
    status: 'pending'
  }
];

// 讀取現有的 CSV 資料
const csvPath = path.join(__dirname, '..', 'data', 'wish-products.csv');
let existingData = fs.readFileSync(csvPath, 'utf-8');
const lines = existingData.trim().split('\n');
const header = lines[0];
const existingRows = lines.slice(1);

// 產生新的資料行
const newRows = mockProducts.map(product => {
  const id = uuidv4();
  const now = new Date().toISOString();
  const categoryId = categoryMap[product.category] || 9;
  
  // CSV 格式：id,name,description,category_id,region,additional_info,image_urls,status,user_id,created_at,updated_at
  const row = [
    `"${id}"`,
    `"${product.name}"`,
    `"${product.description}"`,
    `"${product.region}"`,
    `"${product.status}"`,
    '""', // image_urls
    `"${now}"`,
    `"${now}"`,
    `"${categoryId}"`,
    `"${product.additionalInfo}"`,
    '""' // user_id
  ].join(',');
  
  return row;
});

// 合併資料
const allRows = [...existingRows, ...newRows];
const finalContent = [header, ...allRows].join('\n');

// 寫入檔案
fs.writeFileSync(csvPath, finalContent);

console.log(`✅ 成功加入 ${newRows.length} 筆許願商品資料`);
console.log(`📁 檔案位置: ${csvPath}`);
console.log(`📊 目前總共有 ${allRows.length} 筆資料`);