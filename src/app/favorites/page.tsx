"use client";

import FavoritesPage from "../[brand]/favorites/page";

export const runtime = 'edge';

// サブドメインおよび本家用のお気に入りページ
export default function DefaultFavorites(props: any) {
  // brand を空で渡す（遷移先のコンポーネント側でホスト名から自動判定される）
  const params = Promise.resolve({ brand: "" });
  return <FavoritesPage {...props} params={params} />;
}
