# 使用官方 Node.js 映像作為基礎映像
FROM node:20-alpine AS base

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production && npm cache clean --force

# 複製應用程式代碼
COPY . .

# 建立必要的目錄
RUN mkdir -p data/backups uploads/wish-products

# 初始化 CSV 資料檔案
RUN npm run init-csv

# 建立 Next.js 應用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 設定環境變數
ENV NODE_ENV=production
ENV DATA_PATH=./data
ENV UPLOAD_PATH=./uploads
ENV MAX_FILE_SIZE=5242880
ENV CACHE_TTL=300000

# 建立非 root 用戶
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 設定檔案權限
RUN chown -R nextjs:nodejs /app
USER nextjs

# 啟動應用
CMD ["npm", "start"]