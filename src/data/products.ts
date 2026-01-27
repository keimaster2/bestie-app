export interface Product {
  rank: 1 | 2 | 3;
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

export const categories: Category[] = [
  {
    id: "noise-cancelling-headphones",
    title: "最強のノイズキャンセリングヘッドホン TOP3",
    description: "カフェでも電車でも、瞬時に「自分だけの書斎」を作り出す魔法のツール。",
    products: [
      {
        rank: 1,
        name: "Sony WH-1000XM5",
        price: "¥49,800",
        description: "業界最高クラスのノイキャン性能と、AIによる通話品質向上。装着感も飛躍的に進化。",
        imageUrl: "https://placehold.co/600x400/111/FFF?text=Sony+XM5", 
        affiliateLink: "#",
        features: ["圧倒的な静寂", "軽量設計", "マルチポイント接続"]
      },
      {
        rank: 2,
        name: "Bose QuietComfort Ultra",
        price: "¥54,000",
        description: "Boseの低音と強力な消音性能は健在。没入感のある空間オーディオ機能が魅力。",
        imageUrl: "https://placehold.co/600x400/222/FFF?text=Bose+Ultra",
        affiliateLink: "#",
        features: ["空間オーディオ", "強力な低音", "快適なイヤーパッド"]
      },
      {
        rank: 3,
        name: "Apple AirPods Max",
        price: "¥84,800",
        description: "Apple製品との連携はピカイチ。デザインと質感が所有欲を満たす一台。",
        imageUrl: "https://placehold.co/600x400/EEE/333?text=AirPods+Max",
        affiliateLink: "#",
        features: ["Appleエコシステム", "高級感あるデザイン", "外音取り込みが自然"]
      }
    ]
  }
];
