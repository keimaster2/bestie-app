import { SiteConfig } from "../config";

export const babyBrand: Record<string, SiteConfig> = {
  baby: {
    id: "baby",
    domain: "baby.bestieplus.com",
    fallbackDomain: "baby.bestie-app.pages.dev",
    brandName: "Bestie ベビー",
    siteTitle: "ベビー・キッズ人気ランキング",
    tagline: "健やかな成長を支える。ママ・パパが選ぶ信頼の品々。",
    description: "おむつ、ベビーカー、知育玩具まで。安心・安全で本当に売れているベビー用品をライオンくんが厳選しました。",
    themeColor: { primary: "#1d4ed8", accent: "#60a5fa" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "ベビー用品選びは、先輩ママ・パパの『支持数』が最も信頼できる指標になります。",
      brandStory: "「家族の時間を, もっと豊かに。」を目指し, 安全性と満足度の高いアイテムを可視化します。"
    },
    theme: { background: "#eff6ff", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "baby", name: "キッズ・ベビー・マタニティ", mallId: "100533" },
      { id: "toys", name: "おもちゃ", mallId: "566382" },
    ],
    yahooCategories: [
      { id: "baby", name: "ベビー、キッズ、マタニティ", mallId: "2497" },
      { id: "toys", name: "おもちゃ", mallId: "2119" },
    ],
  }
};
