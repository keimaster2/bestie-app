"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";

type ProductDetail = {
  id: string;
  title: string;
  price: number;
  image: string;
  mall: "Amazon" | "Rakuten" | "Yahoo";
  shopName: string;
  url: string;
  rating: number;
  reviewCount: number;
  description?: string;
};

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. URLパラメータから復元（最速）
    const fromParams: any = {};
    searchParams.forEach((value, key) => {
      fromParams[key] = value;
    });

    if (fromParams.title) {
      setProduct({
        id: "", // paramsから取得するので後でセット
        title: fromParams.title,
        price: parseInt(fromParams.price || "0"),
        image: fromParams.image,
        mall: fromParams.mall,
        shopName: fromParams.shop,
        url: fromParams.url,
        rating: parseFloat(fromParams.rating || "0"),
        reviewCount: parseInt(fromParams.review || "0"),
      });
      setLoading(false);
    }

    // 2. IDを取得して、必要ならAPIを叩く（今回はURLパラメータ渡しを基本とするが、拡張性のため）
    paramsPromise.then((p) => {
      // sessionStorageからリッチな情報を取得（descriptionなどがあれば）
      const cached = sessionStorage.getItem(`product-detail-${p.id}`);
      if (cached) {
        const data = JSON.parse(cached);
        setProduct((prev) => ({ ...prev, ...data, id: p.id }));
        setLoading(false);
      } else if (!fromParams.title) {
        // パラメータもなくキャッシュもない場合（直リンクなど）
        // ここでAPI fetchなどを実装するが、今はエラー表示
        setLoading(false);
      } else {
        // IDだけセット
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
      {/* ナビゲーション */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          戻る
        </Link>
        <h1 className="font-bold text-sm truncate max-w-[200px]">{product.title}</h1>
        <div className="w-16 flex justify-end">
          <FavoriteButton product={product} />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4">
        {/* 商品画像 */}
        <div className="bg-white flex items-center justify-center mb-6 relative overflow-hidden -mx-4">
          <div className="relative w-full aspect-square max-h-[400px]">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.image} 
              alt={product.title}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
           <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur border shadow-sm
             ${product.mall === "Yahoo" ? "text-blue-600 border-blue-200" : "text-red-600 border-red-200"}`}>
             {product.mall === "Yahoo" ? "Yahoo!" : "Rakuten"}
           </span>
        </div>

        {/* 商品情報 */}
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

        {/* PC用アクションボタン（コンテンツ内に配置） */}
        <div className="hidden sm:block mb-12">
            <a 
              href={product.url} 
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
              href={product.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`block w-full py-4 rounded-xl text-center font-bold text-lg text-white shadow-lg transition-transform active:scale-95
                ${product.mall === "Yahoo" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {product.mall === "Yahoo" ? "Yahoo!ショッピングで見る" : "楽天市場で見る"}
            </a>
          </div>
        </div>

        {/* スペックや詳細（あれば） */}
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
