import { SiteConfig } from "../config";

export const beautyBrand: Record<string, SiteConfig> = {
  "beauty": {
    id: "beauty",
    domain: "beauty.local", // ローカル確認用
    brandName: "Bestie Beauty",
    siteTitle: "Bestie Beauty | 今、本当に売れている美容・健康アイテム比較",
    tagline: "理想の自分へ。SNSで話題の最新コスメから健康習慣までをリアルタイムにお届け。",
    description: "Bestie Beautyは、大手モールの美容・健康カテゴリを徹底比較。今まさに売れている人気商品を、プロの視点とデータで厳選して紹介します。",
    themeColor: {
      primary: "#be185d", // pink-700
      accent: "#f472b6",  // pink-400
    },
    affiliate: {
      rakutenAid: "5355389",
      yahooAid: "5355394",
      amazonTag: "bestie-select-22",
    },
    eeat: {
      expertComment: "成分や口コミだけでなく、実際の売れ行き（トレンド）を最重視してセレクトしました。失敗したくない美容投資をサポートします。",
      brandStory: "「美しさの正解」は、数字が知っている。Bestie Beautyは、トレンドの移り変わりが激しい美容・健康業界において、リアルタイムの販売データに基づいた『真の売れ筋』を追求します。ユーザーの皆様の美の投資を、一過性の流行ではなく確かな実績で守る。それが私たちの願いです。",
    },
    theme: {
      borderRadius: "rounded-3xl", // 美容らしく柔らかい丸み
      cardShadow: "shadow-md",      // 少しリッチな影
      background: "#fff5f7",       // ほんのりピンクがかった背景
    },
    categories: [
      { id: "all", name: "総合", rakutenId: "101070", yahooId: "2501" }, // 美容・健康総合
      { id: "skincare", name: "スキンケア", rakutenId: "100939", yahooId: "2501", minPrice: 2000 },
      { id: "diet", name: "ダイエット・健康", rakutenId: "100938", yahooId: "2500", minPrice: 1500 },
      { id: "hair", name: "ヘアケア", rakutenId: "100939", yahooId: "2501", minPrice: 2000 },
      { id: "appliances", name: "美容家電", rakutenId: "502792", yahooId: "1999", minPrice: 5000 },
    ]
  }
};
