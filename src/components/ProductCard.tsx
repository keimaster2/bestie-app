"use client";

import FavoriteButton from "./FavoriteButton";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const [imgSrc, setImgSrc] = useState(product.image || "/placeholder.svg");
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

  // アフィリエイトリンクまたは検索リンクの生成
  const getMallUrl = (mall: "Rakuten" | "Yahoo" | "Amazon") => {
    // もしもアフィリエイトのID (本番環境では環境変数から取得)
    const rakutenAid = "5355389";
    const yahooAid = "5355394";

    if (mall === "Rakuten") {
      const url = product.rakutenUrl || `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(product.title)}/`;
      return `https://af.moshimo.com/af/c/click?a_id=${rakutenAid}&p_id=54&pc_id=54&pl_id=616&url=${encodeURIComponent(url)}`;
    }
    if (mall === "Yahoo") {
      const url = product.yahooUrl || `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(product.title)}`;
      return `https://af.moshimo.com/af/c/click?a_id=${yahooAid}&p_id=1225&pc_id=1925&pl_id=18502&url=${encodeURIComponent(url)}`;
    }
    if (mall === "Amazon") {
      // AmazonはもしもIDがまだ不明なため検索リンクのみ
      return `https://www.amazon.co.jp/s?k=${encodeURIComponent(product.title)}&tag=keimaster-22`; 
    }
    return "#";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 flex relative h-52 group">
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
          src={imgSrc} 
          alt={product.title}
          fill
          sizes="(max-width: 768px) 33vw, 20vw"
          className="object-contain p-2"
          onError={() => setImgSrc("/placeholder.svg")}
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
          
          <div className="flex items-center gap-1 mb-2 text-xs">
            <span className="text-yellow-400 font-bold">★{product.rating || 0}</span>
            <span className="text-gray-400">({(product.reviewCount || 0).toLocaleString()})</span>
          </div>

          <div className="text-lg font-bold text-red-600 font-mono leading-none">
            ¥{(product.price || 0).toLocaleString()}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-2">
          <a
            href={getMallUrl("Rakuten")}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] font-black px-2 py-1.5 rounded flex-1 text-center transition-all border
              ${product.rakutenUrl 
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 shadow-sm' 
                : 'bg-gray-50 text-gray-400 border-gray-100 hover:text-red-400 opacity-60'
              }`}
          >
            楽天
          </a>
          <a
            href={getMallUrl("Yahoo")}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] font-black px-2 py-1.5 rounded flex-1 text-center transition-all border
              ${product.yahooUrl 
                ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 shadow-sm' 
                : 'bg-gray-50 text-gray-400 border-gray-100 hover:text-blue-400 opacity-60'
              }`}
          >
            Yahoo
          </a>
          <a
            href={getMallUrl("Amazon")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-black px-2 py-1.5 rounded flex-1 text-center transition-all border bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 shadow-sm"
          >
            Amazon
          </a>
        </div>
      </div>
    </div>
  );
}
