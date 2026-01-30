"use client";

import FavoriteButton from "./FavoriteButton";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Product, SiteConfig } from "@/lib/types";
import { getBrandPath } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function ProductCard({ product, config }: { product: Product, config: SiteConfig }) {
  const [imgSrc, setImgSrc] = useState(product.image || "/placeholder.svg");
  const pathname = usePathname() || "";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 現在のブランドパスを特定
  const pathSegments = pathname.split('/');
  const brands = ["bestie", "beauty", "gadget", "gourmet", "outdoor", "game", "fashion", "interior", "pet", "baby"];
  const brandFromPath = brands.find(b => pathSegments.includes(b)) || "bestie";

  const getMoshimoAid = (mall: "Rakuten" | "Yahoo") => {
    if (mall === "Rakuten" && config.affiliate.rakutenAid) return config.affiliate.rakutenAid;
    if (mall === "Yahoo" && config.affiliate.yahooAid) return config.affiliate.yahooAid;
    const key = mall === "Rakuten" ? "NEXT_PUBLIC_MOSHIMO_RAKUTEN_AID" : "NEXT_PUBLIC_MOSHIMO_YAHOO_AID";
    return process.env[key] || "";
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

  // 🛡️ 本番環境のサブドメイン運用時は、絶対URLを生成
  // ハイドレーションエラー防止のため、マウント前は常に絶対URL（サーバー側と同じ）にする
  const isLocal = mounted && typeof window !== "undefined" && window.location.hostname.includes("localhost");
  const detailUrl = isLocal 
    ? `${getBrandPath(brandFromPath, `/product/${product.id}`)}?${searchParams.toString()}`
    : `https://${config.domain}/product/${product.id}?${searchParams.toString()}`;

  const saveToHistory = () => {
    try {
      sessionStorage.setItem(`product-detail-${product.id}`, JSON.stringify(product));
    } catch (e) {
      console.error("Failed to save product detail", e);
    }
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
    if (label.includes("No.1") || label.includes("トップ")) return "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-200";
    if (label.includes("最安値")) return "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-emerald-200";
    if (label.includes("口コミ")) return "bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-200";
    if (label.includes("満足度")) return "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-rose-200";
    return "bg-gray-800 text-white shadow-gray-200";
  };

  return (
    <div className={`bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 flex relative h-[280px] group ${config.theme.borderRadius} ${config.theme.cardShadow}`}>
      {/* 左上のバッジ群 */}
      <div className="absolute -top-2.5 -left-2.5 z-10 flex flex-col gap-1.5 items-start">
        <div className="flex items-center gap-1.5">
          {(product.rank !== undefined && product.rank !== null && product.rank > 0) ? (
            <div className="w-10 h-10 flex items-center justify-center rounded-full font-black text-lg text-white shadow-lg border-2 border-white transform group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: product.rank <= 3 ? 'var(--brand-accent)' : 'var(--brand-primary)' }}
            >
              {product.rank}
            </div>
          ) : (
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black text-white shadow-md border border-white tracking-widest`}
              style={{ backgroundColor: product.mall === "Yahoo" ? "#2563eb" : "#bf0000" }}
            >
              {product.mall === "Yahoo" ? "Yahoo!ショッピング" : "楽天市場"}
            </div>
          )}
          {product.isWRank && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full shadow-md border border-white text-white bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse">
              🏆 W RANK
            </span>
          )}
        </div>
        
        {product.comparisonLabel && (
          <div className={`${getLabelStyle(product.comparisonLabel)} text-[11px] font-black px-3.5 py-1.5 rounded-r-full rounded-tl-none shadow-lg border-l-4 border-white/30 flex items-center gap-2 animate-in slide-in-from-left-2 duration-500 -ml-1`}>
             <span className="text-sm">✨</span>
             <span className="tracking-tight">{product.comparisonLabel}</span>
          </div>
        )}
      </div>

      <div className="absolute -top-3 -right-3 z-20 scale-90 group-hover:scale-105 transition-transform duration-300">
        <FavoriteButton product={{ ...product, id: product.id }} />
      </div>

      {/* 商品画像 */}
      <div className={`w-1/3 bg-white flex-shrink-0 flex items-center justify-center relative p-3 border-r border-gray-50`}>
        <Image 
          src={imgSrc} 
          alt={product.title}
          fill
          sizes="(max-width: 768px) 33vw, 20vw"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc("/placeholder.svg")}
        />
      </div>
      
      {/* 商品情報 */}
      <div className="p-4 w-2/3 flex flex-col justify-between overflow-hidden">
        <div className="flex-grow overflow-hidden text-left">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] font-bold text-gray-400 truncate flex-1 tracking-tighter">
               {product.shopName}
            </div>
          </div>
          <h3 className="font-bold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {isLocal ? (
              <Link href={detailUrl} onClick={saveToHistory} className="hover:opacity-70 transition" style={{ color: 'var(--brand-primary)' }} prefetch={false}>
                {product.title}
              </Link>
            ) : (
              <a href={detailUrl} onClick={saveToHistory} className="hover:opacity-70 transition" style={{ color: 'var(--brand-primary)' }}>
                {product.title}
              </a>
            )}
          </h3>
          
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex items-center gap-0.5 text-yellow-400 font-black text-[10px] bg-yellow-50 px-1 py-0.5 rounded-md">
              <span>★</span>
              <span>{product.rating || 0}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 border-l border-gray-200 pl-2">
              {(product.reviewCount || 0).toLocaleString()} 件
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-xl font-black text-red-600 font-mono tracking-tighter">
              ¥{(product.price || 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-black text-red-600">税込</span>
          </div>

          {product.catchphrase && (
            <p className="text-[10px] text-gray-500 line-clamp-1 italic leading-relaxed border-l-2 border-gray-200 pl-2 group-hover:border-indigo-400 transition-colors">
              {product.catchphrase}
            </p>
          )}
        </div>

        {/* 🌟 プレミアム・アフィリエイトボタン (3カラム・アウトライン形式) */}
        <div className="grid grid-cols-3 gap-1.5 pt-3 mt-auto border-t border-gray-50">
          {/* Rakuten */}
          <a
            href={getMallUrl("Rakuten")}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/btn flex flex-col items-center justify-center py-1.5 rounded-xl border-2 transition-all active:scale-95
              ${product.rakutenUrl 
                ? 'border-red-100 bg-red-50/30 hover:bg-red-50 hover:border-red-500' 
                : 'border-gray-50 bg-gray-50/50 opacity-50 italic cursor-not-allowed'
              }`}
          >
            <span className={`text-[8px] font-black mb-0.5 ${product.rakutenUrl ? 'text-red-500' : 'text-gray-400'}`}>R</span>
            <span className={`text-[9px] font-black tracking-tighter ${product.rakutenUrl ? 'text-red-700' : 'text-gray-400'}`}>楽天市場</span>
          </a>

          {/* Yahoo!ショッピング */}
          <a
            href={getMallUrl("Yahoo")}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/btn flex flex-col items-center justify-center py-1.5 rounded-xl border-2 transition-all active:scale-95
              ${product.yahooUrl 
                ? 'border-blue-100 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-500' 
                : 'border-gray-50 bg-gray-50/50 opacity-50 italic cursor-not-allowed'
              }`}
          >
            <span className={`text-[8px] font-black mb-0.5 ${product.yahooUrl ? 'text-blue-500' : 'text-gray-400'}`}>Y!</span>
            <span className={`text-[9px] font-black tracking-tighter ${product.yahooUrl ? 'text-blue-700' : 'text-gray-400'}`}>Yahoo!</span>
          </a>

          {/* Amazon */}
          <a
            href={getMallUrl("Amazon")}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn flex flex-col items-center justify-center py-1.5 rounded-xl border-2 border-orange-100 bg-orange-50/30 hover:bg-orange-50 hover:border-orange-500 transition-all active:scale-95"
          >
            <span className="text-[8px] font-black mb-0.5 text-orange-500">A</span>
            <span className="text-[9px] font-black tracking-tighter text-orange-700">Amazon</span>
          </a>
        </div>
      </div>
    </div>
  );
}
