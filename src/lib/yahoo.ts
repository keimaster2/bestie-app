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

const YAHOO_APP_ID = process.env.YAHOO_APP_ID || "DUMMY_ID";

// Yahoo!のランキングを取得
export async function fetchYahooRanking(categoryId: string = "1"): Promise<YahooItem[]> {
  // 安全策として、検索APIを使って「売上順」で取得する
  // V3 itemSearch はパラメータがシビアなので、最小構成にする
  
  // "1" (総合) の場合、category_id=1 はエラーになることがあるため、
  // カテゴリ指定なしで、広範なクエリ（例: " "）を送るか、
  // もしくは queryパラメータなしで genre_category_id を送らない（動くか不明）
  // 試しに query=売れ筋 を設定する
  const categoryParam = categoryId === "1" 
    ? "&query=%E9%80%81%E6%96%99%E7%84%A1%E6%96%99" // "送料無料"
    : `&genre_category_id=${categoryId}`;
  
  // sort=-sold が効かない場合もあるので、sortパラメータなし（標準）も検討するが
  // まずはタイムアウトを防ぐため、fetchのタイムアウトを設定する
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${YAHOO_APP_ID}${categoryParam}&sort=-sold&results=30`;

  try {
    if (YAHOO_APP_ID === "DUMMY_ID") {
      console.log("Using Mock Data for Yahoo API");
      return mockYahooData;
    }

    // タイムアウト付きでfetch (5秒)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(url, { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
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

  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${YAHOO_APP_ID}&query=${encodeURIComponent(keyword)}&results=30`;

  try {
    if (YAHOO_APP_ID === "DUMMY_ID") {
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
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${YAHOO_APP_ID}&query=${encodeURIComponent(itemCode)}&results=1`;

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
    image: { medium: "https://item-shopping.c.yimg.jp/i/n/sample_1" }, 
    review: { rate: 4.5, count: 1200 },
    store: { name: "Yahoo!ドリンク専門店" }
  },
  {
    code: "yahoo-2",
    name: "【Yahoo2位】割れチョコ 訳あり 1kg 自由が丘 チュベ・ド・ショコラ クーベルチュール",
    price: 3480,
    url: "#",
    image: { medium: "https://item-shopping.c.yimg.jp/i/n/sample_2" },
    review: { rate: 4.7, count: 890 },
    store: { name: "蒲屋忠兵衛商店" }
  },
];
