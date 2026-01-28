"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { FavoriteItem } from "@/lib/types";

type FavoritesContextType = {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, "addedAt">) => void;
  removeFavorite: (url: string) => void;
  isFavorite: (url: string) => boolean;
  setBrand: (brand: string) => void; // ブランドを設定する機能を追加
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentBrand, setCurrentBrand] = useState("bestie");

  // 初期ロード時
  useEffect(() => {
    const saved = localStorage.getItem(`${currentBrand}-favorites`);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    } else {
      setFavorites([]);
    }
    setIsLoaded(true);
  }, [currentBrand]);

  // 更新時に保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`${currentBrand}-favorites`, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded, currentBrand]);

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
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, setBrand: setCurrentBrand }}>
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
