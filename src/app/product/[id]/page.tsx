"use client";

export const runtime = 'edge';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { Product } from "@/lib/types";
import type { Metadata } from "next";

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fromParams: any = {};
    searchParams.forEach((value, key) => {
      fromParams[key] = value;
    });

    if (fromParams.title) {
      setProduct({
        id: "", 
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
      });
      setLoading(false);
    }

    paramsPromise.then((p) => {
      const cached = sessionStorage.getItem(`product-detail-${p.id}`);
      if (cached) {
        const data = JSON.parse(cached);
        setProduct((prev) => ({ ...prev, ...data, id: p.id }));
        setLoading(false);
      } else if (!fromParams.title) {
        setLoading(false);
      } else {
        setProduct((prev) => (prev ? { ...prev, id: p.id } : null));
      }
    });
  }, [searchParams, paramsPromise]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>商品が見つかりませんでした。</p>
        <Link href="/" className="text-blue-600 underline">トップへ戻る</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          戻る
        </button>
        <h1 className="font-bold text-sm truncate max-w-[200px]">{product.title}</h1>
        <div className="w-16 flex justify-end">
          <FavoriteButton product={product} />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4">
        {/* 商品画像 (余白ありデザインを採用) */}
        <div className="bg-white flex items-center justify-center mb-8 py-12">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{product.shopName}</span>
            {product.rating > 0 && (
              <>
                <span>•</span>
                <span className="text-yellow-500 font-bold">★ {product.rating}</span>
                <span>({product.reviewCount.toLocaleString()})</span>
              </>
            )}
          </div>

          <h1 className="text-xl font-bold leading-relaxed text-gray-900">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-600 font-mono">
              ¥{product.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">税込</span>
          </div>
        </div>

        {/* PC用アクションボタン */}
        <div className="hidden sm:block mb-12">
            <a 
              href={
                product.mall === "Rakuten"
                  ? `https://af.moshimo.com/af/c/click?a_id=5355389&p_id=54&pc_id=54&pl_id=616&url=${encodeURIComponent(product.rakutenUrl || product.url)}`
                  : `https://af.moshimo.com/af/c/click?a_id=5355394&p_id=1225&pc_id=1925&pl_id=18502&url=${encodeURIComponent(product.yahooUrl || product.url)}`
              }
              target="_blank" 
              rel="noopener noreferrer"
              className={`block w-full py-4 rounded-xl text-center font-bold text-lg text-white shadow-lg transition-transform hover:scale-[1.02]
                ${product.mall === "Yahoo" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {product.mall === "Yahoo" ? "Yahoo!ショッピングで見る" : "楽天市場で見る"}
            </a>
        </div>

        {/* スマホ用固定アクションボタン */}
        <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-8 safe-area-bottom z-20">
          <div className="max-w-2xl mx-auto">
            <a 
              href={
                product.mall === "Rakuten"
                  ? `https://af.moshimo.com/af/c/click?a_id=5355389&p_id=54&pc_id=54&pl_id=616&url=${encodeURIComponent(product.rakutenUrl || product.url)}`
                  : `https://af.moshimo.com/af/c/click?a_id=5355394&p_id=1225&pc_id=1925&pl_id=18502&url=${encodeURIComponent(product.yahooUrl || product.url)}`
              }
              target="_blank" 
              rel="noopener noreferrer"
              className={`block w-full py-4 rounded-xl text-center font-bold text-lg text-white shadow-lg transition-transform active:scale-95
                ${product.mall === "Yahoo" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {product.mall === "Yahoo" ? "Yahoo!ショッピングで見る" : "楽天市場で見る"}
            </a>
          </div>
        </div>

        <div className="prose prose-sm text-gray-600 mt-8 pb-20">
          <h3 className="text-lg font-bold text-gray-900 mb-2">商品詳細</h3>
          <p className="whitespace-pre-wrap">
            {product.description || "詳細情報は各ストアページでご確認ください。"}
          </p>
        </div>
      </main>
    </div>
  );
}
