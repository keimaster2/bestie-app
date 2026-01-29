import { SiteConfig } from "../config";

export const bestieBrand: Record<string, SiteConfig> = {
  "bestie": {
    id: "bestie",
    domain: "bestie.local",
    brandName: "Bestie",
    siteTitle: "Bestie | 王道モールの人気ランキングを徹底比較",
    tagline: "大手モールの売上データから「間違いのない」逸品を厳選",
    description: "Bestie（ベスティー）は、大手モールの売上ランキングを独自に集計。多くの支持を集める人気商品を厳選して紹介します。",
    themeColor: {
      primary: "#111827",
      accent: "#ef4444",
    },
    affiliate: {
      rakutenAid: "5355389",
      yahooAid: "5355394",
      amazonTag: "bestie-select-22",
    },
    eeat: {
      expertComment: "情報が多すぎて疲れてないかい？ 安心してくれ、膨大なデータから市場のノイズを丁寧に取り除いておいたよ。",
      brandStory: "Bestieは、膨大な選択肢に迷う現代人のために、購買データに基づいた客観的な人気を提示するメディアです。",
    },
    theme: {
      borderRadius: "rounded-xl",
      cardShadow: "shadow-sm",
      background: "#f9fafb",
    },
    rakutenCategories: [
      { id: "all", name: "総合", mallId: "0" },
      { id: "food", name: "食品", mallId: "100227" },
      { id: "sweets", name: "スイーツ・お菓子", mallId: "551167" },
      { id: "game", name: "テレビゲーム", mallId: "101205" },
      { id: "beauty", name: "美容・コスメ・香水", mallId: "100939" },
      { id: "pc", name: "パソコン・周辺機器", mallId: "100026" },
      { id: "daily", name: "日用品雑貨", mallId: "215783" },
    ],
    yahooCategories: [
      { id: "all", name: "総合", mallId: "1" },
      { id: "food", name: "食品", mallId: "2498" },
      { id: "sweets", name: "スイーツ、洋菓子", mallId: "4744" },
      { id: "hobby", name: "ゲーム、おもちゃ", mallId: "2511" },
      { id: "pc", name: "スマホ、タブレット、パソコン", mallId: "2502" },
      { id: "beauty", name: "美容・コスメ・香水", mallId: "2501" },
    ]
  }
};
