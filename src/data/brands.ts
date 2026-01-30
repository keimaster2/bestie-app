import type { SiteConfig } from "../lib/types";

// 🛡️ ベース設定：全ブランド共通のデフォルト値
const BASE_CONFIG = {
  fallbackDomain: "bestie-app.pages.dev",
  themeColor: { primary: "#111827", accent: "#4f46e5" },
  affiliate: { 
    rakutenAid: "5355389", 
    yahooAid: "5355394", 
    amazonTag: "bestie-select-22" 
  },
  theme: { 
    background: "#ffffff", 
    borderRadius: "rounded-2xl", 
    cardShadow: "shadow-lg" 
  },
};

// 🛠️ ブランド生成ヘルパー
function createBrand(id: string, overrides: any): SiteConfig {
  return {
    id,
    domain: overrides.domain || `${id}.bestieplus.com`,
    fallbackDomain: overrides.fallbackDomain || BASE_CONFIG.fallbackDomain,
    brandName: overrides.brandName,
    siteTitle: overrides.siteTitle,
    tagline: overrides.tagline,
    description: overrides.description,
    themeColor: { ...BASE_CONFIG.themeColor, ...overrides.themeColor },
    affiliate: { ...BASE_CONFIG.affiliate, ...overrides.affiliate },
    eeat: { 
      expertComment: overrides.eeat?.expertComment || "", 
      brandStory: overrides.eeat?.brandStory || "" 
    },
    theme: { ...BASE_CONFIG.theme, ...overrides.theme },
    rakutenCategories: overrides.rakutenCategories || [],
    yahooCategories: overrides.yahooCategories || [],
  } as SiteConfig;
}

export const ALL_BRANDS: Record<string, SiteConfig> = {
  bestie: createBrand("bestie", {
    domain: "bestieplus.com",
    brandName: "Bestie",
    siteTitle: "Bestie | 最高の相棒と見つける、本当に売れているもの",
    tagline: "あなたの生活に、最高のプラスを。モール横断ランキング・メディア",
    description: "楽天市場、Yahoo!ショッピング、Amazonを横断。人気商品をライオンくんが徹底比較し、あなたの『最高の相棒』を見つけます。",
    eeat: {
      expertComment: "膨大なデータの中から、真に価値のある一品を見つけ出す。それが私たちが目指す『Bestie』の姿です。",
      brandStory: "「買い物をもっと、賢く、楽しく。」を掲げ、日々更新される市場の熱狂を可視化します。"
    },
    rakutenCategories: [
      { id: "all", name: "総合ランキング", mallId: "0" },
      { id: "gadget", name: "家電・PC", mallId: "562637" },
      { id: "beauty", name: "美容・健康", mallId: "100939" },
      { id: "food", name: "食品・スイーツ", mallId: "100227" },
      { id: "interior", name: "インテリア", mallId: "100804" },
    ],
    yahooCategories: [
      { id: "all", name: "総合ランキング", mallId: "1" },
      { id: "gadget", name: "家電・スマホ", mallId: "2502" },
      { id: "beauty", name: "コスメ・健康", mallId: "2501" },
      { id: "food", name: "食品・ドリンク", mallId: "2498" },
      { id: "interior", name: "家具・インテリア", mallId: "2506" },
    ],
  }),

  gadget: createBrand("gadget", {
    brandName: "Bestie ガジェット",
    siteTitle: "ガジェット・家電人気ランキング",
    tagline: "未来を。日常を。今選ぶべき最高のガジェット。",
    description: "最新のスマホ、PCから便利な白物家電まで。市場で売れているガジェットをライオンくんが徹底比較。",
    themeColor: { primary: "#1e40af", accent: "#3b82f6" },
    eeat: {
      expertComment: "スペック表だけでは見えない『本当の人気』を解明します。",
      brandStory: "「テクノロジーを、もっと身近に。」をテーマに、失敗しない家電選びをサポートします。"
    },
    theme: { background: "#f0f9ff" },
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
  }),

  beauty: createBrand("beauty", {
    brandName: "Bestie ビューティー",
    siteTitle: "美容・コスメ人気ランキング",
    tagline: "自分史上最高の輝きを。今、愛されている美容コスメ。",
    description: "スキンケアからメイクアップ、美容家電まで。日本中の女性が実際に選んでいる『美の正解』をライオンくんがナビゲート。",
    themeColor: { primary: "#831843", accent: "#db2777" },
    eeat: {
      expertComment: "評価の分かれる美容アイテムだからこそ、『実績』が信頼になります。",
      brandStory: "「毎日に、自信を。」をコンセプトに、透明性の高いランキングを提供します。"
    },
    theme: { background: "#fdf2f8" },
    rakutenCategories: [
      { id: "all", name: "美容・健康総合", mallId: "100939" },
      { id: "skincare", name: "スキンケア", mallId: "100947" },
      { id: "haircare", name: "ヘアケア", mallId: "100944" },
    ],
    yahooCategories: [
      { id: "all", name: "コスメ・美容総合", mallId: "2501" },
      { id: "skincare", name: "スキンケア", mallId: "2501" },
      { id: "haircare", name: "ヘアケア", mallId: "2501" },
    ],
  }),

  gourmet: createBrand("gourmet", {
    brandName: "Bestie グルメ",
    siteTitle: "グルメ・お取り寄せ人気ランキング",
    tagline: "食卓に最高の感動を。今売れている至極のお取り寄せ。",
    description: "絶品スイーツから日本中の名産品、お酒まで。リピートされているグルメをライオンくんが厳選。",
    themeColor: { primary: "#7c2d12", accent: "#ea580c" },
    eeat: {
      expertComment: "『美味しい』は数字に現れます。レビューの熱量から、外さない逸品を選び抜きます。",
      brandStory: "「日本中の美味しいを、もっと身近に。」を掲げ、食のトレンドを追い続けます。"
    },
    theme: { background: "#fffaf8" },
    rakutenCategories: [
      { id: "all", name: "食品・スイーツ総合", mallId: "100227" },
      { id: "sweets", name: "スイーツ・お菓子", mallId: "551167" },
      { id: "drink", name: "水・ソフトドリンク", mallId: "100316" },
      { id: "alcohol", name: "ビール・洋酒", mallId: "510915" },
    ],
    yahooCategories: [
      { id: "all", name: "食品・ドリンク総合", mallId: "2498" },
      { id: "sweets", name: "スイーツ・お菓子", mallId: "2499" },
      { id: "drink", name: "水・炭酸水・ソフトドリンク", mallId: "13457" },
      { id: "alcohol", name: "ビール・洋酒", mallId: "2500" },
    ],
  }),

  outdoor: createBrand("outdoor", {
    brandName: "Bestie アウトドア",
    siteTitle: "アウトドア・スポーツ人気ランキング",
    tagline: "遊びを本気に。今選ぶべき信頼のギアたち。",
    description: "キャンプ用品、登山、各種スポーツギア。信頼される売れ筋アイテムをライオンくんが徹底調査。",
    themeColor: { primary: "#166534", accent: "#22c55e" },
    eeat: {
      expertComment: "アウトドアは命を預けるもの。評価されている証拠を重視します。",
      brandStory: "「外遊びをもっと自由に。」をテーマに、プロも納得のギア選びをサポートします。"
    },
    theme: { background: "#f0fdf4" },
    rakutenCategories: [
      { id: "all", name: "スポーツ・アウトドア総合", mallId: "101070" },
      { id: "camp", name: "キャンプ・トレッキング", mallId: "302373" },
      { id: "golf", name: "ゴルフ", mallId: "101110" },
    ],
    yahooCategories: [
      { id: "all", name: "アウトドア・釣り総合", mallId: "2510" },
      { id: "camp", name: "アウトドア用品", mallId: "2511" },
      { id: "golf", name: "ゴルフ", mallId: "2514" },
    ],
  }),

  game: createBrand("game", {
    brandName: "Bestie ゲーム",
    siteTitle: "ゲーム人気ランキング",
    tagline: "最高の没入体験を。今熱いゲームのすべて。",
    description: "Switch、PS5からレトロゲームまで。ライオンくんが市場を分析します。",
    themeColor: { primary: "#4c1d95", accent: "#c026d3" },
    eeat: {
      expertComment: "ゲームの評価は鮮度が命. 真に遊ぶべき1本を導き出します。",
      brandStory: "「すべてのプレイヤーに最高の冒険を。」を目指し, ゲームの熱狂をデータで裏打ちします。"
    },
    theme: { background: "#f5f3ff" },
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
  }),

  fashion: createBrand("fashion", {
    brandName: "Bestie ファッション",
    siteTitle: "ファッション人気ランキング",
    tagline: "流行の一歩先を行く。今売れているアイテムを厳選。",
    description: "レディース、メンズ、小物まで. 市場で支持されているトレンドアイテムをライオンくんが厳選。",
    themeColor: { primary: "#be185d", accent: "#f472b6" },
    eeat: {
      expertComment: "トレンドの移り変わりが激しいからこそ、データが指針になります。",
      brandStory: "「おしゃれを、もっと賢く。」をテーマに、最新トレンドを分析します。"
    },
    theme: { background: "#fff1f2" },
    rakutenCategories: [
      { id: "ladies", name: "レディースファッション", mallId: "100371" },
      { id: "mens", name: "メンズファッション", mallId: "551177" },
      { id: "bags", name: "バッグ・小物・ブランド雑貨", mallId: "216131" },
    ],
    yahooCategories: [
      { id: "ladies", name: "レディースファッション", mallId: "2494" },
      { id: "mens", name: "メンズファッション", mallId: "2495" },
      { id: "bags", name: "バッグ・小物・ブランド雑貨", mallId: "2496" },
    ],
  }),

  interior: createBrand("interior", {
    brandName: "Bestie インテリア",
    siteTitle: "インテリア人気ランキング",
    tagline: "心地よい暮らしの主役。今、選ばれている家具・雑貨。",
    description: "家具、収納、寝具からキッチン用品まで。心地よい暮らしを作るアイテムをライオンくんがナビゲート。",
    themeColor: { primary: "#065f46", accent: "#34d399" },
    eeat: {
      expertComment: "長く愛せるもの、正解をデータから導き出します。",
      brandStory: "「理想の部屋を、手の届く価格で。」をコンセプトに, コスパと品質を追求します。"
    },
    theme: { background: "#f0fdf4" },
    rakutenCategories: [
      { id: "furniture", name: "インテリア・寝具・収納", mallId: "100804" },
      { id: "bedding", name: "寝具", mallId: "215566" },
      { id: "kitchen", name: "キッチン用品・食器・調理器具", mallId: "558944" },
    ],
    yahooCategories: [
      { id: "all", name: "家具・インテリア総合", mallId: "2506" },
      { id: "furniture", name: "家具・収納", mallId: "2506" },
      { id: "kitchen", name: "キッチン・日用品", mallId: "2508" },
    ],
  }),

  pet: createBrand("pet", {
    brandName: "Bestie ペット",
    siteTitle: "ペット用品人気ランキング",
    tagline: "大切な家族の笑顔のために。最安値と品質を徹底比較。",
    description: "チモシーからドッグフードまで。ペットのための最安値と人気商品をライオンくんが徹底調査。",
    themeColor: { primary: "#b45309", accent: "#fbbf24" },
    eeat: {
      expertComment: "消耗品だからこそ安く、家族だからこそ良いものを。",
      brandStory: "「ペットと飼い主、両方の幸せ」を追求し、市場価格を監視します。"
    },
    theme: { background: "#fffbeb" },
    rakutenCategories: [
      { id: "dog", name: "犬用品", mallId: "507513" },
      { id: "cat", name: "猫用品", mallId: "507524" },
      { id: "small", name: "小動物用品", mallId: "565699" },
      { id: "timothy", name: "牧草", mallId: "565703" },
    ],
    yahooCategories: [
      { id: "dog", name: "犬用品", mallId: "4772" },
      { id: "cat", name: "猫用品", mallId: "4820" },
      { id: "small", name: "小動物用品", mallId: "32958" },
      { id: "timothy", name: "小動物用フード", mallId: "48396" },
    ],
  }),

  baby: createBrand("baby", {
    brandName: "Bestie ベビー",
    siteTitle: "ベビー・キッズ人気ランキング",
    tagline: "健やかな成長を支える。ママ・パパが選ぶ信頼の品々。",
    description: "おむつ、ベビーカー、知育玩具まで。売れているベビー用品をライオンくんが厳選しました。",
    themeColor: { primary: "#1d4ed8", accent: "#60a5fa" },
    eeat: {
      expertComment: "先輩ママ・パパの『支持数』が最も信頼できる指標になります。",
      brandStory: "「家族の時間を, もっと豊かに。」を目指し, 安全性と満足度の高いアイテムを可視化します。"
    },
    theme: { background: "#eff6ff" },
    rakutenCategories: [
      { id: "baby", name: "キッズ・ベビー・マタニティ", mallId: "100533" },
      { id: "toys", name: "おもちゃ", mallId: "566382" },
    ],
    yahooCategories: [
      { id: "baby", name: "ベビー、キッズ、マタニティ", mallId: "2497" },
      { id: "toys", name: "おもちゃ", mallId: "2119" },
    ],
  }),
};
