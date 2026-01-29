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
