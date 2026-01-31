import { NextResponse } from 'next/server';
import { fetchMatomeArticles } from '@/lib/matome-rss';

export const dynamic = 'force-dynamic';

// Server-side cache (5 minutes)
let cachedData: any = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export async function GET() {
    const now = Date.now();

    // Check cache
    if (cachedData && (now - lastFetchTime < CACHE_DURATION)) {
        console.log(`[Matome API] Serving from cache (${Math.floor((CACHE_DURATION - (now - lastFetchTime)) / 1000)}s remaining)`);
        return NextResponse.json(cachedData);
    }

    try {
        console.log("[Matome API] Fetching fresh data...");
        // Fetch matome articles from RSS feeds
        const articles = await fetchMatomeArticles();

        const responseData = {
            status: "success",
            results: articles,
            timestamp: now
        };

        cachedData = responseData;
        lastFetchTime = now;

        return NextResponse.json(responseData);
    } catch (error: any) {
        console.error("Matome RSS fetch error:", error);
        return NextResponse.json({
            status: "error",
            message: `Matome fetch failed: ${error.message}`,
            results: []
        }, { status: 500 });
    }
}


