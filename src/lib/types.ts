export type CategoryConfig = {
  id: string;
  name: string;
  mallId: string;
  keyword?: string;
  minPrice?: number;
  description?: string;
  lionComment?: string;
};

export type SiteConfig = {
  id: string;
  domain: string;
  fallbackDomain?: string;
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

export type Product = {
  id: string;
  rank?: number;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  mall: "Amazon" | "Rakuten" | "Yahoo";
  shopName: string;
  url: string;
  description?: string;
  catchphrase?: string; // ショップ店長渾身のキャッチコピー
  expertReview?: {
    header: string;
    comment: string;
  };
  comparisonLabel?: string; // 比較に基づいた特別な称号（例：コスパ最強）
  isWRank?: boolean;
  rakutenUrl?: string;
  yahooUrl?: string;
  amazonUrl?: string;
  canonicalUrl?: string; // 統合された正当なURL
};

export type FavoriteItem = Product & {
  addedAt: number;
};