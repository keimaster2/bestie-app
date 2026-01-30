import type { Product } from "./types";
import { getRequestContext } from '@cloudflare/next-on-pages';

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

  // V3 Search APIを使用 (V2 Rankingが不安定なため、売れている順で代用)
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${appId}&genre_category_id=${categoryId}&sort=-sold&results=30`;

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

export function convertYahooToProduct(items: Record<string, unknown>[], isRanking: boolean): Product[] {
  return items.map((item, index) => {
    // V3は小文字開始、V2ランキングは多くが大文字開始
    const name = (item.name as string) || (item.Name as string) || "";
    const cleanTitle = name.replace(/【.*?】/g, "").replace(/\[.*?\]/g, "").replace(/返品種別[A-Z]?/g, "").trim();

    // 価格の取得 (V3: price, V2: Price._value)
    let price = 0;
    if (typeof item.price === "number") {
      price = item.price;
    } else if (item.Price && typeof item.Price === "object") {
      const p = item.Price as any;
      price = parseInt(p._value || p.toString() || "0");
    } else if (item.price) {
      price = parseInt(item.price.toString());
    }

    // 画像の取得 (V3: image.medium, V2: Image.Medium)
    const imageObj = (item.image || item.Image) as any;
    let image = imageObj?.medium || imageObj?.Medium || "/placeholder.svg";
    if (image.includes("/i/g/")) {
      image = image.replace("/i/g/", "/i/n/");
    } else if (image.includes("/i/l/")) {
      image = image.replace("/i/l/", "/i/n/");
    }

    // レビューの取得 (V3: review.rate, V2: Review.Rate)
    const reviewObj = (item.review || item.Review) as any;
    const rating = reviewObj?.rate || reviewObj?.Rate || 0;
    const reviewCount = reviewObj?.count || reviewObj?.Count || 0;

    // コード・URL・ショップ名の取得
    const code = (item.code as string) || (item.Code as string) || `item-${index}`;
    const storeObj = (item.seller || item.Store) as any;
    const shopName = storeObj?.name || storeObj?.Name || "Yahoo!ショッピング";
    const url = (item.url as string) || (item.Url as string) || "#";
    const catchphrase = (item.headLine as string) || (item.HeadLine as string) || "";

    return {
      id: `yahoo-${code}`,
      rank: isRanking ? (index + 1) : undefined,
      title: cleanTitle,
      price: price,
      rating: typeof rating === "string" ? parseFloat(rating) : rating,
      reviewCount: typeof reviewCount === "string" ? parseInt(reviewCount) : reviewCount,
      image: image,
      mall: "Yahoo",
      shopName: shopName,
      url: url,
      catchphrase: catchphrase,
    };
  });
}
