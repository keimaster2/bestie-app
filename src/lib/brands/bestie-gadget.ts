import { SiteConfig } from "../config";

export const bestieGadgetBrand: Record<string, SiteConfig> = {
  "gadget": {
    id: "gadget",
    domain: "gadget.local", 
    brandName: "Bestie Gadget",
    siteTitle: "Bestie Gadget | 究極のガジェット比較メディア",
    tagline: "プロの視点で選ぶ、失敗しないデバイス選び。",
    description: "Bestie Gadgetは、最新ガジェットの売上ランキングを徹底分析。あなたのデスク周りを最強にするアイテムを厳選します。",
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
      expertComment: "現役エンジニアが実際に愛用しているデバイスを中心にピックアップしました。",
      brandStory: "スペック表だけでは見えない『納得感』を。Bestie Gadgetは、テクノロジーの最前線で働くプロの視点と、市場のリアルな売上データを掛け合わせたガジェット専門メディアです。あなたが毎日使うデバイス選びに、データに裏打ちされた最高の納得感を提供します。",
    },
    theme: {
      borderRadius: "rounded-lg",
      cardShadow: "shadow-2xl",
      background: "#f1f5f9",
    },
    categories: [
      { id: "all", name: "総合", rakutenId: "562637", yahooId: "2502" },
      { id: "electronics", name: "PC・周辺機器", rakutenId: "560061", yahooId: "2502", minPrice: 5000 },
      { id: "audio", name: "オーディオ", rakutenId: "211741", yahooId: "2504", minPrice: 3000 },
    ]
  }
};
