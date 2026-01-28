"use client";

import { useFavorites } from "@/context/FavoritesContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";
import { Product } from "@/lib/types";
import { getSiteConfig } from "@/lib/config";
import { getBrandPath } from "@/lib/utils";
import Breadcrumbs from "@/components/Breadcrumbs";

export const runtime = 'edge';

export default function FavoritesPage({
  params: paramsPromise,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { favorites, setBrand } = useFavorites();
  const router = useRouter();
  const params = use(paramsPromise);
  
  const config = getSiteConfig(params.brand);

  useEffect(() => {
    setBrand(params.brand);
  }, [params.brand, setBrand]);

  return (
    <div className="min-h-screen pb-20 font-sans transition-colors duration-500 text-gray-800"
      style={{ backgroundColor: config.theme.background }}
    >
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link 
              href={getBrandPath(params.brand, "/")} 
              className="flex items-center gap-2 hover:opacity-80 transition group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🎁</span>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap" style={{ color: config.themeColor.primary }}>
                {config.brandName}
              </h1>
            </Link>
          </div>
          <div className="font-bold text-sm text-gray-500">お気に入り</div>
        </div>
      </header>

      <Breadcrumbs 
        brand={params.brand}
        config={config}
        items={[{ label: "お気に入り" }]}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Favorites</h2>
          <p className="text-sm text-gray-500">
            保存した商品リスト（{favorites.length}件）
          </p>
        </div>

        {favorites.length > 0 ? (
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
            <Link
              href={getBrandPath(params.brand, "/")}
              className="inline-block bg-gray-900 text-white font-bold py-2 px-6 rounded-full hover:opacity-80 transition"
              style={{ backgroundColor: config.themeColor.primary }}
            >
              ランキングを見に行く
            </Link>
          </div>
        )}
      </main>

      {/* フッターを追加 */}
      <footer className="bg-white border-t border-gray-100 pt-12 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🎁</span>
            <span className="text-xl font-black tracking-tight text-gray-900" style={{ color: config.themeColor.primary }}>{config.brandName}</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            <Link href={getBrandPath(params.brand, "/about")} className="hover:text-gray-600 underline underline-offset-2 decoration-gray-200 mr-4">当サイトについて（免責事項）</Link>
            このサイトはアフィリエイト広告（Amazonアソシエイト含む）を掲載しています。<br />
            &copy; {new Date().getFullYear()} {config.brandName} - BEST ITEM SELECTION.
          </p>
        </div>
      </footer>
    </div>
  );
}
