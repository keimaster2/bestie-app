import { Product } from "./types";
import { getRequestContext } from '@cloudflare/next-on-pages';

// Yahoo!ショッピングAPIの型定義（必要な部分だけ）
export type YahooItem = {
  code: string;
  name: string;
  price: number;
  url: string;
  image: { medium: string };
  review: { rate: number; count: number };
  store: { name: string };
  description?: string;
};

export type YahooRankingResponse = {
  shopping_area_ranking_result: {
    name: string;
    items: YahooItem[];
  };
};

const getYahooAppId = () => {
  return (getRequestContext().env as any)?.YAHOO_APP_ID || process.env.YAHOO_APP_ID || "DUMMY_ID";
};

// Yahoo!のランキングを取得
export async function fetchYahooRanking(categoryId: string = "1", minPrice?: number): Promise<YahooItem[]> {
  const appId = getYahooAppId();
  // 安全策として、検索APIを使って「売上順」で取得する
  // V3 itemSearch はパラメータがシビアなので、最小構成にする
  
  // カテゴリごとの除外キーワード設定（ノイズ除去）
  const negativeKeywords: Record<string, string> = {
    "2502": "-ケース -カバー -フィルム -修理 -部品 -互換 -パーツ", // デバイス本体を優先
    "2498": "-ふるさと納税 -定期便", // グルメ
    "2511": "-返品種別 -中古 -ジャンク -プリペイド -ポイント -ギフト券", // おもちゃ・ホビー
  };

  const excludeQuery = negativeKeywords[categoryId] || "";

  // 総合(1)の場合はキーワードのみ、カテゴリ指定の場合はカテゴリ+ベースキーワード
  const query = categoryId === "1" ? "人気" : "人気"; // "ゲーム 人気"など特定のワードを外してランキング本来の動きに任せる
  const categoryParam = categoryId === "1" 
    ? `&query=${encodeURIComponent(query)}`
    : `&genre_category_id=${categoryId}&query=${encodeURIComponent(query + " " + excludeQuery)}`;
  
  const priceParam = minPrice ? `&price_from=${minPrice}` : "";
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${appId}${categoryParam}${priceParam}&sort=-sold&results=30`;
  console.log(`Yahoo API URL: ${url}`);

  try {
    if (appId === "DUMMY_ID") {
      console.log("Using Mock Data for Yahoo API");
      return mockYahooData;
    }

    const res = await fetch(url, { 
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      console.error(`Yahoo Ranking (Search) API Error: ${res.status} ${res.statusText}`);
      return []; // エラー時は空配列を返して画面を落とさない
    }

    const data = await res.json();
    return data.hits || [];
    
  } catch (error) {
    console.error("Failed to fetch Yahoo ranking:", error);
    // 失敗時はモックデータを返してでも画面を表示させる（UX優先）
    return mockYahooData;
  }
}

// Yahoo!の商品検索
export async function searchYahooItems(keyword: string): Promise<YahooItem[]> {
  if (!keyword) return [];

  const appId = getYahooAppId();
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${appId}&query=${encodeURIComponent(keyword)}&results=30`;

  try {
    if (appId === "DUMMY_ID") {
      return mockYahooData;
    }

    const res = await fetch(url, { next: { revalidate: 60 } }); 
    if (!res.ok) return [];
    const data = await res.json();
    return data.hits || []; 
  } catch (error) {
    console.error("Failed to search Yahoo items:", error);
    return [];
  }
}

// 商品コードから1件取得
export async function getYahooItem(itemCode: string): Promise<YahooItem | null> {
  const appId = getYahooAppId();
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${appId}&query=${encodeURIComponent(itemCode)}&results=1`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.hits && data.hits.length > 0 ? data.hits[0] : null;
  } catch (error) {
    console.error("Failed to get Yahoo item:", error);
    return null;
  }
}

// 開発用のモックデータ
const mockYahooData: YahooItem[] = [
  {
    code: "yahoo-1",
    name: "【Yahoo1位】水 2リットル 12本 ミネラルウォーター 自然の恵み 天然水 軟水",
    price: 1280,
    url: "#",
    image: { medium: "https://item-shopping.c.yimg.jp/i/n/soukai_4902102119184" }, 
    review: { rate: 4.5, count: 1200 },
    store: { name: "Yahoo!ドリンク専門店" }
  },
  {
    code: "yahoo-2",
    name: "【Yahoo2位】割れチョコ 訳あり 1kg 自由が丘 チュベ・ド・ショコラ クーベルチュール",
    price: 3480,
    url: "#",
    image: { medium: "https://item-shopping.c.yimg.jp/i/n/jiyugaokachoco_710" },
    review: { rate: 4.7, count: 890 },
    store: { name: "蒲屋忠兵衛商店" }
  },
];

// Yahooデータを統一フォーマットに変換
export function convertYahooToProduct(items: YahooItem[], isRanking: boolean): Product[] {
  return items.map((item, index) => {
    // 商品名クリーニング: 【返品種別B】などのノイズを除去
    let title = item.name;
    title = title.replace(/【.*?】/g, "").replace(/\[.*?\]/g, ""); // 【】や[]で囲まれた部分を削除
    title = title.replace(/返品種別[A-Z]?/g, ""); // "返品種別B" などを削除
    title = title.trim();

    // Yahooの画像はいくつかサイズがあるがmediumを使う
    return {
      id: `yahoo-${item.code}`,
      rank: isRanking ? index + 1 : undefined, // Yahooは配列順が順位
      title: title,
      price: item.price,
      rating: item.review?.rate || 0,
      reviewCount: item.review?.count || 0,
      image: item.image?.medium || "/placeholder.svg",
      mall: "Yahoo",
      shopName: item.store?.name || "Yahoo!ショッピング",
      url: item.url,
    };
  });
}
