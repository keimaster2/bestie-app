export interface Product {
  rank: number;
  name: string;
  price: string;
  description: string;
  imageUrl: string; // Placeholder for now
  affiliateLink: string; // Placeholder
  features: string[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  products: Product[];
}

// ダミーデータ（使わないけど型定義のため残すか、いっそ空にする）
export const categories: Category[] = [];
// Amazonデータも一旦削除
export const amazonProducts: any[] = [];
