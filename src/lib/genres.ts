export type Genre = {
  id: string;      // アプリ内で使うID（URLパラメータ用）
  name: string;    // 表示名
  rakutenId: string;
  yahooId: string; // YahooのカテゴリID
};

export const GENRES: Genre[] = [
  { id: "all", name: "総合", rakutenId: "", yahooId: "1" },
  { id: "electronics", name: "家電・PC", rakutenId: "562637", yahooId: "2502" },
  { id: "daily", name: "日用品", rakutenId: "211742", yahooId: "2500" },
  { id: "cosmetics", name: "コスメ", rakutenId: "100939", yahooId: "2501" }, // 美容
  { id: "hobby", name: "ホビー", rakutenId: "101164", yahooId: "2511" }, // 趣味・ゲーム・おもちゃ
];
