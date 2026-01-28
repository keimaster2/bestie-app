export type Genre = {
  id: string;      // アプリ内で使うID（URLパラメータ用）
  name: string;    // 表示名
  rakutenId: string;
  yahooId: string; // YahooのカテゴリID
  minPrice?: number; // Yahoo側の小物対策用最低価格
};

export const GENRES: Genre[] = [
  { id: "all", name: "総合", rakutenId: "", yahooId: "1" },
  { id: "gourmet", name: "グルメ・スイーツ", rakutenId: "100227", yahooId: "2498", minPrice: 1000 }, // 食品・スイーツ
  { id: "electronics", name: "家電・PC", rakutenId: "560061", yahooId: "2502", minPrice: 5000 }, 
  { id: "daily", name: "生活用品・雑貨", rakutenId: "215783", yahooId: "2505", minPrice: 1500 }, // 生活全般に広げる
  { id: "cosmetics", name: "美容・健康", rakutenId: "101070", yahooId: "2501", minPrice: 2000 },
  { id: "game", name: "ホビー", rakutenId: "101164", yahooId: "2511", minPrice: 2000 },
];
