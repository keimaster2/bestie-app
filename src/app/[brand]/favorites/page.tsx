"use client";

import { useFavorites } from "@/context/FavoritesContext";
import ProductCard from "@/components/ProductCard";
import { use, useEffect } from "react";
import { Product } from "@/lib/types";
import { getSiteConfig } from "@/lib/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const runtime = 'edge';

export default function FavoritesPage({
  params: paramsPromise,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { favorites, setBrand, isLoaded } = useFavorites();
  const params = use(paramsPromise);
  
  const brandKey = (params.brand && params.brand !== "default") ? params.brand : (typeof window !== "undefined" ? window.location.hostname : "");
  const config = getSiteConfig(brandKey);

  // マウント時とブランド変更時にコンテキストを更新
  useEffect(() => {
    // params.brand が空（サブドメイン運用）の場合を考慮し、config.id を使用する
    setBrand(config.id);
  }, [config.id, setBrand]);

  return (
    <div className="min-h-screen pb-20 font-sans transition-colors duration-500 text-gray-800"
      style={{ 
        backgroundColor: config.theme.background,
        "--brand-primary": config.themeColor.primary,
        "--brand-accent": config.themeColor.accent,
      } as React.CSSProperties}
    >
      <Header config={config} minimal={true} />

      <Breadcrumbs 
        brand={params.brand}
        config={config}
        items={[{ label: "お気に入り" }]}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">お気に入り</h2>
          <p className="text-sm text-gray-500">
            保存した商品リスト（{favorites.length}件）
          </p>
        </div>

        {!isLoaded ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400 animate-pulse font-black uppercase tracking-widest text-xs">読み込み中...</div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((item) => (
              <ProductCard
                key={item.url}
                product={{ ...item, rank: undefined } as Product}
                config={config}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 mb-4">お気に入りはまだありません</p>
          </div>
        )}
      </main>

      <Footer brand={params.brand} config={config} />
    </div>
  );
}
