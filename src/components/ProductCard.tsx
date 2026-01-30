"use client";

import FavoriteButton from "./FavoriteButton";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product, SiteConfig } from "@/lib/types";
import { getBrandPath } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function ProductCard({ product, config }: { product: Product, config: SiteConfig }) {
  const [imgSrc, setImgSrc] = useState(product.image || "/placeholder.svg");
  const pathname = usePathname() || "";

  // 現在のブランドパスを特定
  const pathSegments = pathname.split('/');
  const brands = ["bestie", "beauty", "gadget", "gourmet", "outdoor", "game", "fashion", "interior", "pet", "baby"];
  const brandFromPath = brands.find(b => pathSegments.includes(b)) || "bestie";

  const getMoshimoAid = (mall: "Rakuten" | "Yahoo") => {
    if (mall === "Rakuten" && config.affiliate.rakutenAid) return config.affiliate.rakutenAid;
    if (mall === "Yahoo" && config.affiliate.yahooAid) return config.affiliate.yahooAid;
    return "";
  };

  const searchParams = new URLSearchParams();
  if (product.title) searchParams.set("title", product.title);
  if (product.price != null) searchParams.set("price", product.price.toString());
  if (product.image) searchParams.set("image", product.image);
  if (product.mall) searchParams.set("mall", product.mall);
  if (product.url) searchParams.set("url", product.url);
  if (product.shopName) searchParams.set("shop", product.shopName);
  if (product.rating != null) searchParams.set("rating", product.rating.toString());
  if (product.reviewCount != null) searchParams.set("review", product.reviewCount.toString());
  if (product.rakutenUrl) searchParams.set("rakutenUrl", product.rakutenUrl);
  if (product.yahooUrl) searchParams.set("yahooUrl", product.yahooUrl);
  if (product.catchphrase) searchParams.set("catchphrase", product.catchphrase);
  if (product.rank) searchParams.set("rank", product.rank.toString());

  const detailUrl = `${getBrandPath(brandFromPath, `/product/${product.id}`)}?${searchParams.toString()}`;

  const saveToHistory = () => {
    try {
      sessionStorage.setItem(`product-detail-${product.id}`, JSON.stringify(product));
    } catch (e) {}
  };

  const getMallUrl = (mall: "Rakuten" | "Yahoo" | "Amazon") => {
    if (mall === "Rakuten") {
      const rakutenAid = getMoshimoAid("Rakuten") || "5355389";
      const url = product.rakutenUrl || `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(product.title)}/`;
      return `https://af.moshimo.com/af/c/click?a_id=${rakutenAid}&p_id=54&pc_id=54&pl_id=616&url=${encodeURIComponent(url)}`;
    }
    if (mall === "Yahoo") {
      const yahooAid = getMoshimoAid("Yahoo") || "5355394";
      const url = product.yahooUrl || `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(product.title)}`;
      return `https://af.moshimo.com/af/c/click?a_id=${yahooAid}&p_id=1225&pc_id=1925&pl_id=18502&url=${encodeURIComponent(url)}`;
    }
    if (mall === "Amazon") {
      const tag = config.affiliate.amazonTag || "bestie-select-22";
      return `https://www.amazon.co.jp/s?k=${encodeURIComponent(product.title)}&tag=${tag}`; 
    }
    return "#";
  };

  const getLabelStyle = (label: string) => {
    if (label.includes("No.1") || label.includes("Ｎｏ．１") || label.includes("トップ")) return "bg-amber-500 text-white";
    if (label.includes("最安値")) return "bg-emerald-500 text-white";
    if (label.includes("口コミ")) return "bg-blue-600 text-white";
    if (label.includes("満足度")) return "bg-rose-600 text-white";
    return "bg-gray-700 text-white";
  };

  return (
    <div className={`bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 flex relative min-h-[190px] sm:h-[280px] group ${config.theme.borderRadius} ${config.theme.cardShadow}`}>
      {/* ランクバッジ */}
      <div className="absolute -top-3 -left-3 z-20">
          {(product.rank !== undefined && product.rank !== null && product.rank > 0) ? (
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full font-black text-lg sm:text-2xl text-white shadow-xl border-2 border-white transform group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: product.rank <= 3 ? 'var(--brand-accent)' : 'var(--brand-primary)' }}
            >
              {product.rank}
            </div>
          ) : (
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black text-white shadow-md border border-white tracking-widest`}
              style={{ backgroundColor: product.mall === "Yahoo" ? "#2563eb" : "#bf0000" }}
            >
              {product.mall === "Yahoo" ? "Y!" : "R"}
            </div>
          )}
      </div>

      {/* お気に入りボタン：右上に配置 */}
      <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:opacity-100">
        <FavoriteButton product={{ ...product, id: product.id }} />
      </div>

      {/* 商品画像エリア */}
      <div className={`w-[120px] sm:w-1/3 bg-white flex-shrink-0 flex items-center justify-center relative p-3 border-r border-gray-50`}>
        <Image 
          src={imgSrc} 
          alt={product.title}
          fill
          sizes="(max-width: 768px) 120px, 33vw"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc("/placeholder.svg")}
          priority={product.rank ? product.rank <= 6 : false}
        />
      </div>
      
      {/* コンテンツエリア */}
      <div className="p-3 sm:p-5 flex-grow flex flex-col justify-between overflow-hidden">
        <div className="flex-grow overflow-hidden text-left relative">
          
          {/* 上部：ショップ名 */}
          <div className="mb-1.5 pr-8">
            <div className="text-[10px] sm:text-xs font-bold text-gray-500 truncate flex-grow">
               {product.shopName}
            </div>
          </div>

          {/* 称号ラベル：視認性アップ */}
          {product.comparisonLabel && (
            <div className="mb-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] sm:text-xs font-black shadow-sm ${getLabelStyle(product.comparisonLabel)}`}>
                 <span className="animate-pulse">✨</span>
                 {product.comparisonLabel}
              </span>
            </div>
          )}

          {/* 商品タイトル：サイズアップ */}
          <h3 className="font-black text-sm sm:text-lg leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            <Link href={detailUrl} onClick={saveToHistory} className="hover:opacity-70 transition" style={{ color: 'var(--brand-primary)' }} prefetch={false}>
              {product.title}
            </Link>
          </h3>
          
          {/* 評価とレビュー */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5 text-yellow-500 font-black text-xs sm:text-sm">
              <span>★</span>
              <span>{product.rating || 0}</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 border-l border-gray-100 pl-2">
              {(product.reviewCount || 0).toLocaleString()} 件
            </span>
          </div>
        </div>

        {/* 価格：右寄せでアフィリエイトボタンの上に配置 */}
        <div className="flex flex-col items-end mb-2 pr-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-3xl font-black text-red-600 font-mono tracking-tighter">
              ¥{(product.price || 0).toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-xs font-black text-red-600 uppercase ml-1">税込</span>
          </div>
        </div>

        {/* 🌟 アフィリエイトボタン：サイズとフォント調整 */}
        <div className="grid grid-cols-3 gap-2 pt-3 mt-auto border-t border-gray-100">
          <a
            href={getMallUrl("Rakuten")}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center py-2 rounded-xl border-2 transition-all active:scale-95
              ${product.rakutenUrl 
                ? 'border-red-100 bg-red-50/50 hover:bg-red-500 hover:text-white hover:border-red-500' 
                : 'border-gray-50 bg-gray-50/30 opacity-50 cursor-not-allowed text-gray-300'
              }`}
          >
            <span className="text-[10px] sm:text-sm font-black tracking-tighter">楽天</span>
          </a>

          <a
            href={getMallUrl("Yahoo")}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center py-2 rounded-xl border-2 transition-all active:scale-95
              ${product.yahooUrl 
                ? 'border-blue-100 bg-blue-50/30 hover:bg-blue-600 hover:text-white hover:border-blue-500' 
                : 'border-gray-50 bg-gray-50/30 opacity-50 cursor-not-allowed text-gray-300'
              }`}
          >
            <span className="text-[10px] sm:text-sm font-black tracking-tighter">Yahoo!</span>
          </a>

          <a
            href={getMallUrl("Amazon")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 rounded-xl border-2 border-orange-100 bg-orange-50/50 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all active:scale-95"
          >
            <span className="text-[10px] sm:text-sm font-black tracking-tighter">Amazon</span>
          </a>
        </div>
      </div>
    </div>
  );
}
