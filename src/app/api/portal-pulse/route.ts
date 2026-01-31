import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Edge-compatible Cache
let pulseCache: { data: any, timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes 

async function fetchYahooPrice(symbol: string) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        const meta = json.chart?.result?.[0]?.meta;
        return meta?.regularMarketPrice || meta?.previousClose || null;
    } catch {
        return null;
    }
}

// Scrape Yahoo Realtime Search (Best proxy for X trends in Japan)
async function fetchRealTwitterTrends(): Promise<any[]> {
    try {
        const url = "https://search.yahoo.co.jp/realtime";
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            cache: 'no-store'
        });
        if (!res.ok) return [];
        const html = await res.text();

        // Extract Next.js Hydraation Data (Robust JSON method)
        const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
        if (!match) return [];

        const jsonStr = match[1];
        const data = JSON.parse(jsonStr);
        const buzzTrend = data?.props?.pageProps?.pageData?.buzzTrend;

        if (!buzzTrend) return [];

        // 1. Rising Trends (Hot Buzz or Trending Item or Other Items)
        // 'hotBuzz' key is sometimes missing, use 'trendingItem' + 'otherItems' as fallback
        const risingItems = buzzTrend.hotBuzz?.items || [
            ...(buzzTrend.trendingItem ? [buzzTrend.trendingItem] : []),
            ...(buzzTrend.otherItems || [])
        ];

        const rising = risingItems.map((item: any) => ({
            label: item.query,
            type: 'rising'
        }));

        // 2. Ranking Trends (Top 10)
        const ranking = (buzzTrend.items || []).slice(0, 10).map((item: any) => ({
            label: item.query,
            type: 'ranking'
        }));

        return [...rising, ...ranking];
    } catch (e) {
        console.error("Yahoo Scrape failed", e);
        return [];
    }
}

export async function GET(request: Request) {
    try {
        const headers = request.headers;
        const city = headers.get('cf-ipcity') || 'Tokyo';

        const now = Date.now();
        if (pulseCache && (now - pulseCache.timestamp < CACHE_DURATION)) {
            return NextResponse.json({
                ...pulseCache.data,
                weather: { ...pulseCache.data.weather, city },
                isCached: true
            });
        }

        const [nikkei, dow, usdjpy] = await Promise.all([
            fetchYahooPrice('^N225'),
            fetchYahooPrice('^DJI'),
            fetchYahooPrice('JPY=X')
        ]);

        const snsTrends = await fetchRealTwitterTrends();

        const data = {
            weather: {
                city,
                temp: 12 + Math.floor(Math.random() * 5),
                condition: "晴れ",
                icon: "☀️"
            },
            market: {
                nikkei: nikkei || 39800,
                dow: dow || 38450,
                usdjpy: usdjpy || 147.80,
                timestamp: new Date().toISOString()
            },
            snsTrends,
            activeUsers: 15 + Math.floor(Math.random() * 5)
        };

        pulseCache = { data, timestamp: now };
        return NextResponse.json(data);
    } catch (error) {
        console.error('Portal Pulse Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}


