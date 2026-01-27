"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// お気に入り商品の型定義
export type FavoriteItem = {
  id: string; // 商品コードなどをIDにするのが理想だが、今回は簡易的にURL等をキーにする
  title: string;
  price: number;
  image: string;
  url: string;
  mall: "Amazon" | "Rakuten" | "Yahoo";
  shopName: string;
  addedAt: number;
};

type FavoritesContextType = {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, "addedAt">) => void;
  removeFavorite: (url: string) => void;
  isFavorite: (url: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初期ロード時にローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("life-best-x-favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 更新時にローカルストレージへ保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("life-best-x-favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (item: Omit<FavoriteItem, "addedAt">) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.url === item.url)) return prev;
      return [{ ...item, addedAt: Date.now() }, ...prev];
    });
  };

  const removeFavorite = (url: string) => {
    setFavorites((prev) => prev.filter((f) => f.url !== url));
  };

  const isFavorite = (url: string) => {
    return favorites.some((f) => f.url === url);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
