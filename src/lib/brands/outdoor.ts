import { SiteConfig } from "../types";

export const outdoorBrand: Record<string, SiteConfig> = {
  outdoor: {
    id: "outdoor",
    domain: "outdoor.bestieplus.com",
    fallbackDomain: "outdoor.bestie-app.pages.dev",
    brandName: "Bestie アウトドア",
    siteTitle: "アウトドア・スポーツ人気ランキング",
    tagline: "遊びを本気に。今選ばれている信頼のギアたち。",
    description: "キャンプ用品、登山、各種スポーツギア。過酷な環境でも信頼される売れ筋アイテムをライオンくんが徹底調査。",
    themeColor: { primary: "#166534", accent: "#22c55e" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "アウトドアは命を預けるもの。だからこそ、実際に多くの人に選ばれ、評価されている証拠を重視します。",
      brandStory: "「外遊びをもっと自由に。」をテーマに、プロも納得のギア選びをサポートします。"
    },
    theme: { background: "#f0fdf4", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "all", name: "スポーツ・アウトドア総合", mallId: "101070" },
      { id: "camp", name: "キャンプ・トレッキング", mallId: "302373" },
      { id: "golf", name: "ゴルフ", mallId: "101110" },
    ],
    yahooCategories: [
      { id: "all", name: "アウトドア・釣り総合", mallId: "2510" },
      { id: "camp", name: "アウトドア、キャンプ用品", mallId: "2510" },
      { id: "golf", name: "ゴルフ", mallId: "2510" },
    ],
  }
};
