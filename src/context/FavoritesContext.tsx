"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { FavoriteItem } from "@/lib/types";

type FavoritesContextType = {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, "addedAt">) => void;
  removeFavorite: (url: string) => void;
  isFavorite: (url: string) => boolean;
  setBrand: (brand: string) => void;
  isLoaded: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ 
  children,
  initialBrand = "bestie" 
}: { 
  children: React.ReactNode,
  initialBrand?: string 
}) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [currentBrand, setCurrentBrand] = useState<string>(initialBrand);
  const [isLoaded, setIsLoaded] = useState(false);
  const isLoadedRef = useRef(false);

  // ブランドが変更されたら、そのブランドのお気に入りをロードする
  useEffect(() => {
    setIsLoaded(false);
    isLoadedRef.current = false;
    const key = `${currentBrand}-favorites`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
    setIsLoaded(true);
    isLoadedRef.current = true;
  }, [currentBrand]);

  // お気に入りが更新されたら保存する
  useEffect(() => {
    // ロード完了後のみ保存を実行
    if (isLoadedRef.current) {
      localStorage.setItem(`${currentBrand}-favorites`, JSON.stringify(favorites));
    }
  }, [favorites, currentBrand]);

  const addFavorite = useCallback((item: Omit<FavoriteItem, "addedAt">) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.url === item.url)) return prev;
      return [{ ...item, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((url: string) => {
    setFavorites((prev) => prev.filter((f) => f.url !== url));
  }, []);

  const isFavorite = useCallback((url: string) => {
    return favorites.some((f) => f.url === url);
  }, [favorites]);

  const setBrand = useCallback((brand: string) => {
    if (brand && brand !== "default") {
      setCurrentBrand(brand);
    }
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, setBrand, isLoaded }}>
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
