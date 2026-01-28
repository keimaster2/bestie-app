import { bestieBrand } from "./brands/bestie";
import { gadgetProBrand } from "./brands/gadget-pro";
import { beautyBrand } from "./brands/beauty";

export type SiteConfig = {
  id: string;
  domain: string;
  brandName: string;
  siteTitle: string;
  tagline: string;
  description: string;
  themeColor: {
    primary: string;
    accent: string;
  };
  affiliate: {
    rakutenAid: string;
    yahooAid: string;
    amazonTag: string;
  };
  eeat: {
    expertComment: string;
    brandStory: string;    // 各ブランド独自のミッション/想い
  };
  theme: {
    borderRadius: string; // "rounded-xl" や "rounded-full" など
    cardShadow: string;   // "shadow-sm" や "shadow-lg" など
    background: string;   // ページ全体の背景色 (hex)
  };
  categories: {
    id: string;
    name: string;
    rakutenId: string;
    yahooId: string;
    minPrice?: number;
  }[];
};

// 全ブランドのサイトを統合したレジストリ
export const SITE_REGISTRY: Record<string, SiteConfig> = {
  ...bestieBrand,
  ...gadgetProBrand,
  ...beautyBrand,
};

// 現在のリクエストに対応する設定を取得する関数
export function getSiteConfig(brandOrHost?: string): SiteConfig {
  if (!brandOrHost) return SITE_REGISTRY["bestie"];
  
  // 1. まずはブランド名(パス)で探す (例: "beauty")
  if (SITE_REGISTRY[brandOrHost]) {
    return SITE_REGISTRY[brandOrHost];
  }

  // 2. なければドメイン(ホスト名)で探す
  const cleanHost = brandOrHost.split(":")[0];
  const matchedConfig = Object.values(SITE_REGISTRY).find(c => cleanHost.includes(c.domain));
  
  return matchedConfig || SITE_REGISTRY["bestie"];
}
