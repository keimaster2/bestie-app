import { SiteConfig } from "../types";

export const gourmetBrand: Record<string, SiteConfig> = {
  gourmet: {
    id: "gourmet",
    domain: "gourmet.bestieplus.com",
    fallbackDomain: "gourmet.bestie-app.pages.dev",
    brandName: "Bestie グルメ",
    siteTitle: "グルメ・お取り寄せ人気ランキング",
    tagline: "食卓に最高の感動を。今売れている至極のお取り寄せ。",
    description: "絶品スイーツから日本中の名産品、お酒まで。舌の肥えたユーザーが実際にリピートしているグルメをライオンくんが厳選。",
    themeColor: { primary: "#7c2d12", accent: "#ea580c" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "『美味しい』は数字に現れます。レビューの熱量とリピート率から、外さない逸品だけを選び抜きます。",
      brandStory: "「日本中の美味しいを、もっと身近に。」を掲げ、食のトレンドを追い続けます。"
    },
    theme: { background: "#fffaf8", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "all", name: "食品・スイーツ総合", mallId: "100227" },
      { id: "sweets", name: "スイーツ・お菓子", mallId: "551167" },
      { id: "drink", name: "水・ソフトドリンク", mallId: "100316" },
      { id: "alcohol", name: "ビール・洋酒", mallId: "510915" },
    ],
    yahooCategories: [
      { id: "all", name: "食品・ドリンク総合", mallId: "2498" },
      { id: "sweets", name: "スイーツ、お菓子", mallId: "2499" },
      { id: "drink", name: "水、炭酸水、ソフトドリンク", mallId: "2498" },
      { id: "alcohol", name: "お酒、ドリンク", mallId: "2498" },
    ],
  }
};
