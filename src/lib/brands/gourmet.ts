import { SiteConfig } from "../config";

export const gourmetBrand: Record<string, SiteConfig> = {
  "gourmet": {
    id: "gourmet",
    domain: "gourmet.local",
    brandName: "Bestie グルメ",
    siteTitle: "Bestie グルメ | 絶品お取り寄せ・グルメ比較",
    tagline: "食卓を最高のレストランに。日本中の「美味い」をデータで厳選",
    description: "Bestie グルメは、大手モールの食品ランキングを独自に集計。肉、海鮮、スイーツなど、今選ばれている絶品お取り寄せを提案します。",
    themeColor: {
      primary: "#7c2d12", // orange-900
      accent: "#f97316",  // orange-500
    },
    affiliate: {
      rakutenAid: "5355389",
      yahooAid: "5355394",
      amazonTag: "bestie-select-22",
    },
    eeat: {
      expertComment: "「本当に美味しいもの」は、数字が正直に語ってくれる。食卓の質を底上げする一品をデータで特定したよ。",
      brandStory: "Bestie グルメは、日本中の食通たちの購買データを解析し、一過性のブームに流されない価値ある食を提示するメディアです。",
    },
    theme: {
      borderRadius: "rounded-2xl",
      cardShadow: "shadow-lg",
      background: "#fffaf5",
    },
    rakutenCategories: [
      { id: "meat", name: "精肉・肉加工品", mallId: "100228" },
      { id: "seafood", name: "魚介類・海産物", mallId: "100236" },
      { id: "sweets", name: "スイーツ・お菓子", mallId: "551167" },
      { id: "rice", name: "米・雑穀", mallId: "100242" },
      { id: "drink", name: "水・ソフトドリンク", mallId: "100316" },
    ],
    yahooCategories: [
      { id: "meat", name: "肉、ハム、ソーセージ", mallId: "998" },
      { id: "seafood", name: "魚介類、海産物", mallId: "939" },
      { id: "sweets", name: "スイーツ、洋菓子", mallId: "1159" },
      { id: "rice", name: "米、雑穀、粉類", mallId: "1234" },
      { id: "drink", name: "ドリンク、水、お酒", mallId: "1314" },
    ]
  }
};
