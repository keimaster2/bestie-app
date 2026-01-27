// 楽天APIの型定義（必要な部分だけ抜粋）
export type RakutenItem = {
  Item: {
    rank: number;
    itemName: string;
    itemCode: string; // 商品コード追加
    itemPrice: string;
    itemUrl: string;
    mediumImageUrls: { imageUrl: string }[];
    reviewCount: number;
    reviewAverage: string;
    shopName: string;
    genreId: string;
    itemCaption?: string; // 商品説明文
  };
};

export type RakutenRankingResponse = {
  Items: RakutenItem[];
  title: string;
};

// 主要ジャンルのID定義
export const RAKUTEN_GENRES = [
  { id: "", name: "総合" },
  { id: "100371", name: "レディース" }, // レディースファッション
  { id: "551177", name: "メンズ" },     // メンズファッション
  { id: "100227", name: "食品" },
  { id: "562637", name: "家電" },
  { id: "211742", name: "日用品" },     // 日用品雑貨・文房具・手芸
  { id: "100939", name: "コスメ" },     // 美容・コスメ・香水
  { id: "101240", name: "CD・DVD" },
  { id: "100026", name: "PC・周辺機器" },
  { id: "200162", name: "本・雑誌" },
];

// 楽天ブックスなどのジャンルID（今回は総合ランキングのテスト）
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || "DUMMY_ID"; 

export async function fetchRakutenRanking(genreId: string = ""): Promise<RakutenItem[]> {
  // 本番APIのエンドポイント
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?format=json&applicationId=${RAKUTEN_APP_ID}${genreId ? `&genreId=${genreId}` : ""}`;

  try {
    // IDが設定されていない場合はダミーデータを返す（開発用）
    if (RAKUTEN_APP_ID === "DUMMY_ID") {
      console.log("Using Mock Data for Rakuten API");
      return mockRakutenData;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } }); // 1時間キャッシュ
    
    if (!res.ok) {
      throw new Error(`Rakuten API Error: ${res.status}`);
    }

    const data: RakutenRankingResponse = await res.json();
    return data.Items;
  } catch (error) {
    console.error("Failed to fetch Rakuten ranking:", error);
    return [];
  }
}

// キーワード検索用の関数
export async function searchRakutenItems(keyword: string): Promise<RakutenItem[]> {
  if (!keyword) return [];
  
  // 商品検索APIのエンドポイント
  // hits=30: 30件取得
  // sort=standard: 標準順（売れ筋などを考慮）
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?format=json&keyword=${encodeURIComponent(keyword)}&hits=30&sort=standard&applicationId=${RAKUTEN_APP_ID}`;

  try {
    if (RAKUTEN_APP_ID === "DUMMY_ID") {
      console.log("Using Mock Data for Search (Simulated)");
      // ダミー環境でも少しそれっぽいデータを返す（モックデータを使い回す）
      return mockRakutenData;
    }

    // 検索結果は鮮度が大事なのでキャッシュ時間を短くする（またはno-store）
    const res = await fetch(url, { next: { revalidate: 60 } }); 
    
    if (!res.ok) {
      throw new Error(`Rakuten Search API Error: ${res.status}`);
    }

    const data: RakutenRankingResponse = await res.json(); // レスポンス形式は似ているので流用
    return data.Items;
  } catch (error) {
    console.error("Failed to search Rakuten items:", error);
    return [];
  }
}

// 商品コードから1件取得
export async function getRakutenItem(itemCode: string): Promise<RakutenItem | null> {
  // itemCode検索が不安定な場合、keywordパラメータにコードを渡すことで検索できる場合がある
  // itemCodeパラメータではなく、keywordパラメータを使う
  const encodedCode = encodeURIComponent(itemCode);
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?format=json&keyword=${encodedCode}&applicationId=${RAKUTEN_APP_ID}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    // 検索結果の先頭を返す
    // ただし、コード検索の場合は完全一致を確認するのが理想だが、楽天はコード検索精度が高いので一旦そのまま返す
    return data.Items && data.Items.length > 0 ? data.Items[0] : null;
  } catch (error) {
    console.error("Failed to get Rakuten item:", error);
    return null;
  }
}

// 開発用のモックデータ（APIキーがない時用）
const mockRakutenData: RakutenItem[] = [
  {
    Item: {
      rank: 1,
      itemName: "【公式】 SK-II フェイシャル トリートメント エッセンス 230ml | 正規品 送料無料 | 潤い 保湿 | SK2 エスケーツー skii SK-2 SK－II sk ii ピテラ エッセンス 20代 30代 40代 50代 スキンケア 化粧品 コスメ 女性 プレゼント 彼女 妻 デパコス 高級",
      itemCode: "sk2:10000001",
      itemPrice: "29150",
      itemUrl: "#",
      mediumImageUrls: [{ imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/sk-ii/cabinet/07621467/imgrc0101569037.jpg" }],
      reviewCount: 14500,
      reviewAverage: "4.82",
      shopName: "SK-II 公式ショップ楽天市場店",
      genreId: "100939"
    }
  },
  {
    Item: {
      rank: 2,
      itemName: "【クーポンで1,990円】モバイルバッテリー 軽量 小型 5000mAh 直接充電 コネクター内蔵 ケーブル不要 コードレス iPhone Android Type-C ライトニング 2.1A急速充電 スマホ スタンド付",
      itemCode: "lively:10000002",
      itemPrice: "2980",
      itemUrl: "#",
      mediumImageUrls: [{ imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/livelylife/cabinet/08858348/d45_01.jpg" }],
      reviewCount: 4500,
      reviewAverage: "4.35",
      shopName: "Lively Life",
      genreId: "560195"
    }
  },
  {
    Item: {
      rank: 3,
      itemName: "ミックスナッツ 850g 無塩 有塩 選べる 3種 4種 くるみ アーモンド カシュー マカダミア ラッキーミックスナッツ ファミリー 850g 厳選ナッツ",
      itemCode: "shizen:10000003",
      itemPrice: "1599",
      itemUrl: "#",
      mediumImageUrls: [{ imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/shizennoyakata/cabinet/02334800/img61031758.jpg" }],
      reviewCount: 89000,
      reviewAverage: "4.65",
      shopName: "自然の館",
      genreId: "100227"
    }
  }
];
