"use client";

import FavoriteButton from "./FavoriteButton";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const params = new URLSearchParams();
  if (product.title) params.set("title", product.title);
  if (product.price != null) params.set("price", product.price.toString());
  if (product.image) params.set("image", product.image);
  if (product.mall) params.set("mall", product.mall);
  if (product.url) params.set("url", product.url);
  if (product.shopName) params.set("shop", product.shopName);
  if (product.rating != null) params.set("rating", product.rating.toString());
  if (product.reviewCount != null) params.set("review", product.reviewCount.toString());

  const detailUrl = `/product/${product.id}?${params.toString()}`;

  const saveToHistory = () => {
    try {
      sessionStorage.setItem(`product-detail-${product.id}`, JSON.stringify(product));
    } catch (e) {
      console.error("Failed to save product detail", e);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 flex relative h-48 group">
      {/* 順位バッジ */}
      {product.rank && (
        <div className={`absolute -top-2 -left-2 w-9 h-9 flex items-center justify-center rounded-full z-10 font-bold text-base text-white shadow-md border-2 border-white
          ${product.rank === 1 ? "bg-yellow-400" : 
            product.rank === 2 ? "bg-gray-400" : 
            product.rank === 3 ? "bg-orange-400" : "bg-gray-800 text-xs w-7 h-7"}`
        }>
          {product.rank}
        </div>
      )}

      {/* お気に入りボタン */}
      <div className="absolute -top-3 -right-3 z-20 scale-90">
        <FavoriteButton product={{ ...product, id: product.id }} />
      </div>

      {/* 商品画像 */}
      <div className="w-1/3 bg-white flex-shrink-0 flex items-center justify-center relative p-2 border-r border-gray-100 rounded-l-xl">
        <Image 
          src={product.image || "/placeholder.svg"} 
          alt={product.title}
          fill
          sizes="(max-width: 768px) 33vw, 20vw"
          className="object-contain p-2"
        />
      </div>
      
      {/* 詳細情報 */}
      <div className="p-3 w-2/3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] text-gray-400 truncate flex-1">{product.shopName}</div>
            {product.isWRank && (
              <span className="text-[8px] font-black px-1 rounded-sm bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap ml-1">
                🏆 W RANK
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-3">
            <Link href={detailUrl} onClick={saveToHistory} className="hover:text-indigo-800 transition" prefetch={false}>
              {product.title}
            </Link>
          </h3>
          
          <div className="flex items-center gap-1 mb-1 text-xs">
            <span className="text-yellow-400 font-bold">★{product.rating || 0}</span>
            <span className="text-gray-400">({(product.reviewCount || 0).toLocaleString()})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-red-600 font-mono">
            ¥{(product.price || 0).toLocaleString()}
          </span>
          <a
            href={product.url} // 直接リンクに戻す（詳細ページ経由しない場合）
            target="_blank"
            rel="noopener noreferrer"
            onClick={saveToHistory}
            className={`text-xs font-bold px-3 py-1.5 rounded transition-colors border
              ${product.mall === 'Yahoo' 
                ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' 
                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
              }`}
          >
            見る
          </a>
        </div>
      </div>
    </div>
  );
}
