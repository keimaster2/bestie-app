import FavoritesPage from "../[brand]/favorites/page";

export const runtime = 'edge';

// ルート直下の /favorites を処理
export default async function Page(props: any) {
  return <FavoritesPage {...props} />;
}
