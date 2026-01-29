"use client";

import FavoriteButton from "./FavoriteButton";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/lib/types";
import { SiteConfig } from "@/lib/config";
import { getBrandPath } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function ProductCard({ product, config }: { product: Product, config: SiteConfig }) {
  const [imgSrc, setImgSrc] = useState(product.image || "/placeholder.svg");
  const pathname = usePathname() || "";

  // 現在のブランドパスを特定
  const pathSegments = pathname.split('/');
  const brands = ["bestie", "beauty", "gadget"];
  const brandFromPath = brands.find(b => pathSegments.includes(b)) || "bestie";

  // もしもアフィリエイトIDを環境変数から取得
  const getMoshimoAid = (mall: "Rakuten" | "Yahoo") => {
    if (mall === "Rakuten" && config.affiliate.rakutenAid) return config.affiliate.rakutenAid;
    if (mall === "Yahoo" && config.affiliate.yahooAid) return config.affiliate.yahooAid;
    const key = mall === "Rakuten" ? "NEXT_PUBLIC_MOSHIMO_RAKUTEN_AID" : "NEXT_PUBLIC_MOSHIMO_YAHOO_AID";
    return process.env[key] || "";
  };

  // 詳細ページへのパラメータを組み立て
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

  const detailUrl = `${getBrandPath(brandFromPath, `/product/${product.id}`)}?${searchParams.toString()}`;

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

  return (
    <div className={`bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 flex relative h-[260px] group ${config.theme.borderRadius} ${config.theme.cardShadow}`}>
      {/* 左上のバッジ */}
      <div className="absolute -top-2 -left-2 z-10 flex items-center gap-1">
        {(product.rank !== undefined && product.rank !== null) ? (
          <div className="w-9 h-9 flex items-center justify-center rounded-full font-bold text-base text-white shadow-md border-2 border-white"
            style={{ backgroundColor: product.rank <= 3 ? 'var(--brand-accent)' : 'var(--brand-primary)' }}
          >
            {product.rank}
          </div>
        ) : (
          <div className={`px-2 py-1 rounded-md text-[10px] font-black text-white shadow-md border border-white tracking-wider`}
            style={{ backgroundColor: product.mall === "Yahoo" ? "#2563eb" : "#dc2626" }}
          >
            {product.mall === "Yahoo" ? "Yahoo!" : "楽天市場"}
          </div>
        )}
        {product.isWRank && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm border border-white text-white"
            style={{ backgroundColor: 'var(--brand-accent)' }}
          >
            🏆 W RANK
          </span>
        )}
      </div>

      <div className="absolute -top-3 -right-3 z-20 scale-90">
        <FavoriteButton product={{ ...product, id: product.id }} />
      </div>

      <div className={`w-1/3 bg-white flex-shrink-0 flex items-center justify-center relative p-2 border-r border-gray-100`}>
        <Image 
          src={imgSrc} 
          alt={product.title}
          fill
          sizes="(max-width: 768px) 33vw, 20vw"
          className="object-contain p-2"
          onError={() => setImgSrc("/placeholder.svg")}
        />
      </div>
      
      <div className="p-4 w-2/3 flex flex-col justify-between overflow-hidden">
        <div className="flex-grow overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] text-gray-400 truncate flex-1">{product.shopName}</div>
          </div>
          <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-3">
            <Link href={detailUrl} onClick={saveToHistory} className="hover:opacity-70 transition" style={{ color: 'var(--brand-primary)' }} prefetch={false}>
              {product.title}
            </Link>
          </h3>
          
          <div className="flex items-center gap-1 mb-2 text-xs">
            <span className="text-yellow-400 font-bold">★ {product.rating || 0}</span>
            <span className="text-gray-400">({(product.reviewCount || 0).toLocaleString()})</span>
          </div>

          <div className="text-lg font-bold text-red-600 font-mono leading-none">
            ¥{(product.price || 0).toLocaleString()}
          </div>

          {product.catchphrase && (
            <p className="mt-2 text-[10px] text-gray-500 line-clamp-2 italic leading-relaxed border-l-2 border-gray-100 pl-2">
              {product.catchphrase}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-auto">
          {/* Vivid Solid Colors */}
          <a
            href={getMallUrl("Rakuten")}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] font-black px-2 py-2 rounded flex-1 text-center transition-all shadow-sm active:scale-95
              ${product.rakutenUrl 
                ? 'bg-[#bf0000] text-white hover:bg-[#a00000]' 
                : 'bg-red-100 text-red-800 opacity-60 italic'
              }`}
          >
            楽天市場
          </a>
          <a
            href={getMallUrl("Yahoo")}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] font-black px-2 py-2 rounded flex-1 text-center transition-all shadow-sm active:scale-95
              ${product.yahooUrl 
                ? 'bg-[#ff0033] text-white hover:bg-[#e6002e]' 
                : 'bg-blue-100 text-blue-800 opacity-60 italic'
              }`}
          >
            Yahoo!
          </a>
          <a
            href={getMallUrl("Amazon")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-black px-2 py-2 rounded flex-1 text-center transition-all shadow-sm active:scale-95 bg-[#ff9900] text-white hover:bg-[#e68a00]"
          >
            Amazon
          </a>
        </div>
      </div>
    </div>
  );
}
