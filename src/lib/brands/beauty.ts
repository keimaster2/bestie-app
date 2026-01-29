import { SiteConfig } from "../config";

export const beautyBrand: Record<string, SiteConfig> = {
  "beauty": {
    id: "beauty",
    domain: "beauty.local",
    brandName: "Bestie ビューティー",
    siteTitle: "Bestie ビューティー | 今、選ばれている美容・健康アイテム比較",
    tagline: "理想の自分へ。実績ある最新コスメから健康習慣までを徹底比較",
    description: "Bestie ビューティーは、大手モールの美容・健康カテゴリーを徹底比較。多くの支持を集める人気商品を厳選して紹介します。",
    themeColor: {
      primary: "#be185d", // pink-700
      accent: "#f472b6",  // pink-400
    },
    affiliate: {
      rakutenAid: "5355389",
      yahooAid: "5355394",
      amazonTag: "bestie-select-22",
    },
    eeat: {
      expertComment: "口コミだけでなく、実際の売れ行きを最重視してセレクトしました。",
      brandStory: "Bestie ビューティーは、トレンドの移り変わりが激しい美容業界において、確かな実績でユーザーの美への挑戦をサポートします。",
    },
    theme: {
      borderRadius: "rounded-3xl",
      cardShadow: "shadow-md",
      background: "#fff5f7",
    },
    rakutenCategories: [
      { id: "skin", name: "スキンケア", mallId: "100944" },
      { id: "makeup", name: "ベースメイク", mallId: "204233" },
      { id: "hair", name: "ヘアケア", mallId: "100940" },
      { id: "body", name: "ボディケア", mallId: "100960" },
      { id: "fragrance", name: "香水", mallId: "111120" },
    ],
    yahooCategories: [
      { id: "skin", name: "スキンケア", mallId: "1752" },
      { id: "makeup", name: "メイクアップ", mallId: "1791" },
      { id: "hair", name: "ヘアケア", mallId: "1832" },
      { id: "body", name: "ボディケア", mallId: "1841" },
      { id: "appliances", name: "美容家電", mallId: "1999" },
    ]
  }
};
