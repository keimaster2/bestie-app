import { Product } from "./types";
import { getRequestContext } from '@cloudflare/next-on-pages';

// 楽天APIの型定義
export type RakutenItem = {
  Item: {
    rank: number;
    itemName: string;
    itemCode: string;
    itemPrice: string;
    itemUrl: string;
    mediumImageUrls: { imageUrl: string }[];
    reviewCount: number;
    reviewAverage: string;
    shopName: string;
    genreId: string;
    itemCaption?: string; // 商品説明文（キャッチコピーとして流用）
  };
};

export type RakutenRankingResponse = {
  Items: RakutenItem[];
};

const getRakutenAppId = (): string => {
  try {
    const ctx = getRequestContext();
    if (ctx && ctx.env) {
      return (ctx.env as Record<string, string>).RAKUTEN_APP_ID || process.env.RAKUTEN_APP_ID || "DUMMY_ID";
    }
  } catch {
    // ignore
  }
  return process.env.RAKUTEN_APP_ID || "DUMMY_ID";
};

/**
 * 楽天ランキングを取得
 */
export async function fetchRakutenRanking(genreId: string = "0"): Promise<RakutenItem[]> {
  const appId = getRakutenAppId();
  
  // フィルターなしの純粋なランキングAPIを叩く
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?format=json&applicationId=${appId}&genreId=${genreId}`;

  try {
    if (appId === "DUMMY_ID") return mockRakutenData;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Rakuten API Error: ${res.status}`);

    const data: RakutenRankingResponse = await res.json();
    return data.Items.sort((a, b) => a.Item.rank - b.Item.rank);
  } catch (error) {
    console.error("Failed to fetch Rakuten ranking via API:", error);
    return [];
  }
}

export async function searchRakutenItems(keyword: string, genreId: string = "0"): Promise<RakutenItem[]> {
  if (!keyword) return [];
  const appId = getRakutenAppId();
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?format=json&keyword=${encodeURIComponent(keyword)}&hits=30&sort=standard&applicationId=${appId}&genreId=${genreId}`;
  try {
    const res = await fetch(url); 
    if (!res.ok) return [];
    const data = await res.json() as RakutenRankingResponse;
    return data.Items;
  } catch { return []; }
}

const mockRakutenData: RakutenItem[] = [
  { Item: { rank: 1, itemName: "モック楽天1", itemCode: "r1", itemPrice: "1000", itemUrl: "#", mediumImageUrls: [], reviewCount: 100, reviewAverage: "4.5", shopName: "テスト楽天ショップ", genreId: "0", itemCaption: "楽天店長おすすめの逸品です！" } },
];

export function convertRakutenToProduct(items: RakutenItem[], isRanking: boolean): Product[] {
  return items.map((item) => {
    const i = item.Item;
    let imageUrl = i.mediumImageUrls.length > 0 ? i.mediumImageUrls[0].imageUrl : "/placeholder.svg";
    if (imageUrl.startsWith("http://")) imageUrl = imageUrl.replace("http://", "https://");
    if (imageUrl.includes("?_ex=")) imageUrl = imageUrl.replace(/\?_ex=.*$/, "?_ex=400x400");

    // itemCaptionから最初の1文を抽出（または適当な長さで切る）
    const catchphrase = i.itemCaption ? i.itemCaption.split(/[。！\n]/)[0].substring(0, 60) : "";

    return {
      id: `rakuten-${i.itemCode}`,
      rank: isRanking ? i.rank : undefined,
      title: i.itemName,
      price: parseInt(i.itemPrice),
      rating: parseFloat(i.reviewAverage),
      reviewCount: i.reviewCount,
      image: imageUrl,
      mall: "Rakuten",
      shopName: i.shopName,
      url: i.itemUrl,
      catchphrase: catchphrase,
    };
  });
}
