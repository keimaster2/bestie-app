"use client";

import FavoritesPage from "../[brand]/favorites/page";

// 本家用お気に入りページ (/)
export default function DefaultFavorites(props: any) {
  // brand パラメータを "bestie" として固定で渡す
  const params = Promise.resolve({ brand: "bestie" });
  return <FavoritesPage {...props} params={params} />;
}
