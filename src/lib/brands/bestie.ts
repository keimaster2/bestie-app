import { SiteConfig } from "../types";

export const bestieBrand: Record<string, SiteConfig> = {
  bestie: {
    id: "bestie",
    domain: "bestieplus.com",
    fallbackDomain: "bestie-app.pages.dev",
    brandName: "Bestie",
    siteTitle: "Bestie | 最高の相棒と見つける、本当に売れているもの",
    tagline: "あなたの生活に、最高のプラスを。モール横断ランキング・メディア",
    description: "楽天市場、Yahoo!ショッピング、Amazonを横断。本当に売れている人気商品をライオンくんが徹底比較し、あなたの『最高の相棒』を見つけます。",
    themeColor: { primary: "#111827", accent: "#4f46e5" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "膨大なデータの中から、真に価値のある一品を見つけ出す。それが私たちが目指す『Bestie』の姿です。",
      brandStory: "「買い物をもっと、賢く、楽しく。」を掲げ、日々更新される市場の熱狂を可視化します。"
    },
    theme: { background: "#ffffff", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "all", name: "総合ランキング", mallId: "0" },
      { id: "gadget", name: "家電・PC", mallId: "562637" },
      { id: "beauty", name: "美容・健康", mallId: "100939" },
      { id: "food", name: "食品・スイーツ", mallId: "100227" },
      { id: "interior", name: "インテリア", mallId: "100804" },
    ],
    yahooCategories: [
      { id: "all", name: "総合ランキング", mallId: "1" },
      { id: "gadget", name: "家電・スマホ", mallId: "2502" },
      { id: "beauty", name: "コスメ・健康", mallId: "2501" },
      { id: "food", name: "食品・ドリンク", mallId: "2498" },
      { id: "interior", name: "家具・インテリア", mallId: "2506" },
    ],
  }
};
