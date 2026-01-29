import { SiteConfig } from "../config";

export const fashionBrand: Record<string, SiteConfig> = {
  fashion: {
    id: "fashion",
    domain: "fashion.bestie-app.pages.dev",
    brandName: "Bestie ファッション",
    siteTitle: "ファッション人気ランキング",
    tagline: "流行の一歩先を行く。今売れているアイテムを厳選。",
    description: "レディース、メンズ、小物まで。今、市場で最も支持されているトレンドアイテムをライオンくんが厳選。",
    themeColor: { primary: "#be185d", accent: "#f472b6" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "トレンドの移り変わりが激しいからこそ、データに基づいた『本当に売れているもの』が指針になります。",
      brandStory: "「おしゃれを、もっと賢く。」をテーマに、モールを横断した最新トレンドを分析します。"
    },
    theme: { background: "#fff1f2", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "ladies", name: "レディースファッション", mallId: "100371" },
      { id: "mens", name: "メンズファッション", mallId: "100433" },
      { id: "bags", name: "バッグ・小物・ブランド雑貨", mallId: "216129" },
    ],
    yahooCategories: [
      { id: "ladies", name: "レディースファッション", mallId: "2494" },
      { id: "mens", name: "メンズファッション", mallId: "2495" },
      { id: "bags", name: "バッグ・ファッション小物", mallId: "2496" },
    ],
  }
};
