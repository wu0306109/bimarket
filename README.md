# Bimarket：基於 Next.js 與 Material UI

## 前置要求

1. Node.js 20+（含 npm）。
2. Docker 24+（若使用 Docker 執行）。

## 本地開發

1. 安裝相依套件：

```bash
npm install
```

2. 啟動開發伺服器：

```bash
npm run dev
```

開啟瀏覽器至 [http://localhost:3000](http://localhost:3000)。

可選：Storybook（元件預覽）

```bash
npm run storybook
```

## 以 Docker 執行

1. 建置映像檔：

```bash
docker build -t bimarket .
```

2. 啟動容器：

```bash
docker run --rm -p 3000:3000 bimarket
```

打開 [http://localhost:3000](http://localhost:3000) 查看結果。

## 目錄結構

```text
src/
  app/                 # Next.js App Router 的頁面與 layout
  ui/                  # UI 元件
  stories/             # Storybook stories
public/                # 靜態資源
```
