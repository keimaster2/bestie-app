import { SiteConfig } from "../config";

export const gadgetBrand: Record<string, SiteConfig> = {
  gadget: {
    id: "gadget",
    domain: "gadget.bestieplus.com",
    fallbackDomain: "gadget.bestie-app.pages.dev",
    brandName: "Bestie ガジェット",
    siteTitle: "ガジェット・家電人気ランキング",
    tagline: "未来を。日常を。今選ぶべき最高のガジェット。",
    description: "最新のスマホ、PCから便利な白物家電まで。今、市場で本当に売れているガジェットをライオンくんが徹底比較。",
    themeColor: { primary: "#1e40af", accent: "#3b82f6" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "スペック表だけでは見えない『本当の人気』を、レビュー数と販売実績から解明します。",
      brandStory: "「テクノロジーを、もっと身近に。」をテーマに、失敗しない家電選びをサポートします。"
    },
    theme: { background: "#f0f9ff", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "all", name: "家電・PC総合", mallId: "562637" },
      { id: "smartphone", name: "スマホ・タブレット", mallId: "564500" },
      { id: "pc", name: "パソコン周辺機器", mallId: "100026" },
    ],
    yahooCategories: [
      { id: "all", name: "家電・スマホ総合", mallId: "2502" },
      { id: "smartphone", name: "スマホ・タブレット", mallId: "2502" },
      { id: "pc", name: "パソコン周辺機器", mallId: "2502" },
    ],
  }
};
