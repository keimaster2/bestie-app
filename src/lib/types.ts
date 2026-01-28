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
  isWRank?: boolean;
  rakutenUrl?: string;
  yahooUrl?: string;
  amazonUrl?: string;
};

export type FavoriteItem = Product & {
  addedAt: number;
};
