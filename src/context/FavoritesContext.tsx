"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { FavoriteItem } from "@/lib/types";

type FavoritesContextType = {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, "addedAt">) => void;
  removeFavorite: (url: string) => void;
  isFavorite: (url: string) => boolean;
  setBrand: (brand: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [currentBrand, setCurrentBrand] = useState<string>("bestie");
  const [isInitialized, setIsInitialized] = useState(false);

  // ブランドが変更されたら、そのブランドのお気に入りをロードする
  useEffect(() => {
    const saved = localStorage.getItem(`${currentBrand}-favorites`);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load favorites", e);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
    setIsInitialized(true);
  }, [currentBrand]);

  // お気に入りが更新されたら保存する
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(`${currentBrand}-favorites`, JSON.stringify(favorites));
    }
  }, [favorites, currentBrand, isInitialized]);

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
    setCurrentBrand(brand);
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, setBrand }}>
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
