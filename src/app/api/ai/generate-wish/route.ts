import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function POST(req: NextRequest) {
  try {
    const { name, categoryId, region, additionalInfo } = await req.json();

    if (!name || !categoryId || !region) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: '缺少必要欄位：商品名稱、類別、地區' },
        },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFIG_ERROR', message: '缺少 GEMINI_API_KEY' } },
        { status: 500 },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const userPrompt = `
你是一個電商代購平台助手。請用繁體中文為以下許願資料估算合理的期望價格（整數，新台幣區間內）並產生一段精煉描述（2-4 句），只輸出 JSON，格式如下：
{"expectedPrice": 整數, "description": "文字"}

資料：
- 商品名稱: ${name}
- 類別ID: ${categoryId}
- 地區: ${region}
- 補充: ${additionalInfo || '無'}
`;

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 256,
        },
      }),
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { success: false, error: { code: 'GEMINI_ERROR', message: text } },
        { status: res.status },
      );
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let payload: any = null;
    try {
      payload = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        payload = JSON.parse(match[0]);
      }
    }

    const expectedPrice = Number.parseInt(payload?.expectedPrice, 10);
    const description = String(payload?.description || '').trim();

    if (!Number.isFinite(expectedPrice) || !description) {
      return NextResponse.json(
        { success: false, error: { code: 'PARSE_ERROR', message: 'AI 回傳資料格式不正確' } },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { expectedPrice, description },
    });
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError';
    return NextResponse.json(
      {
        success: false,
        error: {
          code: isAbort ? 'TIMEOUT' : 'SERVER_ERROR',
          message: isAbort ? 'AI 生成逾時，請重試' : err?.message || '未知錯誤',
        },
      },
      { status: isAbort ? 504 : 500 },
    );
  }
}


