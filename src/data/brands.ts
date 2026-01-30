import type { SiteConfig } from "../lib/types";

// 孱・・繝吶・繧ｹ險ｭ螳夲ｼ壼・繝悶Λ繝ｳ繝牙・騾壹・繝・ヵ繧ｩ繝ｫ繝亥､
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

// 屏・・繝悶Λ繝ｳ繝臥函謌舌・繝ｫ繝代・
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
    siteTitle: "Bestie | 譛鬮倥・逶ｸ譽偵→隕九▽縺代ｋ縲∵悽蠖薙↓螢ｲ繧後※縺・ｋ繧ゅ・",
    tagline: "縺ゅ↑縺溘・逕滓ｴｻ縺ｫ縲∵怙鬮倥・繝励Λ繧ｹ繧偵ゅΔ繝ｼ繝ｫ讓ｪ譁ｭ繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ繝ｻ繝｡繝・ぅ繧｢",
    description: "讌ｽ螟ｩ蟶ょｴ縲〆ahoo!繧ｷ繝ｧ繝・ヴ繝ｳ繧ｰ縲、mazon繧呈ｨｪ譁ｭ縲ゆｺｺ豌怜膚蜩√ｒ繝ｩ繧､繧ｪ繝ｳ縺上ｓ縺悟ｾｹ蠎墓ｯ碑ｼ・＠縲√≠縺ｪ縺溘・縲取怙鬮倥・逶ｸ譽偵上ｒ隕九▽縺代∪縺吶・,
    eeat: {
      expertComment: "閹ｨ螟ｧ縺ｪ繝・・繧ｿ縺ｮ荳ｭ縺九ｉ縲∫悄縺ｫ萓｡蛟､縺ｮ縺ゅｋ荳蜩√ｒ隕九▽縺大・縺吶ゅ◎繧後′遘√◆縺｡縺檎岼謖・☆縲撮estie縲上・蟋ｿ縺ｧ縺吶・,
      brandStory: "縲瑚ｲｷ縺・黄繧偵ｂ縺｣縺ｨ縲∬ｳ｢縺上∵･ｽ縺励￥縲ゅ阪ｒ謗ｲ縺偵∵律縲・峩譁ｰ縺輔ｌ繧句ｸょｴ縺ｮ辭ｱ迢ゅｒ蜿ｯ隕門喧縺励∪縺吶・
    },
    rakutenCategories: [
      { id: "all", name: "邱丞粋繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ", mallId: "0" },
      { id: "gadget", name: "螳ｶ髮ｻ繝ｻPC", mallId: "562637" },
      { id: "beauty", name: "鄒主ｮｹ繝ｻ蛛･蠎ｷ", mallId: "100939" },
      { id: "food", name: "鬟溷刀繝ｻ繧ｹ繧､繝ｼ繝・, mallId: "100227" },
      { id: "interior", name: "繧､繝ｳ繝・Μ繧｢", mallId: "100804" },
    ],
    yahooCategories: [
      { id: "all", name: "邱丞粋繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ", mallId: "1" },
      { id: "gadget", name: "螳ｶ髮ｻ繝ｻ繧ｹ繝槭・", mallId: "2502" },
      { id: "beauty", name: "繧ｳ繧ｹ繝｡繝ｻ蛛･蠎ｷ", mallId: "2501" },
      { id: "food", name: "鬟溷刀繝ｻ繝峨Μ繝ｳ繧ｯ", mallId: "2498" },
      { id: "interior", name: "螳ｶ蜈ｷ繝ｻ繧､繝ｳ繝・Μ繧｢", mallId: "2506" },
    ],
  }),

  gadget: createBrand("gadget", {
    brandName: "Bestie 繧ｬ繧ｸ繧ｧ繝・ヨ",
    siteTitle: "繧ｬ繧ｸ繧ｧ繝・ヨ繝ｻ螳ｶ髮ｻ莠ｺ豌励Λ繝ｳ繧ｭ繝ｳ繧ｰ",
    tagline: "譛ｪ譚･繧偵よ律蟶ｸ繧偵ゆｻ企∈縺ｶ縺ｹ縺肴怙鬮倥・繧ｬ繧ｸ繧ｧ繝・ヨ縲・,
    description: "譛譁ｰ縺ｮ繧ｹ繝槭・縲￣C縺九ｉ萓ｿ蛻ｩ縺ｪ逋ｽ迚ｩ螳ｶ髮ｻ縺ｾ縺ｧ縲ょｸょｴ縺ｧ螢ｲ繧後※縺・ｋ繧ｬ繧ｸ繧ｧ繝・ヨ繧偵Λ繧､繧ｪ繝ｳ縺上ｓ縺悟ｾｹ蠎墓ｯ碑ｼ・・,
    themeColor: { primary: "#1e40af", accent: "#3b82f6" },
    eeat: {
      expertComment: "繧ｹ繝壹ャ繧ｯ陦ｨ縺縺代〒縺ｯ隕九∴縺ｪ縺・取悽蠖薙・莠ｺ豌励上ｒ隗｣譏弱＠縺ｾ縺吶・,
      brandStory: "縲後ユ繧ｯ繝弱Ο繧ｸ繝ｼ繧偵√ｂ縺｣縺ｨ霄ｫ霑代↓縲ゅ阪ｒ繝・・繝槭↓縲∝､ｱ謨励＠縺ｪ縺・ｮｶ髮ｻ驕ｸ縺ｳ繧偵し繝昴・繝医＠縺ｾ縺吶・
    },
    theme: { background: "#f0f9ff" },
    rakutenCategories: [
      { id: "all", name: "螳ｶ髮ｻ繝ｻPC邱丞粋", mallId: "562637" },
      { id: "smartphone", name: "繧ｹ繝槭・繝ｻ繧ｿ繝悶Ξ繝・ヨ", mallId: "564500" },
      { id: "pc", name: "繝代た繧ｳ繝ｳ蜻ｨ霎ｺ讖溷勣", mallId: "100026" },
    ],
    yahooCategories: [
      { id: "all", name: "螳ｶ髮ｻ繝ｻ繧ｹ繝槭・邱丞粋", mallId: "2502" },
      { id: "smartphone", name: "繧ｹ繝槭・繝ｻ繧ｿ繝悶Ξ繝・ヨ", mallId: "2502" },
      { id: "pc", name: "繝代た繧ｳ繝ｳ蜻ｨ霎ｺ讖溷勣", mallId: "2502" },
    ],
  }),

  beauty: createBrand("beauty", {
    brandName: "Bestie 繝薙Η繝ｼ繝・ぅ繝ｼ",
    siteTitle: "鄒主ｮｹ繝ｻ繧ｳ繧ｹ繝｡莠ｺ豌励Λ繝ｳ繧ｭ繝ｳ繧ｰ",
    tagline: "閾ｪ蛻・彰荳頑怙鬮倥・霈昴″繧偵ゆｻ翫∵・縺輔ｌ縺ｦ縺・ｋ鄒主ｮｹ繧ｳ繧ｹ繝｡縲・,
    description: "繧ｹ繧ｭ繝ｳ繧ｱ繧｢縺九ｉ繝｡繧､繧ｯ繧｢繝・・縲∫ｾ主ｮｹ螳ｶ髮ｻ縺ｾ縺ｧ縲よ律譛ｬ荳ｭ縺ｮ螂ｳ諤ｧ縺悟ｮ滄圀縺ｫ驕ｸ繧薙〒縺・ｋ縲守ｾ弱・豁｣隗｣縲上ｒ繝ｩ繧､繧ｪ繝ｳ縺上ｓ縺後リ繝薙ご繝ｼ繝医・,
    themeColor: { primary: "#831843", accent: "#db2777" },
    eeat: {
      expertComment: "隧穂ｾ｡縺ｮ蛻・°繧後ｋ鄒主ｮｹ繧｢繧､繝・Β縺縺九ｉ縺薙◎縲√主ｮ溽ｸｾ縲上′菫｡鬆ｼ縺ｫ縺ｪ繧翫∪縺吶・,
      brandStory: "縲梧ｯ取律縺ｫ縲∬・菫｡繧偵ゅ阪ｒ繧ｳ繝ｳ繧ｻ繝励ヨ縺ｫ縲・乗・諤ｧ縺ｮ鬮倥＞繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ繧呈署萓帙＠縺ｾ縺吶・
    },
    theme: { background: "#fdf2f8" },
    rakutenCategories: [
      { id: "all", name: "鄒主ｮｹ繝ｻ蛛･蠎ｷ邱丞粋", mallId: "100939" },
      { id: "skincare", name: "繧ｹ繧ｭ繝ｳ繧ｱ繧｢", mallId: "100947" },
      { id: "haircare", name: "繝倥い繧ｱ繧｢", mallId: "100944" },
    ],
    yahooCategories: [
      { id: "all", name: "繧ｳ繧ｹ繝｡繝ｻ鄒主ｮｹ邱丞粋", mallId: "2501" },
      { id: "skincare", name: "繧ｹ繧ｭ繝ｳ繧ｱ繧｢", mallId: "2501" },
      { id: "haircare", name: "繝倥い繧ｱ繧｢", mallId: "2501" },
    ],
  }),

  gourmet: createBrand("gourmet", {
    brandName: "Bestie 繧ｰ繝ｫ繝｡",
    siteTitle: "繧ｰ繝ｫ繝｡繝ｻ縺雁叙繧雁ｯ・○莠ｺ豌励Λ繝ｳ繧ｭ繝ｳ繧ｰ",
    tagline: "鬟溷酷縺ｫ譛鬮倥・諢溷虚繧偵ゆｻ雁｣ｲ繧後※縺・ｋ閾ｳ讌ｵ縺ｮ縺雁叙繧雁ｯ・○縲・,
    description: "邨ｶ蜩√せ繧､繝ｼ繝・°繧画律譛ｬ荳ｭ縺ｮ蜷咲肇蜩√√♀驟偵∪縺ｧ縲ゅΜ繝斐・繝医＆繧後※縺・ｋ繧ｰ繝ｫ繝｡繧偵Λ繧､繧ｪ繝ｳ縺上ｓ縺悟宍驕ｸ縲・,
    themeColor: { primary: "#7c2d12", accent: "#ea580c" },
    eeat: {
      expertComment: "縲守ｾ主袖縺励＞縲上・謨ｰ蟄励↓迴ｾ繧後∪縺吶ゅΞ繝薙Η繝ｼ縺ｮ辭ｱ驥上°繧峨∝､悶＆縺ｪ縺・ｸ蜩√ｒ驕ｸ縺ｳ謚懊″縺ｾ縺吶・,
      brandStory: "縲梧律譛ｬ荳ｭ縺ｮ鄒主袖縺励＞繧偵√ｂ縺｣縺ｨ霄ｫ霑代↓縲ゅ阪ｒ謗ｲ縺偵・｣溘・繝医Ξ繝ｳ繝峨ｒ霑ｽ縺・ｶ壹￠縺ｾ縺吶・
    },
    theme: { background: "#fffaf8" },
    rakutenCategories: [
      { id: "all", name: "鬟溷刀繝ｻ繧ｹ繧､繝ｼ繝・ｷ丞粋", mallId: "100227" },
      { id: "sweets", name: "繧ｹ繧､繝ｼ繝・・縺願藷蟄・, mallId: "551167" },
      { id: "drink", name: "豌ｴ繝ｻ繧ｽ繝輔ヨ繝峨Μ繝ｳ繧ｯ", mallId: "100316" },
      { id: "alcohol", name: "繝薙・繝ｫ繝ｻ豢矩・", mallId: "510915" },
    ],
    yahooCategories: [
      { id: "all", name: "鬟溷刀繝ｻ繝峨Μ繝ｳ繧ｯ邱丞粋", mallId: "2498" },
      { id: "sweets", name: "繧ｹ繧､繝ｼ繝・√♀闖灘ｭ・, mallId: "2499" },
      { id: "drink", name: "豌ｴ縲∫く驟ｸ豌ｴ縲√た繝輔ヨ繝峨Μ繝ｳ繧ｯ", mallId: "2498" },
      { id: "alcohol", name: "縺企・縲√ラ繝ｪ繝ｳ繧ｯ", mallId: "2498" },
    ],
  }),

  outdoor: createBrand("outdoor", {
    brandName: "Bestie 繧｢繧ｦ繝医ラ繧｢",
    siteTitle: "繧｢繧ｦ繝医ラ繧｢繝ｻ繧ｹ繝昴・繝・ｺｺ豌励Λ繝ｳ繧ｭ繝ｳ繧ｰ",
    tagline: "驕翫・繧呈悽豌励↓. 莉企∈縺ｶ縺ｹ縺堺ｿ｡鬆ｼ縺ｮ繧ｮ繧｢縺溘■.",
    description: "繧ｭ繝｣繝ｳ繝礼畑蜩√∫匳螻ｱ縲∝推遞ｮ繧ｹ繝昴・繝・ぐ繧｢縲ゆｿ｡鬆ｼ縺輔ｌ繧句｣ｲ繧檎ｭ九い繧､繝・Β繧偵Λ繧､繧ｪ繝ｳ縺上ｓ縺悟ｾｹ蠎戊ｪｿ譟ｻ縲・,
    themeColor: { primary: "#166534", accent: "#22c55e" },
    eeat: {
      expertComment: "繧｢繧ｦ繝医ラ繧｢縺ｯ蜻ｽ繧帝舌￠繧九ｂ縺ｮ縲りｩ穂ｾ｡縺輔ｌ縺ｦ縺・ｋ險ｼ諡繧帝㍾隕悶＠縺ｾ縺吶・,
      brandStory: "縲悟､夜♀縺ｳ繧偵ｂ縺｣縺ｨ閾ｪ逕ｱ縺ｫ縲ゅ阪ｒ繝・・繝槭↓縲√・繝ｭ繧らｴ榊ｾ励・繧ｮ繧｢驕ｸ縺ｳ繧偵し繝昴・繝医＠縺ｾ縺吶・
    },
    theme: { background: "#f0fdf4" },
    rakutenCategories: [
      { id: "all", name: "繧ｹ繝昴・繝・・繧｢繧ｦ繝医ラ繧｢邱丞粋", mallId: "101070" },
      { id: "camp", name: "繧ｭ繝｣繝ｳ繝励・繝医Ξ繝・く繝ｳ繧ｰ", mallId: "302373" },
      { id: "golf", name: "繧ｴ繝ｫ繝・, mallId: "101110" },
    ],
    yahooCategories: [
      { id: "all", name: "繧｢繧ｦ繝医ラ繧｢繝ｻ驥｣繧顔ｷ丞粋", mallId: "2510" },
      { id: "camp", name: "繧｢繧ｦ繝医ラ繧｢縲√く繝｣繝ｳ繝礼畑蜩・, mallId: "2510" },
      { id: "golf", name: "繧ｴ繝ｫ繝・, mallId: "2510" },
    ],
  }),

  game: createBrand("game", {
    brandName: "Bestie 繧ｲ繝ｼ繝",
    siteTitle: "繧ｲ繝ｼ繝莠ｺ豌励Λ繝ｳ繧ｭ繝ｳ繧ｰ",
    tagline: "譛鬮倥・豐｡蜈･菴馴ｨ薙ｒ縲ゆｻ顔・縺・ご繝ｼ繝縺ｮ縺吶∋縺ｦ縲・,
    description: "Switch縲￣S5縺九ｉ繝ｬ繝医Ο繧ｲ繝ｼ繝縺ｾ縺ｧ縲ゅΛ繧､繧ｪ繝ｳ縺上ｓ縺悟ｸょｴ繧貞・譫舌＠縺ｾ縺吶・,
    themeColor: { primary: "#4c1d95", accent: "#c026d3" },
    eeat: {
      expertComment: "繧ｲ繝ｼ繝縺ｮ隧穂ｾ｡縺ｯ魄ｮ蠎ｦ縺悟多. 逵溘↓驕翫・縺ｹ縺・譛ｬ繧貞ｰ弱″蜃ｺ縺励∪縺吶・,
      brandStory: "縲後☆縺ｹ縺ｦ縺ｮ繝励Ξ繧､繝､繝ｼ縺ｫ譛鬮倥・蜀帝匱繧偵ゅ阪ｒ逶ｮ謖・＠縲√ご繝ｼ繝縺ｮ辭ｱ迢ゅｒ繝・・繧ｿ縺ｧ陬乗遠縺｡縺励∪縺吶・
    },
    theme: { background: "#f5f3ff" },
    rakutenCategories: [
      { id: "all", name: "繧ｲ繝ｼ繝邱丞粋", mallId: "101205" },
      { id: "switch", name: "Nintendo Switch", mallId: "565950" },
      { id: "ps5", name: "PlayStation 5", mallId: "566382" },
      { id: "retro", name: "繝ｬ繝医Ο繧ｲ繝ｼ繝", mallId: "101240" },
    ],
    yahooCategories: [
      { id: "all", name: "繧ｲ繝ｼ繝邱丞粋", mallId: "2511" },
      { id: "switch", name: "Nintendo Switch", mallId: "47330" },
      { id: "ps5", name: "PlayStation 5", mallId: "49340" },
      { id: "retro", name: "繝ｬ繝医Ο繧ｲ繝ｼ繝", mallId: "2566" },
    ],
  }),

  fashion: createBrand("fashion", {
    brandName: "Bestie 繝輔ぃ繝・す繝ｧ繝ｳ",
    siteTitle: "繝輔ぃ繝・す繝ｧ繝ｳ莠ｺ豌励Λ繝ｳ繧ｭ繝ｳ繧ｰ",
    tagline: "豬∬｡後・荳豁ｩ蜈医ｒ陦後￥縲ゆｻ雁｣ｲ繧後※縺・ｋ繧｢繧､繝・Β繧貞宍驕ｸ縲・,
    description: "繝ｬ繝・ぅ繝ｼ繧ｹ縲√Γ繝ｳ繧ｺ縲∝ｰ冗黄縺ｾ縺ｧ縲ょｸょｴ縺ｧ謾ｯ謖√＆繧後※縺・ｋ繝医Ξ繝ｳ繝峨い繧､繝・Β繧偵Λ繧､繧ｪ繝ｳ縺上ｓ縺悟宍驕ｸ縲・,
    themeColor: { primary: "#be185d", accent: "#f472b6" },
    eeat: {
      expertComment: "繝医Ξ繝ｳ繝峨・遘ｻ繧雁､峨ｏ繧翫′豼縺励＞縺九ｉ縺薙◎縲√ョ繝ｼ繧ｿ縺梧欠驥昴↓縺ｪ繧翫∪縺吶・,
      brandStory: "縲後♀縺励ｃ繧後ｒ縲√ｂ縺｣縺ｨ雉｢縺上ゅ阪ｒ繝・・繝槭↓縲∵怙譁ｰ繝医Ξ繝ｳ繝峨ｒ蛻・梵縺励∪縺吶・
    },
    theme: { background: "#fff1f2" },
    rakutenCategories: [
      { id: "ladies", name: "繝ｬ繝・ぅ繝ｼ繧ｹ繝輔ぃ繝・す繝ｧ繝ｳ", mallId: "100371" },
      { id: "mens", name: "繝｡繝ｳ繧ｺ繝輔ぃ繝・す繝ｧ繝ｳ", mallId: "551177" },
      { id: "bags", name: "繝舌ャ繧ｰ繝ｻ蟆冗黄繝ｻ繝悶Λ繝ｳ繝蛾尅雋ｨ", mallId: "216131" },
    ],
    yahooCategories: [
      { id: "ladies", name: "繝ｬ繝・ぅ繝ｼ繧ｹ繝輔ぃ繝・す繝ｧ繝ｳ", mallId: "2494" },
      { id: "mens", name: "繝｡繝ｳ繧ｺ繝輔ぃ繝・す繝ｧ繝ｳ", mallId: "2495" },
      { id: "bags", name: "繝舌ャ繧ｰ繝ｻ蟆冗黄繝ｻ繝悶Λ繝ｳ繝蛾尅雋ｨ", mallId: "2496" },
    ],
  }),

  interior: createBrand("interior", {
    brandName: "Bestie 繧､繝ｳ繝・Μ繧｢",
    siteTitle: "繧､繝ｳ繝・Μ繧｢莠ｺ豌励Λ繝ｳ繧ｭ繝ｳ繧ｰ",
    tagline: "蠢・慍繧医＞證ｮ繧峨＠縺ｮ荳ｻ蠖ｹ縲ゆｻ翫・∈縺ｰ繧後※縺・ｋ螳ｶ蜈ｷ繝ｻ髮題ｲｨ縲・,
    description: "螳ｶ蜈ｷ縲∝庶邏阪∝ｯ晏・縺九ｉ繧ｭ繝・メ繝ｳ逕ｨ蜩√∪縺ｧ縲ょｿ・慍繧医＞證ｮ繧峨＠繧剃ｽ懊ｋ繧｢繧､繝・Β繧偵Λ繧､繧ｪ繝ｳ縺上ｓ縺後リ繝薙ご繝ｼ繝医・,
    themeColor: { primary: "#065f46", accent: "#34d399" },
    eeat: {
      expertComment: "髟ｷ縺乗・縺帙ｋ繧ゅ・縲∵ｭ｣隗｣繧偵ョ繝ｼ繧ｿ縺九ｉ蟆弱″蜃ｺ縺励∪縺吶・,
      brandStory: "縲檎炊諠ｳ縺ｮ驛ｨ螻九ｒ縲∵焔縺ｮ螻翫￥萓｡譬ｼ縺ｧ縲ゅ阪ｒ繧ｳ繝ｳ繧ｻ繝励ヨ縺ｫ, 繧ｳ繧ｹ繝代→蜩∬ｳｪ繧定ｿｽ豎ゅ＠縺ｾ縺吶・
    },
    theme: { background: "#f0fdf4" },
    rakutenCategories: [
      { id: "furniture", name: "繧､繝ｳ繝・Μ繧｢繝ｻ蟇晏・繝ｻ蜿守ｴ・, mallId: "100804" },
      { id: "bedding", name: "蟇晏・", mallId: "215566" },
      { id: "kitchen", name: "繧ｭ繝・メ繝ｳ逕ｨ蜩√・鬟溷勣繝ｻ隱ｿ逅・勣蜈ｷ", mallId: "558944" },
    ],
    yahooCategories: [
      { id: "all", name: "螳ｶ蜈ｷ繝ｻ繧､繝ｳ繝・Μ繧｢邱丞粋", mallId: "2506" },
      { id: "furniture", name: "螳ｶ蜈ｷ繝ｻ蜿守ｴ・, mallId: "2506" },
      { id: "kitchen", name: "繧ｭ繝・メ繝ｳ繝ｻ譌･逕ｨ蜩・, mallId: "2508" },
    ],
  }),

  pet: createBrand("pet", {
    brandName: "Bestie 繝壹ャ繝・,
    siteTitle: "繝壹ャ繝育畑蜩∽ｺｺ豌励Λ繝ｳ繧ｭ繝ｳ繧ｰ",
    tagline: "螟ｧ蛻・↑螳ｶ譌上・隨鷹｡斐・縺溘ａ縺ｫ縲よ怙螳牙､縺ｨ蜩∬ｳｪ繧貞ｾｹ蠎墓ｯ碑ｼ・・,
    description: "繝√Δ繧ｷ繝ｼ縺九ｉ繝峨ャ繧ｰ繝輔・繝峨∪縺ｧ縲ゅ・繝・ヨ縺ｮ縺溘ａ縺ｮ譛螳牙､縺ｨ莠ｺ豌怜膚蜩√ｒ繝ｩ繧､繧ｪ繝ｳ縺上ｓ縺悟ｾｹ蠎戊ｪｿ譟ｻ縲・,
    themeColor: { primary: "#b45309", accent: "#fbbf24" },
    eeat: {
      expertComment: "豸郁怜刀縺縺九ｉ縺薙◎螳峨￥縲∝ｮｶ譌上□縺九ｉ縺薙◎濶ｯ縺・ｂ縺ｮ繧偵・,
      brandStory: "縲後・繝・ヨ縺ｨ鬟ｼ縺・ｸｻ縲∽ｸ｡譁ｹ縺ｮ蟷ｸ縺帙阪ｒ霑ｽ豎ゅ＠縲∝ｸょｴ萓｡譬ｼ繧堤屮隕悶＠縺ｾ縺吶・
    },
    theme: { background: "#fffbeb" },
    rakutenCategories: [
      { id: "dog", name: "迥ｬ逕ｨ蜩・, mallId: "507513" },
      { id: "cat", name: "迪ｫ逕ｨ蜩・, mallId: "507524" },
      { id: "small", name: "蟆丞虚迚ｩ逕ｨ蜩・, mallId: "565699" },
      { id: "timothy", name: "迚ｧ闕・, mallId: "565703" },
    ],
    yahooCategories: [
      { id: "dog", name: "迥ｬ逕ｨ蜩・, mallId: "4772" },
      { id: "cat", name: "迪ｫ逕ｨ蜩・, mallId: "4820" },
      { id: "small", name: "蟆丞虚迚ｩ逕ｨ蜩・, mallId: "32958" },
      { id: "timothy", name: "蟆丞虚迚ｩ逕ｨ繝輔・繝峨√♀繧・▽", mallId: "48396" },
    ],
  }),

  baby: createBrand("baby", {
    brandName: "Bestie 繝吶ン繝ｼ",
    siteTitle: "繝吶ン繝ｼ繝ｻ繧ｭ繝・ぜ莠ｺ豌励Λ繝ｳ繧ｭ繝ｳ繧ｰ",
    tagline: "蛛･繧・°縺ｪ謌宣聞繧呈髪縺医ｋ縲ゅ・繝槭・繝代ヱ縺碁∈縺ｶ菫｡鬆ｼ縺ｮ蜩√・・,
    description: "縺翫・縺､縲√・繝薙・繧ｫ繝ｼ縲∫衍閧ｲ邇ｩ蜈ｷ縺ｾ縺ｧ縲ょ｣ｲ繧後※縺・ｋ繝吶ン繝ｼ逕ｨ蜩√ｒ繝ｩ繧､繧ｪ繝ｳ縺上ｓ縺悟宍驕ｸ縺励∪縺励◆縲・,
    themeColor: { primary: "#1d4ed8", accent: "#60a5fa" },
    eeat: {
      expertComment: "蜈郁ｼｩ繝槭・繝ｻ繝代ヱ縺ｮ縲取髪謖∵焚縲上′譛繧ゆｿ｡鬆ｼ縺ｧ縺阪ｋ謖・ｨ吶↓縺ｪ繧翫∪縺吶・,
      brandStory: "縲悟ｮｶ譌上・譎る俣繧・ 繧ゅ▲縺ｨ雎翫°縺ｫ縲ゅ阪ｒ逶ｮ謖・＠, 螳牙・諤ｧ縺ｨ貅雜ｳ蠎ｦ縺ｮ鬮倥＞繧｢繧､繝・Β繧貞庄隕門喧縺励∪縺吶・
    },
    theme: { background: "#eff6ff" },
    rakutenCategories: [
      { id: "baby", name: "繧ｭ繝・ぜ繝ｻ繝吶ン繝ｼ繝ｻ繝槭ち繝九ユ繧｣", mallId: "100533" },
      { id: "toys", name: "縺翫ｂ縺｡繧・, mallId: "566382" },
    ],
    yahooCategories: [
      { id: "baby", name: "繝吶ン繝ｼ縲√く繝・ぜ縲√・繧ｿ繝九ユ繧｣", mallId: "2497" },
      { id: "toys", name: "縺翫ｂ縺｡繧・, mallId: "2119" },
    ],
  }),
};
