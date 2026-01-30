import { SiteConfig } from "../types";

export const beautyBrand: Record<string, SiteConfig> = {
  beauty: {
    id: "beauty",
    domain: "beauty.bestieplus.com",
    fallbackDomain: "beauty.bestie-app.pages.dev",
    brandName: "Bestie ビューティー",
    siteTitle: "美容・コスメ人気ランキング",
    tagline: "自分史上最高の輝きを。今、愛されている美容コスメ。",
    description: "スキンケアからメイクアップ、美容家電まで。日本中の女性が実際に選んでいる『美の正解』をライオンくんがナビゲート。",
    themeColor: { primary: "#831843", accent: "#db2777" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "評価の分かれる美容アイテムだからこそ、『継続して売れ続けている実績』が何よりの信頼になります。",
      brandStory: "「毎日に、自信を。」をコンセプトに、透明性の高いランキングを提供します。"
    },
    theme: { background: "#fdf2f8", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "all", name: "美容・健康総合", mallId: "100939" },
      { id: "skincare", name: "スキンケア", mallId: "100947" },
      { id: "haircare", name: "ヘアケア", mallId: "100944" },
    ],
    yahooCategories: [
      { id: "all", name: "コスメ・美容総合", mallId: "2501" },
      { id: "skincare", name: "スキンケア", mallId: "2501" },
      { id: "haircare", name: "ヘアケア", mallId: "2501" },
    ],
  }
};
