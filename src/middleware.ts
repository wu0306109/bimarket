import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 處理靜態檔案請求 /uploads/*
  // 注意：在 Edge Runtime 中，我們不能直接處理文件系統
  // 這個功能應該移到 API route 中處理
  if (pathname.startsWith('/uploads/')) {
    // 重寫到專門的文件服務 API route
    const url = request.nextUrl.clone();
    url.pathname = `/api/serve-file${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/uploads/:path*'],
};
