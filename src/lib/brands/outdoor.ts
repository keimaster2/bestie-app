import { SiteConfig } from "../config";

export const outdoorBrand: Record<string, SiteConfig> = {
  "outdoor": {
    id: "outdoor",
    domain: "outdoor.local",
    brandName: "Bestie アウトドア",
    siteTitle: "Bestie アウトドア | 究極のキャンプ・アウトドアギア比較",
    tagline: "自然を遊び尽くせ。プロが認める「一生モノ」の道具選び",
    description: "Bestie アウトドアは、キャンプ用品の売上データを徹底解析. テントから焚き火台まで、今選ぶべき信頼のギアを厳選して紹介します。",
    themeColor: {
      primary: "#064e3b", // green-900
      accent: "#10b981",  // green-500
    },
    affiliate: {
      rakutenAid: "5355389",
      yahooAid: "5355394",
      amazonTag: "bestie-select-22",
    },
    eeat: {
      expertComment: "過酷な環境で頼りになるのは、スペック以上に『実績』だ。俺が現場で光る本物のギアを仕分けておいたよ。",
      brandStory: "Bestie アウトドアは、自然を愛するすべての人のために、膨大な市場データから本当に信頼できるアウトドアギアだけをキュレーションするメディアです。",
    },
    theme: {
      borderRadius: "rounded-lg",
      cardShadow: "shadow-md",
      background: "#f0fdf4",
    },
    rakutenCategories: [
      { id: "tent", name: "テント・タープ", mallId: "201874" },
      { id: "furniture", name: "テーブル・チェア", mallId: "201883" },
      { id: "cook", name: "バーベキュー・調理", mallId: "201877" },
      { id: "light", name: "ライト・ランタン", mallId: "201894" },
      { id: "sleep", name: "アウトドア用寝具", mallId: "201887" },
    ],
    yahooCategories: [
      { id: "gear", name: "キャンプ、登山", mallId: "2522" },
      { id: "tent", name: "テント、タープ", mallId: "2640" },
      { id: "furniture", name: "テーブル、チェア", mallId: "2635" },
      { id: "cook", name: "バーベキュー用品", mallId: "66430" },
      { id: "light", name: "ライト、ランタン", mallId: "2648" },
    ]
  }
};
