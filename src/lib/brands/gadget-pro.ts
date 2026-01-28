import { SiteConfig } from "../config";

export const gadgetProBrand: Record<string, SiteConfig> = {
  "gadget": {
    id: "gadget",
    domain: "gadget.local", // ローカル確認用
    brandName: "Gadget Pro",
    siteTitle: "Gadget Pro | 究極のガジェット比較メディア",
    tagline: "プロの視点で選ぶ、失敗しないデバイス選び。",
    description: "Gadget Proは、最新ガジェットの売上ランキングを徹底分析。あなたのデスク周りを最強にするアイテムを厳選します。",
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
      brandStory: "スペック表だけでは見えない『納得感』を。Gadget Proは、テクノロジーの最前線で働くプロの視点と、市場のリアルな売上データを掛け合わせたガジェット専門メディアです。あなたが毎日使うデバイス選びに、データに裏打ちされた最高の納得感を提供します。",
    },
    theme: {
      borderRadius: "rounded-lg", // ガジェットらしくシャープな角
      cardShadow: "shadow-2xl",    // 強い存在感
      background: "#f1f5f9",      // クールなグレー背景
    },
    categories: [
      { id: "electronics", name: "PC・周辺機器", rakutenId: "560061", yahooId: "2502", minPrice: 5000 },
      { id: "audio", name: "オーディオ", rakutenId: "211741", yahooId: "2504", minPrice: 3000 },
    ]
  }
};
