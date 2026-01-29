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
  
  const config = SITE_REGISTRY[brandOrHost];
  if (config) return config;

  const cleanHost = brandOrHost.split(":")[0];
  const matchedConfig = Object.values(SITE_REGISTRY).find(c => cleanHost.includes(c.domain));
  
  return matchedConfig || DEFAULT_CONFIG;
}
