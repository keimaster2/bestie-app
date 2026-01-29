import { Product } from "./types";
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
  const query = categoryId === "1" ? "人気" : ""; 
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${appId}&query=${encodeURIComponent(query)}&sort=-sold&results=30${categoryId !== "1" ? `&genre_category_id=${categoryId}` : ""}`;
  
  try {
    if (appId === "DUMMY_ID") return mockYahooData as unknown as Record<string, unknown>[];

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
        console.error(`Yahoo Search API Error: ${res.status}`);
        return [];
    }
    const data = await res.json();
    return (data.hits || []) as Record<string, unknown>[];
  } catch (error) {
    console.error("Failed to fetch Yahoo ranking via API:", error);
    return [];
  }
}

export async function searchYahooItems(keyword: string, categoryId: string = "1"): Promise<Record<string, unknown>[]> {
  const appId = getYahooAppId();
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${appId}&query=${encodeURIComponent(keyword)}&results=30${categoryId !== "1" ? `&genre_category_id=${categoryId}` : ""}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return (data.hits || []) as Record<string, unknown>[]; 
  } catch { return []; }
}

const mockYahooData = [
  { rank: 1, name: "モック商品1", code: "m1", price: 1000, image: { medium: "" }, review: { rate: 4.5, count: 100 }, seller: { name: "店" }, url: "#", headLine: "キャッチコピー" },
];

export function convertYahooToProduct(items: Record<string, unknown>[], isRanking: boolean): Product[] {
  return items.map((item, index) => {
    const title = (item.name as string) || "";
    const cleanTitle = title.replace(/【.*?】/g, "").replace(/\[.*?\]/g, "").replace(/返品種別[A-Z]?/g, "").trim();
    const price = (item.price as number) || 0;
    
    // 🚀 超・高画質化ハック: プレースホルダ(/i/g/)ではなくオリジナル画像(/i/n/)を取得
    const imageObj = item.image as Record<string, string> | undefined;
    let image = imageObj?.medium || "/placeholder.svg";
    if (image.includes("/i/g/")) {
      image = image.replace("/i/g/", "/i/n/");
    } else if (image.includes("/i/l/")) {
      image = image.replace("/i/l/", "/i/n/");
    }

    const reviewObj = item.review as Record<string, number> | undefined;
    const rating = reviewObj?.rate || 0;
    const reviewCount = reviewObj?.count || 0;
    const code = (item.code as string) || `item-${index}`;
    const storeObj = item.seller as Record<string, string> | undefined;
    const shopName = storeObj?.name || "Yahoo!ショッピング";
    const url = (item.url as string) || "#";
    const catchphrase = (item.headLine as string) || "";

    return {
      id: `yahoo-${code}`,
      rank: isRanking ? (index + 1) : undefined,
      title: cleanTitle,
      price: price,
      rating: typeof rating === 'string' ? parseFloat(rating) : rating,
      reviewCount: typeof reviewCount === 'string' ? parseInt(reviewCount) : reviewCount,
      image: image,
      mall: "Yahoo",
      shopName: shopName,
      url: url,
      catchphrase: catchphrase,
    };
  });
}
