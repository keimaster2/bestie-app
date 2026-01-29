import { SiteConfig } from "../config";

export const petBrand: Record<string, SiteConfig> = {
  pet: {
    id: "pet",
    domain: "pet.bestieplus.com",
    fallbackDomain: "pet.bestie-app.pages.dev",
    brandName: "Bestie ペット",
    siteTitle: "ペット用品人気ランキング",
    tagline: "大切な家族の笑顔のために。最安値と品質を徹底比較。",
    description: "チモシーからドッグフードまで。大切な家族であるペットのための最安値と人気商品をライオンくんが徹底調査。",
    themeColor: { primary: "#b45309", accent: "#fbbf24" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "消耗品だからこそ安く、家族だからこそ良いものを。その矛盾を解決するのがモール横断検索の力です。",
      brandStory: "「ペットと飼い主、両方の幸せ」を追求し、日々変動する市場価格をライオンくんが監視します。"
    },
    theme: { background: "#fffbeb", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "dog", name: "犬用品", mallId: "507513" },
      { id: "cat", name: "猫用品", mallId: "507524" },
      { id: "small", name: "小動物用品", mallId: "565699" },
      { id: "timothy", name: "牧草", mallId: "565703" },
    ],
    yahooCategories: [
      { id: "dog", name: "犬用品", mallId: "4772" },
      { id: "cat", name: "猫用品", mallId: "4820" },
      { id: "small", name: "小動物用品", mallId: "32958" },
      { id: "timothy", name: "小動物用フード、おやつ", mallId: "48396" },
    ],
  }
};
