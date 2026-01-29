import { SiteConfig } from "../config";

export const interiorBrand: Record<string, SiteConfig> = {
  interior: {
    id: "interior",
    domain: "interior.bestieplus.com",
    fallbackDomain: "interior.bestie-app.pages.dev",
    brandName: "Bestie インテリア",
    siteTitle: "インテリア人気ランキング",
    tagline: "心地よい暮らしの主役。今、選ばれている家具・雑貨。",
    description: "家具、収納、寝具からキッチン用品まで。心地よい暮らしを作る売れ筋アイテムをライオンくんがナビゲート。",
    themeColor: { primary: "#065f46", accent: "#34d399" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "家は人生の基盤。長く愛せるもの、そして今多くの人に選ばれている『正解』をデータから導き出します。",
      brandStory: "「理想の部屋を、手の届く価格で。」をコンセプトに, コスパと品質のバランスを追求します。"
    },
    theme: { background: "#f0fdf4", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "furniture", name: "インテリア・寝具・収納", mallId: "100804" },
      { id: "bedding", name: "寝具", mallId: "215566" },
      { id: "kitchen", name: "キッチン用品・食器・調理器具", mallId: "558944" },
    ],
    yahooCategories: [
      { id: "furniture", name: "サンキャッチャー", mallId: "49257" },
      { id: "kitchen", name: "ジューサー、ミキサー、フードプロセッサー", mallId: "38072" },
    ],
  }
};
