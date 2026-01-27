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
    description: "「カフェでも電車でも、瞬時に『自分だけの書斎』を作り出す魔法のツール」。それが今のところの結論です。",
    products: [
      {
        rank: 1,
        name: "Sony WH-1000XM5",
        price: "¥49,800",
        description: "正直、デザインが変わった時は「え？」と思った。でも着けて納得。前作XM4で「静寂」だと思っていた空間が、実はまだうるさかったことに気づかされるレベル。特に人の話し声が消えるのが凄い。値段は可愛くないけど、毎日の通勤ストレスが消えるなら実質タダみたいなもん。",
        imageUrl: "https://placehold.co/600x400/111/FFF?text=Sony+XM5", 
        affiliateLink: "#",
        features: ["静寂すぎて怖くなるレベル", "メガネかけてても痛くならない", "通話品質がWEB会議で褒められた"]
      },
      {
        rank: 2,
        name: "Bose QuietComfort Ultra",
        price: "¥54,000",
        description: "「低音のBose」は健在だけど、今回の目玉はイマーシブオーディオ。音楽が頭の中で鳴るんじゃなくて、目の前のステージから聞こえてくる感覚。ライブ音源をよく聴くなら絶対にこっち。ただ、アプリの接続がたまに不安定なのが玉にキズ（アプデで直ることを祈る）。",
        imageUrl: "https://placehold.co/600x400/222/FFF?text=Bose+Ultra",
        affiliateLink: "#",
        features: ["ライブ会場にいるような没入感", "伝統の強力なノイキャン", "折りたためて持ち運び最高"]
      },
      {
        rank: 3,
        name: "Apple AirPods Max",
        price: "¥84,800",
        description: "高い。重い。ケースが変。…なのに、iPhoneユーザーなら結局これが最適解になってしまう悔しさ。Apple製品間の切り替えのスムーズさは魔法だし、アルミの質感は所有欲をこれでもかと満たしてくれる。「機能」というより「ラグジュアリーな体験」を買う感覚に近い。",
        imageUrl: "https://placehold.co/600x400/EEE/333?text=AirPods+Max",
        affiliateLink: "#",
        features: ["iPhone/Macとの連携が神", "所有欲を満たす圧倒的質感", "外音取り込みが自然すぎてビビる"]
      }
    ]
  }
];
