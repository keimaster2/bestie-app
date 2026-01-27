"use client";

import { useFavorites } from "@/context/FavoritesContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 font-sans">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <span className="text-2xl">👑</span>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap">
                Life Best X
              </h1>
            </Link>
          </div>
          <div className="font-bold text-sm text-gray-500">お気に入り</div>
        </div>
      </header>

      {/* メインコンテンツ */}
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
              // ProductCardの型に合わせて変換（お気に入りにはrankがない）
              <ProductCard
                key={item.url}
                product={{
                  ...item,
                  id: item.url, // URLをID代わりに
                  rating: 0, // 簡易版なのでレーティング情報は省略されることがある
                  reviewCount: 0,
                  rank: undefined
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 mb-4">お気に入りはまだありません</p>
            <Link
              href="/"
              className="inline-block bg-gray-900 text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-600 transition"
            >
              ランキングを見に行く
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
