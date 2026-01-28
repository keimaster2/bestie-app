import { SiteConfig } from "../config";

export const bestieBrand: Record<string, SiteConfig> = {
  "bestie": {
    id: "bestie",
    domain: "bestie.local", // ローカル確認用
    brandName: "Bestie",
    siteTitle: "Bestie | 王道モールの人気ランキングをリアルタイム比較",
    tagline: "大手モールの「今まさに売れている」人気商品をリアルタイムにお届け。",
    description: "Bestie（ベスティ）は、大手モールの売上ランキングをリアルタイムに集計。今まさに売れている人気商品を厳選して紹介します。",
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
      expertComment: "選び疲れをゼロに。今売れている「間違いのない商品」を厳選しました。",
      brandStory: "「これを選べば間違いない」という確信を。Bestieは、膨大な選択肢に迷う現代人のために、大手モールのデータを統合・分析。今この瞬間に世界から最も支持されている上位だけをキュレーションし、あなたの豊かなお買い物体験をサポートすることを使命としています。",
    },
    theme: {
      borderRadius: "rounded-xl",
      cardShadow: "shadow-sm",
      background: "#f9fafb", // gray-50
    },
    categories: [
      { id: "all", name: "総合", rakutenId: "", yahooId: "1" },
      { id: "gourmet", name: "グルメ・スイーツ", rakutenId: "100227", yahooId: "2498", minPrice: 1000 },
      { id: "electronics", name: "家電・PC", rakutenId: "560061", yahooId: "2502", minPrice: 5000 }, 
      { id: "daily", name: "生活用品・雑貨", rakutenId: "215783", yahooId: "2505", minPrice: 1500 },
      { id: "cosmetics", name: "美容・健康", rakutenId: "101070", yahooId: "2501", minPrice: 2000 },
      { id: "game", name: "ホビー", rakutenId: "101164", yahooId: "2511", minPrice: 2000 },
    ]
  }
};
