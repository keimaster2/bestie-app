import type { Product } from "./types";
import { getRequestContext } from '@cloudflare/next-on-pages';
import { RANKING_CACHE } from "@/data/cache";

// Yahoo!ショッピングAPIの型定義
export type YahooItem = {
  code: string;
  name: string;
  price: number;
  url: string;
  image: { medium: string };
  review: { rate: number; count: number };
  seller: { name: string };
  headLine?: string;
};

const getYahooAppId = (): string => {
  try {
    const ctx = getRequestContext();
    if (ctx && ctx.env) {
      return (ctx.env as Record<string, string>).YAHOO_APP_ID || process.env.YAHOO_APP_ID || "DUMMY_ID";
    }
  } catch {
    // ignore
  }
  return process.env.YAHOO_APP_ID || "DUMMY_ID";
};

/**
 * Yahoo!ショッピングAPIを使用してランキング商品を取得
 */
export async function fetchYahooRanking(categoryId: string = "1", _minPrice?: number): Promise<Record<string, unknown>[]> {
  const appId = getYahooAppId();

  // V3 Search APIを使用
  // 総合ランキング(categoryId=1)の場合、クエリなしでは結果が不安定なため、
  // "-review_count" (人気順) でソートし、categoryId=1 の場合は広範なキーワードを付与
  const query = categoryId === "1" ? "&query=" + encodeURIComponent("人気") : "";
  const sort = "-review_count";
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${appId}${query}&genre_category_id=${categoryId}&sort=${sort}&results=30`;

  try {
    if (appId === "DUMMY_ID") return mockYahooData as unknown as Record<string, unknown>[];

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'BestieApp/1.0 (Compatible; Mozilla/5.0)'
      }
    });

    if (!res.ok) {
      console.error(`Yahoo API Error: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return (data.hits || []) as Record<string, unknown>[];
  } catch (error) {
    console.error("Failed to fetch Yahoo items via API:", error);
    return [];
  }
}

export async function searchYahooItems(keyword: string, categoryId: string = "1"): Promise<Record<string, unknown>[]> {
  const appId = getYahooAppId();

  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${appId}&query=${encodeURIComponent(keyword)}&results=30${categoryId !== "1" ? `&genre_category_id=${categoryId}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BestieApp/1.0 (Compatible; Mozilla/5.0)'
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.hits || []) as Record<string, unknown>[];
  } catch { return []; }
}

const mockYahooData = [
  { rank: 1, name: "モック商品1", code: "m1", price: 1000, image: { medium: "" }, review: { rate: 4.5, count: 100 }, seller: { name: "店" }, url: "#", headLine: "キャッチコピー" },
];

export { convertYahooToProduct } from "./yahoo-client";
