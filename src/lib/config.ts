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
import type { SiteConfig } from "./types";

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
  
  const cleanHost = brandOrHost.split(":")[0].toLowerCase();
  
  // 1. ID Match (ladies, mens, beauty, gadget など、パスの1段目)
  // パラメータ経由で来た場合に最優先する
  const configById = SITE_REGISTRY[cleanHost];
  if (configById) return configById;

  // 2. Exact Host Match (beauty.bestieplus.com など、ホスト名そのもの)
  const exactHostMatch = Object.values(SITE_REGISTRY).find(c => 
    cleanHost === c.domain.toLowerCase() || 
    (c.fallbackDomain && cleanHost === c.fallbackDomain.toLowerCase())
  );
  if (exactHostMatch) return exactHostMatch;

  // 3. Prefix Match (beauty. かどうか)
  // ホスト名がサブドメイン形式の場合に、先頭の単語でマッチングを試みる
  const hostParts = cleanHost.split('.');
  if (hostParts.length > 1) {
    const prefixConfig = SITE_REGISTRY[hostParts[0]];
    if (prefixConfig) return prefixConfig;
  }
  
  return DEFAULT_CONFIG;
}
