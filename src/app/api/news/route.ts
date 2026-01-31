import { NextResponse } from 'next/server';
import { fetchRSSNews } from '@/lib/rss-parser';

export const dynamic = 'force-dynamic';

/**
 * Bestie+ Personalized News API
 * 
 * RSSフィードベースのニュース取得システム
 * カテゴリ検出とLionBrainパーソナライゼーション対応
 */

// サーバーサイド・キャッシュ (10分保持)
let cachedData: any = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 10 * 60 * 1000;

export async function GET() {
    const now = Date.now();

    // キャッシュチェック
    if (cachedData && (now - lastFetchTime < CACHE_DURATION)) {
        console.log(`[News API] Serving from cache (${Math.floor((CACHE_DURATION - (now - lastFetchTime)) / 1000)}s remaining)`);
        return NextResponse.json(cachedData);
    }

    try {
        console.log("[News API] Fetching fresh data...");
        // RSSフィードから記事を取得（カテゴリ情報付き）
        const allArticles = await fetchRSSNews();

        const responseData = {
            status: "success",
            results: allArticles,
            timestamp: now
        };

        cachedData = responseData;
        lastFetchTime = now;

        return NextResponse.json(responseData);
    } catch (error: any) {
        console.error("RSS fetch error:", error);
        return NextResponse.json({
            status: "error",
            message: `RSS fetch failed: ${error.message}`,
            results: []
        }, { status: 500 });
    }
}


