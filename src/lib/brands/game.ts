import { SiteConfig } from "../config";

export const gameBrand: Record<string, SiteConfig> = {
  "game": {
    id: "game",
    domain: "game.local",
    brandName: "Bestie ゲーム",
    siteTitle: "Bestie ゲーム | 究極のテレビゲーム比較・ランキング",
    tagline: "遊びを、もっと熱く。話題の新作から伝説の名作までをデータで厳選",
    description: "Bestie ゲームは、大手モールのゲームランキングを独自に集計。Switch 2、PS5、話題の新作ソフトなど、今選ぶべきゲーム体験を提案します。",
    themeColor: {
      primary: "#4338ca", // indigo-700
      accent: "#818cf8",  // indigo-400
    },
    affiliate: {
      rakutenAid: "5355389",
      yahooAid: "5355394",
      amazonTag: "bestie-select-22",
    },
    eeat: {
      expertComment: "ゲームは『体験』だ。単なるグラフィックの良さだけじゃない、今の熱狂がどこにあるのかを俺が見抜いておいたよ。",
      brandStory: "Bestie ゲームは、世界中のゲーマーたちの支持をリアルタイムで解析。本当に没頭できる一品を探し出すための、冒険の地図のようなメディアです。",
    },
    theme: {
      borderRadius: "rounded-xl",
      cardShadow: "shadow-2xl",
      background: "#eef2ff", // indigo-50
    },
    rakutenCategories: [
      { id: "switch2", name: "Switch 2", mallId: "568771" },
      { id: "ps5", name: "PS5", mallId: "568375" },
      { id: "switch", name: "Switch", mallId: "565950" },
      { id: "toy", name: "おもちゃ・ホビー", mallId: "101164" },
    ],
    yahooCategories: [
      { id: "switch2", name: "Switch 2", mallId: "77071" },
      { id: "ps5", name: "PS5", mallId: "50796" },
      { id: "switch", name: "Switch", mallId: "48838" },
      { id: "toy", name: "おもちゃ・ホビー", mallId: "2511" },
      { id: "retro", name: "レトロゲーム", mallId: "65530" },
    ]
  }
};
