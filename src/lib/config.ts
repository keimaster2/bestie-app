import { bestieBrand } from "./brands/bestie";
import { gadgetBrand } from "./brands/gadget";
import { beautyBrand } from "./brands/beauty";
import { gourmetBrand } from "./brands/gourmet";
import { outdoorBrand } from "./brands/outdoor";
import { gameBrand } from "./brands/game";
import { fashionBrand } from "./brands/fashion";
import { interiorBrand } from "./brands/interior";
import { petBrand } from "./brands/pet";
import { babyBrand } from "./brands/baby";

export type CategoryConfig = {
  id: string;
  name: string;
  mallId: string;
  keyword?: string; // 特定のキーワードで絞り込む場合に使用
  minPrice?: number;
  description?: string;
  lionComment?: string;
};

export type SiteConfig = {
  id: string;
  domain: string;
  fallbackDomain?: string; // 旧ドメイン(.pages.dev)用の互換性保持
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
    brandStory: string;
  };
  theme: {
    borderRadius: string;
    cardShadow: string;
    background: string;
  };
  rakutenCategories: CategoryConfig[];
  yahooCategories: CategoryConfig[];
};

export const SITE_REGISTRY: Record<string, SiteConfig> = {
  ...bestieBrand,
  ...gadgetBrand,
  ...beautyBrand,
  ...gourmetBrand,
  ...outdoorBrand,
  ...gameBrand,
  ...fashionBrand,
  ...interiorBrand,
  ...petBrand,
  ...babyBrand,
};

const DEFAULT_CONFIG = SITE_REGISTRY["bestie"];

export function getSiteConfig(brandOrHost?: string): SiteConfig {
  if (!brandOrHost) return DEFAULT_CONFIG;
  
  // 1. まずはID (beauty, gadgetなど) での直接検索
  const configById = SITE_REGISTRY[brandOrHost.toLowerCase()];
  if (configById) return configById;

  const cleanHost = brandOrHost.split(":")[0].toLowerCase();
  
  // 2. ホスト名 (beauty.bestieplus.com など) で判定
  // サブドメインが一致する場合を優先
  const matchedConfig = Object.values(SITE_REGISTRY).find(c => {
    const mainDomain = c.domain.toLowerCase();
    const fbDomain = c.fallbackDomain?.toLowerCase();
    
    // ホスト名がドメイン設定を含む、またはその逆
    return cleanHost === mainDomain || 
           (fbDomain && cleanHost === fbDomain) ||
           cleanHost.startsWith(mainDomain + ".") || // 安全策
           cleanHost.endsWith("." + mainDomain) ||
           (fbDomain && cleanHost.endsWith("." + fbDomain));
  });
  
  return matchedConfig || DEFAULT_CONFIG;
}
