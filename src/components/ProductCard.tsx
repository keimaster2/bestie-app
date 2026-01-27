import FavoriteButton from "./FavoriteButton";

// 商品データの型（page.tsxと合わせる）
type Product = {
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
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 flex relative h-48">
      {/* 順位バッジ */}
      {product.rank && (
        <div className={`absolute top-0 left-0 w-10 h-10 flex items-center justify-center rounded-br-xl z-10 font-bold text-lg text-white shadow-sm
          ${product.rank === 1 ? "bg-yellow-400" : 
            product.rank === 2 ? "bg-gray-400" : 
            product.rank === 3 ? "bg-orange-400" : "bg-gray-800 text-sm w-8 h-8"}`
        }>
          {product.rank}
        </div>
      )}

      {/* お気に入りボタン（絶対配置） */}
      <div className="absolute top-2 right-2 z-20">
        <FavoriteButton product={product} />
      </div>

      {/* 商品画像エリア */}
      <div className="w-1/3 bg-white flex-shrink-0 flex items-center justify-center relative p-2 border-r border-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image} 
          alt={product.title}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      
      {/* 詳細情報 */}
      <div className="p-3 w-2/3 flex flex-col justify-between">
        <div>
          <div className="text-[10px] text-gray-400 mb-1 truncate">{product.shopName}</div>
          <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-3">
            <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-800 transition">
              {product.title}
            </a>
          </h3>
          
          <div className="flex items-center gap-1 mb-1 text-xs">
            <span className="text-yellow-400 font-bold">★{product.rating}</span>
            <span className="text-gray-400">({product.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-red-600 font-mono">
            ¥{product.price.toLocaleString()}
          </span>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-1.5 rounded hover:bg-red-100 transition-colors"
          >
            見る
          </a>
        </div>
      </div>
    </div>
  );
}
