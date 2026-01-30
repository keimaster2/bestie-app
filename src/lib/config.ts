import { ALL_BRANDS } from "@/data/brands";
import type { SiteConfig } from "./types";

export const SITE_REGISTRY: Record<string, SiteConfig> = ALL_BRANDS;

const DEFAULT_CONFIG = SITE_REGISTRY["bestie"];

export function getSiteConfig(brandOrHost?: string): SiteConfig {
  if (!brandOrHost || brandOrHost === "default" || brandOrHost === "index") return DEFAULT_CONFIG;
  
  const cleanHost = brandOrHost.split(":")[0].toLowerCase();
  
  // 1. ID Match (ladies, mens, beauty, gadget など、パスの1段目)
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
