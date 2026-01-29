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
  isWRank?: boolean;
  rakutenUrl?: string;
  yahooUrl?: string;
  amazonUrl?: string;
};

export type FavoriteItem = Product & {
  addedAt: number;
};
