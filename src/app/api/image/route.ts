import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    // 画像をフェッチ
    const response = await fetch(imageUrl, {
      headers: {
        // 一般的なブラウザのUser-Agentを偽装してアクセス
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      return new NextResponse("Failed to fetch image", { status: response.status });
    }

    // 画像データを取得
    const arrayBuffer = await response.arrayBuffer();
    const headers = new Headers();
    
    // 元のレスポンスのContent-Typeを継承（または推測）
    const contentType = response.headers.get("content-type") || "image/jpeg";
    headers.set("Content-Type", contentType);
    
    // キャッシュ設定（重要：毎回Amazonに取りに行くと遅い＆バレるので）
    headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400"); // 1日キャッシュ

    return new NextResponse(arrayBuffer, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
