import type { SiteConfig } from "../lib/types";

export const ALL_BRANDS: Record<string, SiteConfig> = {
  bestie: {
    id: "bestie",
    domain: "bestieplus.com",
    fallbackDomain: "bestie-app.pages.dev",
    brandName: "Bestie",
    siteTitle: "Bestie | 最高の相棒と見つける、本当に売れているもの",
    tagline: "あなたの生活に、最高のプラスを。モール横断ランキング・メディア",
    description: "楽天市場、Yahoo!ショッピング、Amazonを横断。本当に売れている人気商品をライオンくんが徹底比較し、あなたの『最高の相棒』を見つけます。",
    themeColor: { primary: "#111827", accent: "#4f46e5" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "膨大なデータの中から、真に価値のある一品を見つけ出す。それが私たちが目指す『Bestie』の姿です。",
      brandStory: "「買い物をもっと、賢く、楽しく。」を掲げ、日々更新される市場の熱狂を可視化します。"
    },
    theme: { background: "#ffffff", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
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
  },
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
  },
  beauty: {
    id: "beauty",
    domain: "beauty.bestieplus.com",
    fallbackDomain: "beauty.bestie-app.pages.dev",
    brandName: "Bestie ビューティー",
    siteTitle: "美容・コスメ人気ランキング",
    tagline: "自分史上最高の輝きを。今、愛されている美容コスメ。",
    description: "スキンケアからメイクアップ、美容家電まで。日本中の女性が実際に選んでいる『美の正解』をライオンくんがナビゲート。",
    themeColor: { primary: "#831843", accent: "#db2777" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "評価の分かれる美容アイテムだからこそ、『継続して売れ続けている実績』が何よりの信頼になります。",
      brandStory: "「毎日に、自信を。」をコンセプトに、透明性の高いランキングを提供します。"
    },
    theme: { background: "#fdf2f8", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
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
  },
  gourmet: {
    id: "gourmet",
    domain: "gourmet.bestieplus.com",
    fallbackDomain: "gourmet.bestie-app.pages.dev",
    brandName: "Bestie グルメ",
    siteTitle: "グルメ・お取り寄せ人気ランキング",
    tagline: "食卓に最高の感動を。今売れている至極のお取り寄せ。",
    description: "絶品スイーツから日本中の名産品、お酒まで。舌の肥えたユーザーが実際にリピートしているグルメをライオンくんが厳選。",
    themeColor: { primary: "#7c2d12", accent: "#ea580c" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "『美味しい』は数字に現れます。レビューの熱量とリピート率から、外さない逸品だけを選び抜きます。",
      brandStory: "「日本中の美味しいを、もっと身近に。」を掲げ、食のトレンドを追い続けます。"
    },
    theme: { background: "#fffaf8", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "all", name: "食品・スイーツ総合", mallId: "100227" },
      { id: "sweets", name: "スイーツ・お菓子", mallId: "551167" },
      { id: "drink", name: "水・ソフトドリンク", mallId: "100316" },
      { id: "alcohol", name: "ビール・洋酒", mallId: "510915" },
    ],
    yahooCategories: [
      { id: "all", name: "食品・ドリンク総合", mallId: "2498" },
      { id: "sweets", name: "スイーツ、お菓子", mallId: "2499" },
      { id: "drink", name: "水、炭酸水、ソフトドリンク", mallId: "2498" },
      { id: "alcohol", name: "お酒、ドリンク", mallId: "2498" },
    ],
  },
  outdoor: {
    id: "outdoor",
    domain: "outdoor.bestieplus.com",
    fallbackDomain: "outdoor.bestie-app.pages.dev",
    brandName: "Bestie アウトドア",
    siteTitle: "アウトドア・スポーツ人気ランキング",
    tagline: "遊びを本気に。今選ぶべき信頼のギアたち。",
    description: "キャンプ用品、登山、各種スポーツギア。過酷な環境でも信頼される売れ筋アイテムをライオンくんが徹底調査。",
    themeColor: { primary: "#166534", accent: "#22c55e" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "アウトドアは命を預けるもの。だからこそ、実際に多くの人に選ばれ、評価されている証拠を重視します。",
      brandStory: "「外遊びをもっと自由に。」をテーマに、プロも納得のギア選びをサポートします。"
    },
    theme: { background: "#f0fdf4", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "all", name: "スポーツ・アウトドア総合", mallId: "101070" },
      { id: "camp", name: "キャンプ・トレッキング", mallId: "302373" },
      { id: "golf", name: "ゴルフ", mallId: "101110" },
    ],
    yahooCategories: [
      { id: "all", name: "アウトドア・釣り総合", mallId: "2510" },
      { id: "camp", name: "アウトドア、キャンプ用品", mallId: "2510" },
      { id: "golf", name: "ゴルフ", mallId: "2510" },
    ],
  },
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
      expertComment: "ゲームの評価は鮮度が命. リアルタイムの売上と満足度から、真に遊ぶべき1本を導き出します。",
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
  },
  fashion: {
    id: "fashion",
    domain: "fashion.bestieplus.com",
    fallbackDomain: "fashion.bestie-app.pages.dev",
    brandName: "Bestie ファッション",
    siteTitle: "ファッション人気ランキング",
    tagline: "流行の一歩先を行く。今売れているアイテムを厳選。",
    description: "レディース、メンズ、小物まで。今、市場で最も支持されているトレンドアイテムをライオンくんが厳選。",
    themeColor: { primary: "#be185d", accent: "#f472b6" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "トレンドの移り変わりが激しいからこそ、データに基づいた『本当に売れているもの』が指針になります。",
      brandStory: "「おしゃれを、もっと賢く。」をテーマに、モールを横断した最新トレンドを分析します。"
    },
    theme: { background: "#fff1f2", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "ladies", name: "レディースファッション", mallId: "100371" },
      { id: "mens", name: "メンズファッション", mallId: "551177" },
      { id: "bags", name: "バッグ・小物・ブランド雑貨", mallId: "216131" },
    ],
    yahooCategories: [
      { id: "ladies", name: "レディースパジャマ", mallId: "23951" },
      { id: "mens", name: "メンズパジャマ", mallId: "36766" },
      { id: "bags", name: "レディース手袋", mallId: "24080" },
    ],
  },
  interior: {
    id: "interior",
    domain: "interior.bestieplus.com",
    fallbackDomain: "interior.bestie-app.pages.dev",
    brandName: "Bestie インテリア",
    siteTitle: "インテリア人気ランキング",
    tagline: "心地よい暮らしの主役。今、選ばれている家具・雑貨。",
    description: "家具、収納、寝具からキッチン用品まで。心地よい暮らしを作る売れ筋アイテムをライオンくんがナビゲート。",
    themeColor: { primary: "#065f46", accent: "#34d399" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "家は人生の基盤。長く愛せるもの、そして今多くの人に選ばれている『正解』をデータから導き出します。",
      brandStory: "「理想の部屋を、手の届く価格で。」をコンセプトに, コスパと品質のバランスを追求します。"
    },
    theme: { background: "#f0fdf4", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
    rakutenCategories: [
      { id: "furniture", name: "インテリア・寝具・収納", mallId: "100804" },
      { id: "bedding", name: "寝具", mallId: "215566" },
      { id: "kitchen", name: "キッチン用品・食器・調理器具", mallId: "558944" },
    ],
    yahooCategories: [
      { id: "furniture", name: "サンキャッチャー", mallId: "49257" },
      { id: "kitchen", name: "ジューサー、ミキサー、フードプロセッサー", mallId: "38072" },
    ],
  },
  pet: {
    id: "pet",
    domain: "pet.bestieplus.com",
    fallbackDomain: "pet.bestie-app.pages.dev",
    brandName: "Bestie ペット",
    siteTitle: "ペット用品人気ランキング",
    tagline: "大切な家族の笑顔のために。最安値と品質を徹底比較。",
    description: "チモシーからドッグフードまで。大切な家族であるペットのための最安値と人気商品をライオンくんが徹底調査。",
    themeColor: { primary: "#b45309", accent: "#fbbf24" },
    affiliate: { rakutenAid: "5355389", yahooAid: "5355394", amazonTag: "bestie-select-22" },
    eeat: {
      expertComment: "消耗品だからこそ安く、家族だからこそ良いものを。その矛盾を解決するのがモール横断検索の力です。",
      brandStory: "「ペットと飼い主、両方の幸せ」を追求し、日々変動する市場価格をライオンくんが監視します。"
    },
    theme: { background: "#fffbeb", borderRadius: "rounded-2xl", cardShadow: "shadow-lg" },
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
      { id: "timothy", name: "小動物用フード、おやつ", mallId: "48396" },
    ],
  },
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
  },
};
