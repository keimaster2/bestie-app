"use client";

import { FavoritesProvider } from "@/context/FavoritesContext";

export function Providers({ children, initialBrand }: { children: React.ReactNode, initialBrand?: string }) {
  return <FavoritesProvider initialBrand={initialBrand}>{children}</FavoritesProvider>;
}
