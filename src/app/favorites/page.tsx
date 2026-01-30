import FavoritesPage from "../[brand]/favorites/page";

export const runtime = 'edge';

type Props = {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const brand = resolvedParams.brand || "";
  
  const newParams = Promise.resolve({ ...resolvedParams, brand });
  // searchParams は FavoritesPage が期待していないため渡さない
  return <FavoritesPage params={newParams} />;
}
