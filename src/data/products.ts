import { Product } from "@/app/page"; 

export type ProductData = {
  id: string;
  rank?: number;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  // image: string; // 廃止
  asin?: string;   // Amazon用
  image?: string;  // 他モール用（互換性のため残す）
  mall: "Amazon" | "Rakuten" | "Yahoo";
  shopName: string;
  url: string;
};

// Amazonの手動おすすめ商品リスト
export const amazonProducts: ProductData[] = [
  // --- ガジェット・家電 ---
  {
    id: "amazon-xm5",
    rank: 1,
    title: "ソニー ワイヤレスノイズキャンセリングステレオヘッドセット WH-1000XM5",
    price: 48500,
    rating: 4.6,
    reviewCount: 3820,
    asin: "B09Y2H2B5V", // ASINを追加
    mall: "Amazon",
    shopName: "Amazon.co.jp",
    url: "https://www.amazon.co.jp/dp/B09Y2H2B5V/",
  },
  {
    id: "amazon-anker",
    rank: 2,
    title: "Anker Soundcore Liberty 4（Bluetooth 5.3）",
    price: 14990,
    rating: 4.4,
    reviewCount: 12500,
    asin: "B0B9M5D45C",
    mall: "Amazon",
    shopName: "Anker Direct",
    url: "https://www.amazon.co.jp/dp/B0B9M5D45C/",
  },
  {
    id: "amazon-kindle",
    rank: 3,
    title: "Kindle Paperwhite (16GB) 6.8インチディスプレイ",
    price: 19980,
    rating: 4.5,
    reviewCount: 8900,
    asin: "B09TMN5M3V",
    mall: "Amazon",
    shopName: "Amazon Devices",
    url: "https://www.amazon.co.jp/dp/B09TMN5M3V/",
  },
  {
    id: "amazon-firestick",
    rank: 4,
    title: "Fire TV Stick 4K Max(マックス)第2世代",
    price: 9980,
    rating: 4.3,
    reviewCount: 1500,
    asin: "B0BP9SNVFS",
    mall: "Amazon",
    shopName: "Amazon Devices",
    url: "https://www.amazon.co.jp/dp/B0BP9SNVFS/",
  },
  // --- 日用品・食品 ---
  {
    id: "amazon-water",
    rank: 5,
    title: "[Amazonブランド] Happy Belly 天然水ラベルレス 2L×9本",
    price: 1069,
    rating: 4.4,
    reviewCount: 22000,
    asin: "B08C4W7F2M",
    mall: "Amazon",
    shopName: "Amazon",
    url: "https://www.amazon.co.jp/dp/B08C4W7F2M/",
  },
  {
    id: "amazon-nuts",
    rank: 6,
    title: "ミックスナッツ 3種入り 850g 無塩",
    price: 1580,
    rating: 4.2,
    reviewCount: 8500,
    asin: "B07R55P7QW",
    mall: "Amazon",
    shopName: "NUTS TO YOU",
    url: "https://www.amazon.co.jp/dp/B07R55P7QW/",
  },
  // --- その他 ---
  {
    id: "amazon-towel",
    rank: 7,
    title: "タオル研究所 [ボリュームリッチ] #003 フェイスタオル 5枚セット",
    price: 1890,
    rating: 4.6,
    reviewCount: 45000,
    asin: "B07T4858XJ",
    mall: "Amazon",
    shopName: "タオル研究所",
    url: "https://www.amazon.co.jp/dp/B07T4858XJ/",
  },
  {
    id: "amazon-anker-cable",
    rank: 8,
    title: "Anker PowerLine III Flow USB-C & USB-C ケーブル 1.8m",
    price: 1890,
    rating: 4.7,
    reviewCount: 18000,
    asin: "B08F28956F",
    mall: "Amazon",
    shopName: "Anker Direct",
    url: "https://www.amazon.co.jp/dp/B08F28956F/",
  }
];
