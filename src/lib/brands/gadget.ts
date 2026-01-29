import { SiteConfig } from "../config";

export const gadgetBrand: Record<string, SiteConfig> = {
  "gadget": {
    id: "gadget",
    domain: "gadget.local", 
    brandName: "Bestie ガジェット",
    siteTitle: "Bestie ガジェット | 究極のガジェット比較・ランキング",
    tagline: "プロの視点で選ぶ、失敗しないデバイス選び",
    description: "Bestie ガジェットは、最新ガジェットの売上データを徹底分析。あなたのデスク周りを最強にするアイテムを厳選します。",
    themeColor: {
      primary: "#1e3a8a", // blue-900
      accent: "#3b82f6",  // blue-500
    },
    affiliate: {
      rakutenAid: "5355389",
      yahooAid: "5355394",
      amazonTag: "bestie-select-22",
    },
    eeat: {
      expertComment: "スペックの数値に騙されちゃいけないよ。俺が重視するのは、データが示す『日々の使い勝手』だ。",
      brandStory: "Bestie ガジェットは、最新の市場データに基づき、プロの視点を加味して構成されたガジェット専門メディアです。",
    },
    theme: {
      borderRadius: "rounded-lg",
      cardShadow: "shadow-2xl",
      background: "#f1f5f9",
    },
    rakutenCategories: [
      { id: "pc", name: "パソコン", mallId: "565162" },
      { id: "mobile", name: "スマートフォン", mallId: "564500" },
      { id: "parts", name: "PCパーツ", mallId: "100087" },
      { id: "audio", name: "オーディオ", mallId: "100155" },
      { id: "camera", name: "カメラ・ビデオカメラ", mallId: "100212" },
    ],
    yahooCategories: [
      { id: "pc", name: "ノートパソコン", mallId: "14242" },
      { id: "mobile", name: "スマホ本体", mallId: "38338" },
      { id: "parts", name: "PCパーツ", mallId: "88" },
      { id: "audio", name: "オーディオ機器", mallId: "660" },
      { id: "camera", name: "カメラ", mallId: "2443" },
    ]
  }
};
