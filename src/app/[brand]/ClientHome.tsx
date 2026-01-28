"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import RankingList from "@/components/RankingList";
import { SiteConfig } from "@/lib/config";
import { Product } from "@/lib/types";
import { useFavorites } from "@/context/FavoritesContext";
import { useEffect } from "react";

export default function ClientHome({ 
  params, 
  config, 
  products, 
  mall, 
  query, 
  genreId, 
  isSearchMode, 
  currentGenre,
  breadcrumbItems
}: { 
  params: { brand: string },
  config: SiteConfig,
  products: Product[],
  mall: string,
  query: string,
  genreId: string,
  isSearchMode: boolean,
  currentGenre: any,
  breadcrumbItems: any[]
}) {
  const { setBrand } = useFavorites();

  useEffect(() => {
    setBrand(params.brand);
  }, [params.brand, setBrand]);

  const mallName = mall === "yahoo" ? "Yahoo!" : "楽天市場";
  const mallFullName = mall === "yahoo" ? "Yahoo!ショッピング" : "楽天市場";

  return (
    <div 
      className="min-h-screen pb-20 font-sans transition-colors duration-500 text-gray-800" 
      style={{ 
        backgroundColor: config.theme.background,
        "--brand-primary": config.themeColor.primary,
        "--brand-accent": config.themeColor.accent,
      } as React.CSSProperties}
    >
      <Header 
        mall={mall} 
        query={query} 
        genreId={genreId} 
        isSearchMode={isSearchMode} 
        config={config}
      />

      <Breadcrumbs 
        brand={params.brand}
        config={config}
        items={breadcrumbItems}
      />

      <main className="max-w-4xl mx-auto px-4 py-4">
        {!isSearchMode && (
          <div className="mb-8 p-4 bg-white rounded-2xl border border-indigo-50 shadow-sm flex items-start gap-3">
            <span className="text-2xl mt-1">💡</span>
            <div>
              <h3 className="font-bold text-sm text-indigo-900 mb-1">{config.brandName}のセレクト理由</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {config.eeat.expertComment}
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">
              {isSearchMode ? `「${query}」の検索結果` : `${currentGenre.name}人気ランキング`}
            </h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border 
              ${mall === "yahoo" ? "bg-white text-blue-600 border-blue-600" : "bg-white text-red-600 border-red-600"}`}>
              {mallName}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {isSearchMode 
              ? `${products.length}件の商品が見つかりました` 
              : `${mallFullName}で「今まさに売れている」人気商品`}
          </p>
        </div>

        {products.length > 0 ? (
          <RankingList products={products} config={config} />
        ) : (
          <div className="text-center py-20 text-gray-400">
            データが取得できませんでした。
          </div>
        )}
      </main>

      <Footer brand={params.brand} config={config} />
    </div>
  );
}
