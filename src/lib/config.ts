import { bestieBrand } from "./brands/bestie";
import { bestieGadgetBrand } from "./brands/bestie-gadget";
import { beautyBrand } from "./brands/beauty";

export type CategoryConfig = {
  id: string;
  name: string;
  mallId: string;
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
  ...bestieGadgetBrand,
  ...beautyBrand,
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
