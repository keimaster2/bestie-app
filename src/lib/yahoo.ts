// Yahoo!ショッピングAPIの型定義（必要な部分だけ）
export type YahooItem = {
  code: string;
  name: string;
  price: number;
  url: string;
  image: { medium: string };
  review: { rate: number; count: number };
  store: { name: string };
};

export type YahooRankingResponse = {
  shopping_area_ranking_result: {
    name: string;
    items: YahooItem[];
  };
};

const YAHOO_APP_ID = process.env.YAHOO_APP_ID || "DUMMY_ID";

// Yahoo!のランキングを取得（検索APIの売れ筋順で代用）
export async function fetchYahooRanking(categoryId: string = "1"): Promise<YahooItem[]> {
  // V3 商品検索APIで、カテゴリ指定 + 売上順ソートを使う
  // category_id: カテゴリID
  // sort: -sold (売れている順 = ランキング相当)
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${YAHOO_APP_ID}&genre_category_id=${categoryId}&sort=-sold&results=30`;

  try {
    if (YAHOO_APP_ID === "DUMMY_ID") {
      console.log("Using Mock Data for Yahoo API");
      return mockYahooData;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      console.error(`Yahoo Ranking (Search) API Error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return data.hits || [];
    
  } catch (error) {
    console.error("Failed to fetch Yahoo ranking:", error);
    return [];
  }
}

// Yahoo!の商品検索
export async function searchYahooItems(keyword: string): Promise<YahooItem[]> {
  if (!keyword) return [];

  // V3 APIのエンドポイント（商品検索）
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${YAHOO_APP_ID}&query=${encodeURIComponent(keyword)}&results=30`;

  try {
    if (YAHOO_APP_ID === "DUMMY_ID") {
      console.log("Using Mock Data for Yahoo Search");
      return mockYahooData;
    }

    const res = await fetch(url, { next: { revalidate: 60 } }); // 検索はキャッシュ短め
    
    if (!res.ok) {
      console.error(`Yahoo Search API Error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.hits || []; 
  } catch (error) {
    console.error("Failed to search Yahoo items:", error);
    return [];
  }
}

// 開発用のモックデータ
const mockYahooData: YahooItem[] = [
  {
    code: "yahoo-1",
    name: "【Yahoo1位】水 2リットル 12本 ミネラルウォーター 自然の恵み 天然水 軟水",
    price: 1280,
    url: "#",
    image: { medium: "https://item-shopping.c.yimg.jp/i/n/sample_1" }, // 仮
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
