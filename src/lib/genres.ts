export type Genre = {
  id: string;      // アプリ内で使うID（URLパラメータ用）
  name: string;    // 表示名
  rakutenId: string;
  yahooId: string; // YahooのカテゴリID
};

export const GENRES: Genre[] = [
  { id: "all", name: "総合", rakutenId: "", yahooId: "1" }, // Yahooの1は「すべてのカテゴリ」
  { id: "fashion", name: "ファッション", rakutenId: "100371", yahooId: "13457" },
  { id: "food", name: "食品", rakutenId: "100227", yahooId: "2498" },
  { id: "electronics", name: "家電", rakutenId: "562637", yahooId: "2502" },
  { id: "daily", name: "日用品", rakutenId: "211742", yahooId: "2500" }, // ダイエット・健康含む
  { id: "cosmetics", name: "コスメ", rakutenId: "100939", yahooId: "2501" },
  { id: "books", name: "本・雑誌", rakutenId: "200162", yahooId: "10002" },
];
