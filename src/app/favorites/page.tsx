import FavoritesPage from "../[brand]/favorites/page";

export const runtime = 'edge';

// ルートのお気に入り (/favorites)
export default function DefaultFavorites(props: any) {
  const params = Promise.resolve({ brand: "bestie" });
  return <FavoritesPage {...props} params={params} />;
}
