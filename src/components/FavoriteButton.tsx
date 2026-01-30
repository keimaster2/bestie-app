"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { FavoriteItem } from "@/lib/types";
import { useEffect, useState } from "react";

export default function FavoriteButton({ product }: { product: Omit<FavoriteItem, "addedAt"> }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [active, setActive] = useState(false);

  // クライアントサイドでのみ判定を実行（ハイドレーションエラー回避）
  useEffect(() => {
    setActive(isFavorite(product.url));
  }, [isFavorite, product.url]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // リンク遷移を防ぐ
    // マウント前（LocalStorage未読込）のクリックを無視して誤操作を防ぐ
    if (typeof window === "undefined") return;
    
    if (active) {
      removeFavorite(product.url);
      setActive(false);
    } else {
      addFavorite(product);
      setActive(true);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full shadow-sm transition-all duration-200 z-20 ${
        active
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white/80 text-gray-400 hover:text-red-400 hover:bg-white"
      }`}
      aria-label={active ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
