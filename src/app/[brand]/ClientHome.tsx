"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import RankingList from "@/components/RankingList";
import StructuredData from "@/components/StructuredData";
import { SiteConfig, CategoryConfig } from "@/lib/config";
import { Product } from "@/lib/types";
import { useFavorites } from "@/context/FavoritesContext";
import { useEffect, useState } from "react";
import { getDailyLionShout } from "@/lib/lion-logic";

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
  currentGenre: CategoryConfig | null,
  breadcrumbItems: { label: string, href?: string }[]
}) {
  const { setBrand } = useFavorites();
  const [shout, setShout] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setBrand(params.brand);
    
    // 最初のカテゴリー（総合）の場合のみ、かつ検索中でない場合にShoutを表示
    // モールごとにカテゴリーリストが違うため、安全に判定
    const categories = (mall === "yahoo" ? config.yahooCategories : config.rakutenCategories) || [];
    const isRootGenre = categories.length > 0 && genreId === categories[0].id;

    if (isRootGenre && !isSearchMode) {
      const today = new Date().toLocaleDateString('ja-JP');
      const dismissedToday = localStorage.getItem(`lion-shout-dismissed-${params.brand}-${today}`);
      if (!dismissedToday) {
        setShout(getDailyLionShout());
        setIsVisible(true);
      }
    }
  }, [params.brand, setBrand, genreId, config.rakutenCategories, config.yahooCategories, isSearchMode, mall]);

  const handleDismiss = () => {
    setIsVisible(false);
    const today = new Date().toLocaleDateString('ja-JP');
    localStorage.setItem(`lion-shout-dismissed-${params.brand}-${today}`, "true");
  };

  const mallName = mall === "yahoo" ? "Yahoo!" : "楽天市場";

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

      <StructuredData type="ItemList" data={{ products }} />

      <div className="bg-gray-900 text-white py-1.5 overflow-hidden whitespace-nowrap relative border-b border-gray-800 opacity-90">
        <div className="flex animate-marquee items-center gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 min-w-full text-[9px] uppercase tracking-widest font-black">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                Market Insights
              </span>
              <span className="text-gray-500">Analysis: {new Date().getHours()}:00 JST</span>
              <span className="text-indigo-400">⚡ Best-Sellers Updated</span>
              <span className="text-gray-500">Source: Mall Sales Data</span>
            </div>
          ))}
        </div>
      </div>

      <Breadcrumbs 
        brand={params.brand}
        config={config}
        items={breadcrumbItems}
      />

      {/* スマートで閉じられるDAILY SHOUT */}
      {isVisible && shout && (
        <div className="max-w-4xl mx-auto px-4 mt-4 mb-2">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-4 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
            
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl relative border border-white/30">
              🦁
              <div className="absolute -top-0.5 -right-0.5 bg-green-400 w-3 h-3 rounded-full border-2 border-indigo-700 shadow-sm animate-pulse"></div>
            </div>
            
            <div className="flex-grow min-w-0 pr-6">
              <p className="text-sm font-bold leading-tight line-clamp-2">
                {shout}
              </p>
            </div>

            <button 
              onClick={handleDismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              aria-label="閉じる"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black tracking-tight text-gray-900">
              {isSearchMode ? `「${query}」の検索結果` : `${currentGenre?.name || ''}・人気売れ筋`}
            </h2>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded border 
              ${mall === "yahoo" ? "bg-white text-blue-600 border-blue-600" : "bg-white text-red-600 border-red-600"}`}>
              {mallName}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            {isSearchMode 
              ? `${products.length} Items Identified` 
              : `Curated best-sellers based on cumulative market data`}
          </p>
        </div>

        {products.length > 0 ? (
          <RankingList products={products} config={config} />
        ) : (
          <div className="text-center py-20 text-gray-400 font-bold">
            データを取得できませんでした。時間をおいて再度お試しください。
          </div>
        )}
      </main>

      <Footer brand={params.brand} config={config} />
    </div>
  );
}
