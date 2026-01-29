import { SiteConfig } from "../config";

export const gameBrand: Record<string, SiteConfig> = {
  game: {
    id: "game",
    domain: "game.bestieplus.com",
    fallbackDomain: "game.bestie-app.pages.dev",
    brandName: "Bestie ゲーム",
    siteTitle: "ゲーム人気ランキング",
    tagline: "最高の没入体験を。今熱いゲームのすべて。",
    description: "Switch、PS5からレトロゲームまで、今売れているゲームソフトと本体を徹底比較。ライオンくんが市場を分析します。",
    themeColor: { primary: "#4c1d95", accent: "#c026d3" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "ゲームの評価は鮮度が命。リアルタイムの売上と満足度から、真に遊ぶべき1本を導き出します。",
      brandStory: "「すべてのプレイヤーに最高の冒険を。」を目指し、ゲームの熱狂をデータで裏打ちします。"
    },
    theme: { background: "#f5f3ff", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "all", name: "ゲーム総合", mallId: "101205" },
      { id: "switch", name: "Nintendo Switch", mallId: "565950" },
      { id: "ps5", name: "PlayStation 5", mallId: "566382" },
      { id: "retro", name: "レトロゲーム", mallId: "101240" },
    ],
    yahooCategories: [
      { id: "all", name: "ゲーム総合", mallId: "2511" },
      { id: "switch", name: "Nintendo Switch", mallId: "47330" },
      { id: "ps5", name: "PlayStation 5", mallId: "49340" },
      { id: "retro", name: "レトロゲーム", mallId: "2566" },
    ],
  }
};
