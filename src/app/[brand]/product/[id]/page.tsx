"use client";

export const runtime = 'edge';

import { useSearchParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "@/components/FavoriteButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { Product } from "@/lib/types";
import { getSiteConfig } from "@/lib/config";
import { useFavorites } from "@/context/FavoritesContext";
import { getBrandPath } from "@/lib/utils";
import { generateSmartDetailedReview } from "@/lib/lion-logic";

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ brand: string; id: string }>;
}) {
  const searchParams = useSearchParams();
  const params = use(paramsPromise);
  const { setBrand } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>("/placeholder.svg");
  const [insight, setInsight] = useState<{ analysis: string, tip: string } | null>(null);

  const config = getSiteConfig(params.brand);

  useEffect(() => {
    if (!params.brand) return;
    setBrand(params.brand);

    const fromParams: any = {};
    searchParams.forEach((value, key) => {
      fromParams[key] = value;
    });

    if (fromParams.title) {
      const initialProduct = {
        id: params.id, 
        title: fromParams.title,
        price: parseInt(fromParams.price || "0"),
        image: fromParams.image,
        mall: fromParams.mall,
        shopName: fromParams.shop,
        url: fromParams.url,
        rating: parseFloat(fromParams.rating || "0"),
        reviewCount: parseInt(fromParams.review || "0"),
        rakutenUrl: fromParams.rakutenUrl,
        yahooUrl: fromParams.yahooUrl,
        catchphrase: fromParams.catchphrase,
        rank: parseInt(fromParams.rank || "0"),
      };
      setProduct(initialProduct as Product);
      setImgSrc(fromParams.image || "/placeholder.svg");
      setInsight(generateSmartDetailedReview(initialProduct as Product, config, fromParams.mall === "Yahoo" ? "Yahoo!" : "楽天市場"));
      setLoading(false);
    }

    const cached = sessionStorage.getItem(`product-detail-${params.id}`);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setProduct((prev) => ({ ...prev, ...data, id: params.id }));
        setImgSrc(data.image || "/placeholder.svg");
        setInsight(generateSmartDetailedReview({ ...data, id: params.id } as Product, config, data.mall === "Yahoo" ? "Yahoo!" : "楽天市場"));
        setLoading(false);
      } catch (e) {
        console.error("Cache parse error", e);
      }
    } else if (!fromParams.title) {
      setLoading(false);
    }
  }, [searchParams, params.brand, params.id, setBrand, config]);

  const bgColor = config.theme.background;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <div className="text-gray-400 animate-pulse font-black uppercase tracking-widest text-xs">Analyzing Market Data...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: bgColor }}>
        <p className="font-bold text-gray-400">アイテムが見つかりませんでした</p>
        <Link href={getBrandPath(params.brand, "/")} className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold text-sm">トップへ戻る</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 font-sans transition-colors duration-500 text-gray-800"
      style={{ 
        backgroundColor: bgColor,
        "--brand-primary": config.themeColor.primary,
        "--brand-accent": config.themeColor.accent,
      } as React.CSSProperties}
    >
      <Header config={config} minimal={true} />

      <StructuredData type="Product" data={product} />

      <Breadcrumbs 
        brand={params.brand}
        config={config}
        items={[
          { label: product.mall === "Rakuten" ? "楽天市場" : "Yahoo!ショッピング", href: `${getBrandPath(params.brand, "/")}?mall=${product.mall.toLowerCase()}` },
          { label: "詳細分析" }
        ]}
      />

      <main className="max-w-4xl mx-auto p-4 md:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* 左カラム: 画像 */}
          <div className="space-y-4">
            <div className="bg-white flex items-center justify-center py-12 rounded-3xl shadow-sm relative aspect-square overflow-hidden border border-gray-100 group">
              <Image 
                src={imgSrc} 
                alt={product.title}
                fill
                className="object-contain p-10 transition-transform group-hover:scale-105 duration-700"
                onError={() => setImgSrc("/placeholder.svg")}
              />
              <div className="absolute top-4 right-4 scale-125">
                 <FavoriteButton product={product} />
              </div>
            </div>
          </div>

          {/* 右カラム: 情報 */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
              <span>{product.shopName}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-indigo-500">{product.mall} Official</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black leading-tight mb-4 text-gray-900 tracking-tighter">
              {product.title}
            </h1>

            {product.catchphrase && (
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl border-l-4 border-gray-200 italic text-gray-600 text-sm">
                「{product.catchphrase}」
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-red-600 font-mono">
                  ¥{(product.price || 0).toLocaleString()}
                </span>
                <span className="text-xs font-bold text-red-600">税込</span>
              </div>
              
              {product.rating > 0 && (
                <div className="flex flex-col border-l border-gray-100 pl-4">
                   <div className="flex items-center gap-1 text-yellow-500 font-black">
                     <span className="text-lg">★</span>
                     <span>{product.rating}</span>
                   </div>
                   <span className="text-[10px] font-bold text-gray-400">{(product.reviewCount || 0).toLocaleString()} 件のレビュー</span>
                </div>
              )}
            </div>

            {/* アクション */}
            <div className="space-y-3">
              <a 
                href={
                  product.mall === "Rakuten"
                    ? `https://af.moshimo.com/af/c/click?a_id=5355389&p_id=54&pc_id=54&pl_id=616&url=${encodeURIComponent(product.rakutenUrl || product.url)}`
                    : `https://af.moshimo.com/af/c/click?a_id=5355394&p_id=1225&pc_id=1925&pl_id=18502&url=${encodeURIComponent(product.yahooUrl || product.url)}`
                }
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-5 rounded-2xl text-center font-black text-xl text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95"
                style={{ backgroundColor: product.mall === "Yahoo" ? "#2563eb" : "#dc2626" }}
              >
                <span>{product.mall === "Rakuten" ? "楽天市場" : "Yahoo!ショッピング"}で購入する</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">各モールの公式サイトで安全に決済できます</p>
            </div>
          </div>
        </div>

        {/* ライオンくんの目利き（人間味セクション） */}
        {insight && (
          <div className="mt-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32"></div>
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-2xl shadow-lg border-2 border-white">🦁</div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tighter uppercase">ライオンくんの目利きノート</h2>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">データで読み解く市場のトレンド</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="prose prose-sm text-gray-600 max-w-none">
                    <h3 className="text-base font-bold text-gray-900">この商品が選ばれている理由</h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {insight.analysis}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-2">ライオンくんの耳打ち</h4>
                    <p className="text-xs text-indigo-800 leading-relaxed font-medium italic whitespace-pre-wrap">
                      「{insight.tip}」
                    </p>
                  </div>
                </div>
             </div>
          </div>
        )}

        <div className="mt-10 border-t border-gray-100 pt-10 pb-20 text-center">
            <Link href={getBrandPath(params.brand, "/")} className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
              ← ランキング一覧に戻る
            </Link>
        </div>
      </main>

      <Footer brand={params.brand} config={config} />
    </div>
  );
}
